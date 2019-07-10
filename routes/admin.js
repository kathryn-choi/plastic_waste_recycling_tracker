var express = require('express');
var router = express.Router();

//get admin's info from user_id
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
      cb(true, myinfo);
    }
  });
}

/* GET admin listing. */
router.get('/', function(req, res, next) {
  var user_id=req.session.user_id;
  get_user_info(user_id, function(result, myinfo) {
    if(result==true){
      res.render('admin/mypage',{
        myinfo: myinfo
      });
    }else{
      res.render('admin/mypage',{
        myinfo: []
      });
    }
  })
});

module.exports = router;
