var createError = require('http-errors');
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var compression = require('compression');
var helmet = require('helmet');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');

app.use(helmet()); //secure

var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var loginRouter = require('./routes/loginSession');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(compression());

app.use(session({
  HttpOnly:true,
  //secure: true,
  secret: 'asdfasdfasdf',
  resave: false,
  saveUninitialized: true,
  store:new FileStore()
}))


var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//router
app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
