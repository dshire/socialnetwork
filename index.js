const express = require('express');
const app = express();
const compression = require('compression');
const spicedPg = require('spiced-pg');
const bcrypt = require('./bcrypt.js');

const bodyParser = require('body-parser');

var multer = require('multer');
var uidSafe = require('uid-safe');
var path = require('path');

// var csrf = require('csurf');
// var csrfProtection = csrf();


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
    bucket: 'reallydavid'
});

var cookieSession = require('cookie-session');
app.use(cookieSession({
    secret: secrets.sessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));
var db = spicedPg(`postgres:${secrets.dbUser}:${secrets.dbPass}@localhost:5432/socialnetwork`);

app.use(compression());

app.use(bodyParser.json());

app.use(require('cookie-parser')());


if (process.env.NODE_ENV != 'production') {
    app.use(require('./build'));
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


app.get('/user', (req,res) => {
    if (req.session.user){
        res.json({
            first: req.session.user.first,
            last: req.session.user.last,
            bio: req.session.user.bio,
            pic: req.session.user.pic,
            url: "http://peppermountain.s3.amazonaws.com/"
        });
    }
});


app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
});

app.listen(8080, function() {
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
        }
    });
}
