var express = require('express');
var request = require('request');
var mysql = require('mysql');
var async = require('async');
var network = require('../recycling_tracker/network.js');
var cryptoM = require('./../public/modules/cryptoM.js');
var router = express.Router();

console.log('index');
/* GET home page. */
router.get('/', function (req, res, next) {
  console.log('get homepage');
  if (req.session.user_id) {
    var sqlquery = "SELECT user_type FROM users WHERE user_id=?";
    connection.query(sqlquery, req.session.user_id, function (err, row) {
      if (err) {
        console.log("no match");
        res.redirect('back');
      } else {
        console.log("row : ", row);
        var user_type = row[0].user_type;
        res.render('index', {
          title: "Home",
          user_id: req.session.user_id,
          user_type: user_type
        });
      }
    });
  } else {
    console.log(-1)
    res.render('index', {
      title: "Home",
      user_id: -1
    });
  }
});

router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'Express', company_id: -1 });
});

router.post('/signup', function (req, res, next) {
  var user_id = req.body.user_id;
  var user_pw = req.body.user_pw;
  var user_type = req.body.user_type;
  var user_name = req.body.user_name;
  var user_contact = req.body.user_contact;
  var companies_id = req.body.companies_id;
  var car_number = req.body.car_number;
  var company_name = "";
  var sqlquery = "SELECT * FROM users WHERE user_id = ?";
  connection.query(sqlquery, user_id, function (err, rows) {
    console.log(rows)
    if (rows.length == 0) {
      user_pw = cryptoM.encrypt(user_pw);
      console.log("userpw : ", user_pw);
      var sql2 = "INSERT INTO users(user_id, user_pw,  user_type,companies_id, user_name, user_contact,carnum) VALUES (?,?,?,?,?,?,?)";
      connection.query(sql2, [user_id, user_pw, user_type, companies_id, user_name, user_contact, car_number], function (err) {
        if (err) {
          console.log("inserting user failed");
          throw err;
        } else {
          console.log("user inserted successfully");
          if (user_type == 'emitter') {
            var sql = "select company_name from companies where company_id = ?";
            connection.query(sql, companies_id, function (err, row) {
              if (err) {
                console.log("finding company_name error");
                throw err;
              } else {
                company_name = row[0].company_name
                network.register_emitter(user_id, user_name, company_name)
                  .then((response) => {
                    //return error if error in response
                    if (response.error != null) {
                      console.log("emitter register error")
                    } else {
                      //else return success
                      console.log("emitter register success")
                      res.jsonp({ success: true, redirect_url: "/login" })
                    }
                  })
              }
            })
          }
          else if (user_type == 'handler') {
            var sql = "select company_name from companies where company_id = ?";
            connection.query(sql, companies_id, function (err, row) {
              if (err) {
                console.log("finding company_name error");
                throw err;
              } else {
                company_name = row[0].company_name
                network.register_handler(user_id, user_name, company_name)
                  .then((response) => {
                    //return error if error in response
                    if (response.error != null) {
                      console.log("handler register error")
                    } else {
                      //else return success
                      console.log("handler register success")
                      res.jsonp({ success: true, redirect_url: "/login" })
                    }
                  })
              }
            })
          }
          else if (user_type == 'recycler') {
            var sql = "select company_name from companies where company_id = ?";
            connection.query(sql, companies_id, function (err, row) {
              if (err) {
                console.log("finding company_name error");
                throw err;
              } else {
                company_name = row[0].company_name
                network.register_recycler(user_id, user_name, company_name)
                  .then((response) => {
                    //return error if error in response
                    if (response.error != null) {
                      console.log("recycler register error")
                    } else {
                      //else return success
                      console.log("recycler register success")
                      res.jsonp({ success: true, redirect_url: "/login" })
                    }
                  })
              }
            })
          }
          else if (user_type == 'conveyancer') {
            network.register_conveyancer(user_id, user_name, car_number)
              .then((response) => {
                //return error if error in response
                if (response.error != null) {
                  console.log("conveyancer register error")
                } else {
                  //else return success
                  console.log("conveyancer register success")
                  res.jsonp({ success: true, redirect_url: "/login" })
                }
              })
          }
          else {
            network.register_admin(user_id, user_name)
              .then((response) => {
                //return error if error in response
                if (response.error != null) {
                  console.log("admin register error")
                } else {
                  //else return success
                  console.log("admin register success")
                  res.jsonp({ success: true, redirect_url: "/login" })
                }
              })
          }
        }
      })
    } else {
      console.log("이미 있는 ID, ID를 다시 입력해주세요!");
      res.redirect("/login");
      throw err;
    }
  });
});

router.get('/register_company', function (req, res, next) {
  res.render('register_company', { title: 'Express' });
});

router.post('/register_company', function (req, res, next) {
  var sql = "INSERT INTO company_register(company_name, company_addr,  company_contact,company_type, company_material_type, company_method,waste_code) VALUES (?,?,?,?,?,?,?)";
      connection.query(sql, [req.body.company_name, req.body.company_addr, req.body.company_contact, req.body.company_type, req.body.waste_type, req.body.handle_method, req.body.waste_code], function (err) {
        if (err) {
          console.log("inserting register_company failed");
          throw err;
        } else {
          console.log("Company register insert Success")
          res.jsonp({ success: true, redirect_url: "/"});
        }
      }) 
});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/login', function (req, res, next) {
  var user_id = req.body.user_id;
  var user_pw = req.body.user_pw;
  console.log(user_id);
  var sqlquery = "SELECT  * FROM users WHERE user_id = ?";
  connection.query(sqlquery, user_id, function (err, row) {
    if (err) {
      console.log("no match");
      res.redirect('/');
    } else {
      console.log(row);
      console.log(row.length);
      if (row.length != 0) {
        var bytes = cryptoM.decrypt(row[0].user_pw);
        if (bytes === user_pw) {
          console.log("user login successfully");
          console.log(row[0].user_id);
          req.session.user_id = row[0].user_id;
          var user_type = row[0].user_type;
          //redirect path according to user_type
          if (user_type == "emitter") {
            res.redirect('/emitter');
          } else if (user_type == "conveyancer") {
            res.redirect('/conveyancer');
          } else if (user_type == "handler") {
            res.redirect('/handler');
          } else if (user_type == "recycler") {
            res.redirect('/recycler');
          } else if (user_type == "admin") {
            res.redirect('/admin');
          } else {
            console.log("No User Type");
            res.redirect('/login');
          }
        } else {
          console.log(bytes)
          console.log("wrong password!");
          res.render('login', {
            msg: "아이디나 비밀번호가 일치하지 않습니다."
          });
        }
      } else {// no matching id
        res.render('login', {
          msg: "아이디가 일치하지 않습니다."
        });
      }
    }
  });
});

router.get('/logout', function (req, res, next) {
  req.session.destroy();  // 세션 삭제
  res.clearCookie('sid'); // 세션 쿠키 삭제
  res.redirect('/');
});

//search companyinfo by name
router.post('/search', function (req, res, next) {
  var company_name = "%" + req.body.company_name + "%";
  var results = new Array();
  var sqlquery = "SELECT * FROM companies WHERE company_name LIKE ?";
  connection.query(sqlquery, company_name, function (err, rows) {
    if (err) {
      console.log("no match");
      res.redirect('back');
    } else {
      console.log("found company");
      results = rows;
      res.jsonp({ success: true, results: results });
      //res.render('search_result',{result : results});
    }
  });
});

//choose company from search result
router.post('/search_result', function (req, res, next) {
  var company_id = req.body.company_id;
  res.render('signup', { company_id: company_id });
});

module.exports = router;
