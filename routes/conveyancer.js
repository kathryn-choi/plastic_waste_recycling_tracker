var express = require('express');
var request = require('request');
var router = express.Router();
var network = require('../recycling_tracker/network.js');

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
      get_user_company_info(rows[0].companies_id, function (result, mycompany){
        if(result==true){
          get_my_received_ticket(user_id, function(r,mytickets){
            if(r==true){
              console.log("HI")
              cb(true, myinfo, mycompany, mytickets);
            }else{
              cb(true, myinfo, mycompany, []);
            }
          })
        }else{
          cb(true, myinfo, [], []);
        }
      });
    }
  });
}
//get my received ticket by userid
function get_my_received_ticket(user_id, cb){
  console.log("getuserticketinfo");
  request.get({
    url : 'http://localhost:3000/api/queries/select_ticket_user_received?user_id=resource%3Aorg.recycling.tracker.Conveyancer%23' + user_id
    },async function(error,res,body){
      if(!error){
        var tickets = JSON.parse(body);
        console.log("tickets : ",tickets);
        var my_tickets = []
        var count = 0;
        if(tickets.length == 0){
          console.log("none!")
          cb(true,[]);
        }
        await Promise.all(tickets.map(async (file) =>{
        //for(var i = 0; i< tickets.length; i++){
          var temp = file.ticket_id.split('.')
          var user_id = temp[0]
          var waste_code = temp[1]
          var transfer_date = file.transfer_date
          var weight = file.weight
          var sqlquery = 'select user_name from users where user_id = ?'
          var selectt = file
          connection.query(sqlquery, user_id,function (err, rows) {
            var user_name  =  rows[0].user_name
            console.log(user_name)
            var sqlquery2 = 'select * from wastes where waste_code = ?'
            connection.query(sqlquery2, waste_code,function (err, rows1) {
              var waste_type = rows1[0].waste_type
              var waste_handler = rows1[0].waste_handler
              var method = rows1[0].waste_handle_method
              var eform_type = rows1[0].eform_type
              var conveyancer = rows1[0].waste_conveyancer
              var sqlquery3 = "select carnum from users where user_id = ? and user_type = 'conveyancer'"
              connection.query(sqlquery3, (selectt.conveyancer).split('#')[1],function (err, rows2) {
                var carnum = rows2[0].carnum
                var sqlquery4 = "select companies_id from users where user_id = ?"
                connection.query(sqlquery4, selectt.reciever.split('#')[1],function (err, rows3) {
                  var comp_id = rows3[0].companies_id
                  var sqlquery4 = "select company_addr from companies where company_id = ?"
                  connection.query(sqlquery4, comp_id,function (err, rows4) {
                    var comp_loc = rows4[0].company_addr
                    var ticket = {
                      ticket_id: selectt.ticket_id,
                      waste_type : waste_type,
                      weight : weight,
                      conveyancer : conveyancer,
                      carnum : carnum,
                      waste_handler : waste_handler,
                      method : method,
                      comp_loc : comp_loc,
                      transfer_date : transfer_date,
                      user_name : user_name,
                      eform_type : eform_type
                    }
                    console.log("t : ",ticket);
                    my_tickets.push(ticket)
                    count++;
                    if(count == tickets.length){
                      console.log("my tickets : ",my_tickets);
                      cb(true,my_tickets);
                    }
                  })
                })
              })
            })
          })
        }))
      }
      else{
        cb(false, []);
      }
  })
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  var user_id=req.session.user_id;
  get_user_info(user_id, function(result, myinfo, mycompany, mytickets) {
    if(result==true){
      res.render('conveyancer/mypage',{
        myinfo: myinfo,
        mycompany: mycompany,
        mytickets: mytickets
      });
    }else{
      res.render('conveyancer/mypage',{
        myinfo: myinfo,
        mycompany: [],
        mytickets: []
      });
    }
  })
});

//complete transfer
router.post('/complete_ticket', function(req, res, next) {
  //changed previousdes to curdes & changed transfer date to today
  var ticket_id =req.body.ticket_id;
  var currentdes =req.body.currentdes;
  var previousdes =req.body.currentdes;
  var transfer_date =req.body.transfer_date;
  var weight =req.body.weight;
  var giver_name =req.body.user_name;
  //giver_name 으로 giver_id, giver_type 찾기
  var giver_type =req.body.giver_type;
  var reciever_id =req.body.waste_handler;
  //receiver_type 찾기
  var reciever_type =req.body.reciever_type;
  var conveyer_id =req.body.conveyer_id;

  //(ticket_id,currentdes,previousdes,transfer_date,weight,giver_id, giver_type,reciever_id,reciever_type,conveyer_id) 
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
