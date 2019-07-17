var express = require('express');
var router = express.Router();
var compassetM = require('./../public/modules/compasset.js');
var ticketM = require('./../public/modules/ticket.js');

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

router.post('/search', function(req, res, next) {
  var company_name="%"+req.body.company_name+ "%";
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
        res.render('admin/search_result',{result : results});
      }
  });
});
//choose company from search result
router.post('/history', function(req, res, next) {
  var company_id=req.body.company_id;
  var sqlquery = "Select * from users where companies_id = ?"
  compassetM.get_compasset_history_by_company_id(company_id,function (result, mycompassets) {
    if(result==false){
      console.log("error");
      res.redirect('back');
    }else{
      console.log("mycompassest", mycompassets);
      connection.query(sqlquery, company_id,function (err, rows) {
      if (err) {
        console.log("no match");
        res.redirect('back');
      } else {
          console.log("found users");
          users=rows;
          console.log(users);
          var ticket_history = []
          var count = 0
          Promise.all(users.map(async (user) =>{
            ticketM.get_ticket_history_by_company_id(user.user_id,function (result, ticket) {
              if(result==false){
                console.log("error");
                res.redirect('back');
              }else{
                if(ticket.length != 0) ticket_history = ticket_history.concat(ticket)
                console.log("before render",ticket_history)
                count++
                if(count == users.length){
                  console.log(ticket_history)
                  res.render('admin/comp_history',{
                    compasset : mycompassets,
                    compticket : ticket_history
                  })
                }
              }
            })
          }))
        }
      });
    }
  })
});

module.exports = router;
