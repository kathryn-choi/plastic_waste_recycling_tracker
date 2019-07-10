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

//complete transfer
router.post('/complete_ticket', function(req, res, next) {
  //changed previousdes to curdes
  var ticket_id =req.body.ticket_id;
  var currentdes =req.body.currentdes;
  var previousdes =req.body.currentdes;
  var transfer_date =req.body.transfer_date;
  var weight =req.body.weight;
  var giver_id =req.body.giver_id;
  var giver_type =req.body.giver_type;
  var reciever_id =req.body.reciever_id;
  var reciever_type =req.body.reciever_type;
  var conveyer_id =req.body.conveyer_id;

  //change_ticket_info(ticket_id,currentdes,previousdes,transfer_date,weight,giver_id, giver_type,reciever_id,reciever_type,conveyer_id)
  network.change_ticket_info(ticket_id,currentdes,previousdes,transfer_date,weight,giver_id, giver_type,reciever_id,reciever_type,conveyer_id).then((response) => { 
    //return error if error in response
    if (response.error != null) {
      console.log("network change ticket info failed");
      res.redirect('/conveyancer');
    } else {
      console.log("network change ticket info succeed");
      res.redirect('/conveyancer'); 
    }
  });
});
module.exports = router;
