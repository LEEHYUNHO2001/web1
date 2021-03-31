const express = require('express')
const app = express()
const port = 3000
const fs = require('fs');
const path = require('path');

var compression = require('compression');
var helmet = require('helmet');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var db = require('./lib/db');

app.use(helmet()); //secure

//request.list 선언
app.get('*', function (request, response, next) {
    request.list = db.get('topics').value();
    next();
  });

var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var loginRouter = require('./routes/loginSession');
var registerRouter = require('./routes/register');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(compression());

app.use(session({
    //HttpOnly:true,
    secure: false,
    secret: 'asdfasdfasdf',
    resave: false,
    saveUninitialized: true,
    store:new FileStore()
}))

var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', indexRouter)
app.use('/topic', topicRouter)
app.use('/auth', loginRouter)
app.use('/auth2', registerRouter)


app.use(function(request, response, next){
    response.status(404).send('페이지를 찾을 수 없습니다.');
});

app.use(function(err, request, response, next){
    console.error(err.stack);
    response.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});