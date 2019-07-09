var express = require('express');
var router = express.Router();

//get user's company_info by company_id
function get_user_company_info(company_id, cb){
  var mycompany = new Array();
  var sqlquery = "SELECT  * FROM companies WHERE company_id = ?";
  connection.query(sqlquery, company_id,function (err, rows) {
    if (err) {
      console.log("no match");
      cb(false, null);
    } else {
      console.log("user login successfully");
      mycompany=rows;
      cb(true,mycompany);
    }
  });
}
//get user's info from user_id
function get_user_info(user_id, cb){
  var myinfo = new Array();
  var sqlquery = "SELECT  * FROM users WHERE user_id = ?";
  connection.query(sqlquery, user_id,function (err, rows) {
    if (err) {
      console.log("no match");
      res.redirect('back');
    } else {
      console.log("user login successfully");
      myinfo=rows;
      get_user_company_info(rows[0].companies_id, function (result, arr){
        if(result==true){
          cb(true, myinfo, arr);
        }else{
          cb(true, myinfo, []);
        }
      });
    }
  });
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  var user_id=req.session.user_id;
  get_user_info(user_id, function(result, myinfo, mycompany) {
    if(result==true){
      res.render('emitter/mypage',{
        myinfo: myinfo,
        mycompany: mycompany
      });
    }else{
      res.render('emitter/mypage',{
        myinfo: myinfo,
        mycompany: []
      });
    }
  })
});

module.exports = router;
