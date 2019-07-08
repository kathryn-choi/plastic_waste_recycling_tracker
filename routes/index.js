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
  var user_id=req.body.user_id;
  var user_pw=req.body.user_pw;
  var user_type=req.body.user_type;
  var user_name=req.body.user_name;
  var user_contact=req.body.user_contact;
  var companies_id=req.body.companies_id;

  var sqlquery = "SELECT  * FROM users WHERE user_id = ?";
  connection.query(sqlquery, user_id, function (err, rows) {
    if (rows.length == 0) {
      pw=cryptoM.encrypt(pw);
      console.log(pw);
      var sql = 'INSERT INTO `users` (`user_id`, `user_pw`,  `user_type`,`companies_id`, `user_name`, `user_contact`) VALUES ?;';
      var values = [[user_id, user_pw, user_type, companies_id, user_name, user_contact]];
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
  var user_id=req.body.user_id;
  var user_pw=req.body.user_pw;
  var sqlquery = "SELECT  * FROM users WHERE user_id = ?";
  connection.query(sqlquery, user_id,function (err, rows) {
    if (err) {
      console.log("no match");
      res.redirect('back');
    } else {
      var bytes =cryptoM.decrypt(rows[0].user_pw);
      if(bytes===user_pw) {
        console.log("user login successfully");
        req.session.user_id=rows[0].user_id;
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

//search company_id by name
router.post('/search', function(req, res, next) {
  var company_name=req.body.company_name;
  var sqlquery = "SELECT  * FROM companies WHERE company_name LIKE ?";
  connection.query(sqlquery, company_name,function (err, rows) {
    if (err) {
      console.log("no match");
      res.redirect('back');
    } else {
        console.log("found comapny id");
        //수정할 예정
        res.send({result : rows});
      }
  });
});


module.exports = router;
