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
  res.render('signup', { title: 'Express' , company_id: -1});
});

router.post('/signup', function(req, res, next) {
  var user_id=req.body.user_id;
  var user_pw=req.body.user_pw;
  var user_type=req.body.user_type;
  var user_name=req.body.user_name;
  var user_contact=req.body.user_contact;
  var companies_id=req.body.companies_id;

  var sqlquery = "SELECT * FROM users WHERE user_id = ?";
  connection.query(sqlquery, user_id, function (err, rows) {
    console.log(rows)
    if (rows.length == 0) {
      user_pw=cryptoM.encrypt(user_pw);
      console.log("userpw : ", user_pw);
      var sql = "INSERT INTO users(user_id, user_pw,  user_type,companies_id, user_name, user_contact) VALUES (?,?,?,?,?,?)";
      var values = [user_id, user_pw, user_type, companies_id, user_name, user_contact];
      console.log(values);
      connection.query(sql, [user_id, user_pw, user_type, companies_id, user_name, user_contact], function (err) {
        if (err) {
          console.log("inserting user failed");
          throw err;
        } else {
              console.log("user inserted successfully");
              res.jsonp({success : true, redirect_url : "http://127.0.0.1:4000/login"})
              // res.redirect('/login');
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
  console.log(user_id);
  var sqlquery = "SELECT  * FROM users WHERE user_id = ?";
  connection.query(sqlquery, user_id,function (err, row) {
    if (err) {
      console.log("no match");
      res.redirect('back');
    } else {
      console.log(row);
      var bytes =cryptoM.decrypt(row[0].user_pw);
      if(bytes===user_pw) {
        console.log("user login successfully");
        console.log(row[0].user_id);
        req.session.user_id=row[0].user_id;
        var user_type=row[0].user_type;
        //redirect path according to user_type
        if(user_type=="emitter") {
          res.redirect('/emitter');
        }else if (user_type=="conveyancer"){
          res.redirect('/conveyancer');
        }else if (user_type=="handler"){
          res.redirect('/handler');
        }else if (user_type=="recycler"){
          res.redirect('/recycler');
        }else if (user_type=="admin"){
          res.redirect('/admin');
        }else{
          console.log("No User Type");
          res.redirect('/login');
        }
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
  req.session.destory();  // 세션 삭제
  res.clearCookie('sid'); // 세션 쿠키 삭제
  res.redirect('/');
});

//search companyinfo by name
router.post('/search', function(req, res, next) {
  var company_name=req.body.company_name;
  var results=new Array();
  var sqlquery = "SELECT * FROM companies WHERE company_name LIKE ?";
  connection.query(sqlquery, company_name,function (err, rows) {
    if (err) {
      console.log("no match");
      res.redirect('back');
    } else {
        console.log("found company");
        results=rows;
        console.log(results);
        res.render('search_result',{result : results});
      }
  });
});
//choose company from search result
router.post('/search_result', function(req, res, next) {
  var company_id=req.body.company_id;
  res.render('signup',{company_id: company_id});
});

module.exports = router;
