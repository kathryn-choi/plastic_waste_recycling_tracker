// module
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var request = require('request');
const SequelizeAuto = require('sequelize-auto');
var async = require('async');

// routing
var index = require('./routes/index');
var admin = require('./routes/admin');
var conveyancer = require('./routes/conveyancer');
var emitter = require('./routes/emitter');
var handler = require('./routes/handler');
var recycler = require('./routes/recycler');
//var network = require('./recycling_tracker/network.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  key: 'sid', // 세션키
  secret: 'secret', // 비밀키
  cookie: {
    maxAge: 1000 * 60 * 60 // 쿠키 유효기간 1시간
  }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/admin', admin);
app.use('/conveyancer', conveyancer);
app.use('/emitter', emitter);
app.use('/handler', handler);
app.use('/recycler', recycler);

connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password123',
  port     : 3306,
  database : 'recycling',
});

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
console.log("app");
var server = app.listen(4000);
module.exports = app;
