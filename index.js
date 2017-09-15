const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const compression = require('compression');
const spicedPg = require('spiced-pg');
const bcrypt = require('./bcrypt.js');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const fs = require('fs');
var multer = require('multer');
var uidSafe = require('uid-safe');
var path = require('path');

const ACCEPTED = 1, PENDING = 2, CANCELED = 3, TERMINATED = 4, REJECTED = 5;


var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        filesize: 2097152
    }
});

const knox = require('knox');
let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets'); // secrets.json is in .gitignore
}
const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: 'peppermountain'
});

app.use(cookieParser());

var cookieSession = require('cookie-session');
app.use(cookieSession({
    secret: secrets.sessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    secure: process.env.NODE_ENV == 'production'
}));
var db = spicedPg(`postgres:${secrets.dbUser}:${secrets.dbPass}@localhost:5432/socialnetwork`);

var csurf = require('csurf');
app.use(csurf());
app.use(function(req, res, next){
    res.cookie('spicedsocial', req.csrfToken());
    next();
});

app.use(compression());

app.use(bodyParser.json());


if (process.env.NODE_ENV != 'production') {
    app.use('/bundle.js', require('http-proxy-middleware')({
        target: 'http://localhost:8081'
    }));
}

app.use(express.static('./public'));

app.get('/', function(req, res){
    if (!req.session.user){
        return res.redirect('/welcome');
    }
    res.sendFile(__dirname + '/index.html');
});

app.get('/welcome', function(req, res){
    if(req.session.user){
        return res.redirect('/');
    }
    res.sendFile(__dirname + '/index.html');
});

app.post('/register', function(req, res){
    if (req.body.first && req.body.last && req.body.email && req.body.pass) {
        var pic = `default${Math.floor(Math.random() * 7) + 1}.jpg`;
        bcrypt.hashPassword(req.body.pass).then(function(hash){
            return db.query(`INSERT INTO users (first, last, email, pass, pic) VALUES ($1, $2, $3, $4, $5) RETURNING id, bio, pic`, [req.body.first, req.body.last, req.body.email, hash, pic]);
        }).then((result) => {
            req.session.user = { id: result.rows[0].id, first: req.body.first, last: req.body.last, bio: result.rows[0].bio, pic: result.rows[0].pic };
            res.json({
                success: true
            });
        }).catch((err)=> {
            console.log(err);
            if (err.code == 23505) {
                res.json({
                    success: false,
                    error: 'This Email address is already in use. Please choose a different one!'
                });
            } else{
                res.json({
                    success: false,
                    error: 'Something went wrong. Please try again!'
                });
            }
        });

    } else {
        res.json({
            success: false,
            error: 'Please fill out all fields!'
        });
    }
});

app.post('/login', (req, res) => {
    if (req.body.email && req.body.pass){
        var userInfo;
        return db.query(`SELECT * FROM users WHERE email = $1`, [req.body.email]).then((result) => {
            userInfo = result;
            return bcrypt.checkPassword(req.body.pass, result.rows[0].pass);
        }).then((correctPass) => {
            if (correctPass) {
                req.session.user = { id: userInfo.rows[0].id, first: userInfo.rows[0].first, last: userInfo.rows[0].last, bio: userInfo.rows[0].bio, pic: userInfo.rows[0].pic };
                res.json({
                    success: true
                });
            } else  {
                res.json({
                    success: false,
                    error: 'Wrong mail or password, please try again!'
                });
            }
        }).catch((err) => {
            console.log(err);
            res.json({
                success: false,
                error: 'Wrong mail or password, please try again!'
            });
        });

    } else {
        res.json({
            success: false,
            error: 'Please fill out both fields!'
        });
    }
});

app.get('/api/friends', (req, res) => {
    if (req.session.user) {
        db.query(`SELECT users.id, first, last, pic, status FROM friends JOIN users ON (status = ${PENDING} AND rec_id = $1 AND send_id = users.id) OR (status = ${ACCEPTED} AND rec_id = $1 AND send_id = users.id) OR (status = ${ACCEPTED} AND send_id = $1 AND rec_id = users.id)`, [req.session.user.id]).then((result) => {
            res.json({
                friends: result.rows
            });
        });
    }
});

app.get('/api/user', (req,res) => {
    if (req.session.user){
        res.json({
            id: req.session.user.id,
            first: req.session.user.first,
            last: req.session.user.last,
            bio: req.session.user.bio,
            pic: req.session.user.pic,
            url: "http://peppermountain.s3.amazonaws.com/"
        });
    }
});

app.get('/user/:id',(req, res) => {
    if (!req.session.user){
        return res.redirect('/welcome');
    }
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/user/:id', (req,res) => {
    if (req.session.user){
        return db.query(`SELECT * FROM friends WHERE (send_id = $1 AND rec_id = $2) OR (rec_id = $1 AND send_id = $2)`, [req.session.user.id, req.params.id]).then(function(result){
            let friendStatus = 0, sendId = null;
            if (result.rows[0]){
                friendStatus = result.rows[0].status;
                sendId = result.rows[0].send_id;
            }
            return db.query(`SELECT * FROM users WHERE id = $1`, [req.params.id]).then((result) => {
                res.json({
                    id: result.rows[0].id,
                    first: result.rows[0].first,
                    last: result.rows[0].last,
                    bio: result.rows[0].bio,
                    pic: result.rows[0].pic,
                    url: "http://peppermountain.s3.amazonaws.com/",
                    status: friendStatus,
                    sendId: sendId
                });
            });
        }).catch(function(err) {
            console.log(err);
        });
    }
});

app.post('/api/friendUpdate/:id', (req,res) => {
    if (req.session.user){
        if (req.body.status == 0) {
            db.query(`INSERT INTO friends (send_id, rec_id, status) VALUES ($1, $2, $3) RETURNING send_id, status`, [req.session.user.id, req.params.id, 2]).then((result)=> {
                res.json({
                    sendId: result.rows[0].send_id,
                    status: result.rows[0].status
                });
            }).catch(function(err) {
                console.log(err);
            });

        } else if (req.body.status == 1 || req.body.status == 2) {
            var newStatus;
            if (req.body.status == 1) {
                newStatus = 4;
            } else if (req.body.status == 2 && req.body.sendId == req.session.user.id) {
                newStatus = 3;
            } else if (req.body.status == 2 && req.body.sendId == req.params.id) {
                newStatus = 1;
            }
            db.query(`UPDATE friends SET status = $1 WHERE (send_id = $2 AND rec_id = $3) OR (rec_id = $2 AND send_id = $3) RETURNING send_id, status`, [newStatus, req.session.user.id, req.params.id]).then((result) => {
                res.json({
                    sendId: result.rows[0].send_id,
                    status: result.rows[0].status
                });
            }).catch(function(err) {
                console.log(err);
            });

        } else {
            db.query(`UPDATE friends SET status = $1, send_id = $2, rec_id = $3 WHERE (send_id = $2 AND rec_id = $3) OR (rec_id = $2 AND send_id = $3) RETURNING send_id, status`, [2, req.session.user.id, req.params.id]).then((result) => {
                res.json({
                    sendId: result.rows[0].send_id,
                    status: result.rows[0].status
                });
            }).catch(function(err) {
                console.log(err);
            });
        }
    }
});

app.post('/api/reject/:id', (req,res) => {
    console.log('rejecting');
    if (req.session.user){
        db.query(`UPDATE friends SET status = $1, send_id = $2, rec_id = $3 WHERE (rec_id = $2 AND send_id = $3) RETURNING send_id, status`, [5, req.session.user.id, req.params.id]).then((result) => {
            res.json({
                sendId: result.rows[0].send_id,
                status: result.rows[0].status
            });
        }).catch(function(err) {
            console.log(err);
        });
    }
});

app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
});

app.post('/picupload', uploader.single('pic'), uploadToS3, (req, res) => {
    db.query(`UPDATE users SET pic = $1 WHERE id = $2`, [req.file.filename, req.session.user.id]).catch(function(err) {
        console.log(err);
    });
    req.session.user.pic = req.file.filename;
    res.json({
        success: true,
        pic: req.file.filename
    });
});

app.post('/updatebio', (req, res) => {
    db.query(`UPDATE users SET bio = $1 WHERE id = $2`, [req.body.bio, req.session.user.id]).catch(function(err) {
        console.log(err);
    });
    req.session.user.bio = req.body.bio;
    res.json({
        success: true,
        bio: req.body.bio
    });
});



// |-----------  SOCKET.IO MAGIC ------------------->


const loggedInUsers = [];
app.get('/connected/:socketId', (req, res) => {
    if (req.session.user){
        if (!loggedInUsers.some(checkOnlineId) && io.sockets.sockets[req.params.socketId]) {
            loggedInUsers.push({
                userId: req.session.user.id,
                userSocket: req.params.socketId
            });

            var loggedInIds = loggedInUsers.map(function(user) {
                return user.userId;
            });

            db.query(`SELECT id, first, last, pic FROM users WHERE id = ANY($1)`, [loggedInIds]).then(function(result) {
                io.sockets.sockets[req.params.socketId].emit('onlineUsers', {
                    onlineUsers: result.rows
                });
                var userObj = { id: req.session.user.id, first: req.session.user.first, last: req.session.user.last, pic: req.session.user.pic };

                io.sockets.emit('userJoined', {
                    newOnline: userObj
                });
            });


        }
    }


    function checkOnlineId(user) {
        return user.userSocket === req.params.socketId;
    }
});


io.on('connection', function(socket) {
    console.log(`socket with the id ${socket.id} is now connected`);
    socket.on('disconnect', function(){
        console.log(`socket with the id ${socket.id} is now disconnected`);
        var index = loggedInUsers.findIndex(user => user.userSocket === socket.id);
        var userId;
        if (index > -1) {
            userId = loggedInUsers[index].userId;
            loggedInUsers.splice(index, 1);
        }

        if (index > -1 && !loggedInUsers.some((user) => { return user.userId === userId; })) {
            socket.broadcast.emit('userLeft', {
                userLeft: userId
            });
        }
    });

    socket.emit('welcome', {
        message: 'Welcome to our server. It is nice to have you here.'
    });

});


// <-----------  END OF SOCKET.IO MAGIC  -------------------|


app.get('*', function(req, res) {
    if (!req.session.user){
        return res.redirect('/welcome');
    }
    res.sendFile(__dirname + '/index.html');
});



server.listen(8080, function() {
    console.log("I'm listening.");
});

function uploadToS3(req, res, next) {
    // console.log(req);
    const s3Request = client.put(req.file.filename, {
        'Content-Type': req.file.mimetype,
        'Content-Length': req.file.size,
        'x-amz-acl': 'public-read'
    });

    const readStream = fs.createReadStream(req.file.path);
    readStream.pipe(s3Request);

    s3Request.on('response', function(resp) {
        if (resp.statusCode != 200) {
            res.json({
                success: false
            });
        } else {
            next();
            fs.unlink(req.file.path);
        }
    });
}
