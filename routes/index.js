var express = require('express');
var request = require('request');
var mysql      = require('mysql');
var async = require('async');

var cryptoM = require('./../public/modules/cryptoM.js');
var router = express.Router();

console.log('index');
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('get homepage');
  res.render('index',{
    title: "Home"
  });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Express' });
});

router.post('/signup', function(req, res, next) {
  var id=req.body.id;
  var pw=req.body.pw;
  var user_type=req.body.user_type;
  var name=req.body.name;
  var phone=req.body.phone;
  var companies_id=req.body.companies_id;

  var sqlquery = "SELECT  * FROM users WHERE id = ?";
  connection.query(sqlquery, id, function (err, rows) {
    if (rows.length == 0) {
      pw=cryptoM.encrypt(pw);
      console.log(pw);
      var sql = 'INSERT INTO `users` (`id`, `pw`,  `user_type`,`companies_id`, `name`, `phone`) VALUES ?;';
      var values = [[id, pw, user_type, companies_id, name, phone]];
      connection.query(sql, [values], function (err) {
        if (err) {
          console.log("inserting user failed");
          throw err;
        } else {
              console.log("user inserted successfully");
              res.redirect('/login');
        }
      });
    } else {
      console.log("이미 있는 ID, ID를 다시 입력해주세요!");
      res.redirect("/login");
      throw err;
    }
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/login', function(req, res, next) {
  var id=req.body.id;
  var pw=req.body.pw;
  var sqlquery = "SELECT  * FROM users WHERE id = ?";
  connection.query(sqlquery, id,function (err, rows) {
    if (err) {
      console.log("no match");
      res.redirect('back');
    } else {
      var bytes =cryptoM.decrypt(rows[0].pw);
      if(bytes===pw) {
        console.log("user login successfully");
        req.session.user_id=rows[0].id;
        res.redirect('/');
      }else{
        console.log("wrong password!");
        res.render('login',{
          msg : "아이디나 비밀번호가 일치하지 않습니다."
        });
      }
    }
  });
});

router.get('/logout', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
