const express = require('express');
const app = express();
const compression = require('compression');
const spicedPg = require('spiced-pg');
const bcrypt = require('./bcrypt.js');
const secrets = require('./secrets.json');
const bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
app.use(cookieSession({
    secret: secrets.sessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

// var csrf = require('csurf');
// var csrfProtection = csrf();

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
    // console.log(req.body);
    bcrypt.hashPassword(req.body.pass).then(function(hash){
        return db.query(`INSERT INTO users (first, last, email, pass) VALUES ($1, $2, $3, $4) RETURNING id`, [req.body.first, req.body.last, req.body.email, hash])
    }).then((result) => {
        req.session.user = { id: result.rows[0].id, first: req.body.first, last: req.body.last };
        res.json({
            success: true
        });
    }).catch((err)=> {
        console.log(err);
        res.json({
            success: false
        });
    });
});

app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
