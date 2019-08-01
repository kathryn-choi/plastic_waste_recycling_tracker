var express = require('express');
var request = require('request');
var router = express.Router();
var network = require('../recycling_tracker/network.js');

//get user's company_info by company_id
function get_user_company_info(company_id, cb) {
  var mycompany = new Array();
  var sqlquery = "SELECT  * FROM companies WHERE company_id = ?";
  connection.query(sqlquery, company_id, function (err, rows) {
    if (err) {
      console.log("no match");
      cb(false, null);
    } else {
      console.log("user login successfully");
      mycompany = rows;
      cb(true, mycompany);
    }
  });
}
//get user's info from user_id
function get_user_info(user_id, cb) {
  var myinfo = new Array();
  var sqlquery = "SELECT  * FROM users WHERE user_id = ?";
  connection.query(sqlquery, user_id, function (err, rows) {
    if (err) {
      console.log("no match");
      res.redirect('back');
    } else {
      console.log("user login successfully");
      myinfo = rows;
      get_user_company_info(rows[0].companies_id, function (result, mycompany) {
        if (result == true) {
          get_my_received_ticket(user_id, function (r, mytickets) {
            if (r == true) {
              console.log("HI")
              cb(true, myinfo, mycompany, mytickets);
            } else {
              cb(true, myinfo, mycompany, []);
            }
          })
        } else {
          cb(true, myinfo, [], []);
        }
      });
    }
  });
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  var user_id = req.session.user_id;
  get_user_info(user_id, function (result, myinfo, mycompany, mytickets) {
    if (result == true) {
      res.render('conveyancer/mypage', {
        myinfo: myinfo,
        mycompany: mycompany,
        mytickets: mytickets
      });
    } else {
      res.render('conveyancer/mypage', {
        myinfo: myinfo,
        mycompany: [],
        mytickets: []
      });
    }
  })
});

//complete transfer
router.post('/complete_ticket', function (req, res, next) {
  //changed previousdes to curdes & changed transfer date to today

  var ticket_id = req.body.ticket_id;
  var transfer_date = req.body.transfer_date;

  console.log(ticket_id)
  var weight = req.body.weight;
  var giver_id = req.body.user_name;
  var reciever_id = req.body.waste_handler;
  var conveyer_id = req.body.conveyancer;
  var pre_convey_count = req.body.pre_convey_count;
  var c_convey_count = req.body.cur_convey_count;
  // increase current convey count +1
  var increased_count = parseInt(c_convey_count)
  increased_count=increased_count+1
  console.log("i : ", increased_count);
  var cur_convey_count = (increased_count).toString();
  console.log("ccc", cur_convey_count);
  console.log(typeof (cur_convey_count));

  var sqlquery = "select * from users where user_id = ?"
  connection.query(sqlquery, giver_id, function (err, rows) {
    //giver_name 으로 giver_id, giver_type 찾기
    console.log(rows)
    var giver_type = rows[0].user_type;
    var sqlquery2 = "select * from companies where company_id = ?"
    connection.query(sqlquery2, rows[0].companies_id, function (err, rows2) {
      var previousdes = rows2[0].company_addr
      connection.query(sqlquery, reciever_id, function (err, rows3) {
        //receiver_type 찾기
        var reciever_type = rows3[0].user_type;
        var currentdes = req.body.comp_loc
        //  var previousdes = currentdes;
        console.log(ticket_id, currentdes, previousdes, transfer_date, weight, giver_id, giver_type, reciever_id, reciever_type, conveyer_id)
        //(ticket_id,currentdes,previousdes,transfer_date,weight,giver_id, giver_type,reciever_id,reciever_type,conveyer_id)
        network.change_ticket_info(ticket_id, currentdes, previousdes, transfer_date, weight, giver_id, giver_type, reciever_id, reciever_type, conveyer_id, pre_convey_count, cur_convey_count).then((response) => {
          //return error if error in response
          if (response.error != null) {
            console.log("network change ticket info failed");
            res.redirect('/conveyancer');
          } else {
            // completed_ticket.push(ticket_id)
            console.log("network change ticket info succeed");
            //ticket_id,cur_convey_count, pre_convey_count
            res.redirect('/conveyancer');
          }
        })
      })
    })
  })
});
//debugged function
function get_my_received_ticket(user_id, cb) {
  console.log("getuserticketinfo");
  request.get({
    url: 'http://localhost:3000/api/queries/select_ticket_user_received?user_id=resource%3Aorg.recycling.tracker.Conveyancer%23' + user_id
  }, async function (error, res, body) {
    if (!error) {
      var tickets = JSON.parse(body);
      console.log("tickets : ", tickets);
      var my_tickets = []
      var count = 0;
      if (tickets.length == 0) {
        console.log("none!")
        cb(true, []);
      }
      await Promise.all(tickets.map(async (file) => {
        for (var i = 0; i < tickets.length; i++) {
          console.log(i, " TICKET  :", tickets[i]);
          var temp = file.ticket_id.split('.')
          var user_id = temp[0]
          // waste_index로 조회하기
          var waste_index = temp[1] 
          var transfer_date = file.transfer_date
          var weight = file.weight
          var cur_convey_count = file.cur_convey_count
          var pre_convey_count = file.pre_convey_count
          if (cur_convey_count == pre_convey_count) {
            var sqlquery = 'select user_name from users where user_id = ?'
            var selectt = file
            var currentdes = file.currentdes;
            var previousdes = file.previousdes;
            console.log(currentdes + " , " + previousdes);
            console.log(selectt.ticket_id)
          /* 필요 없지 않나??  
          connection.query(sqlquery, user_id, function (err, rows) {
            //connection.query(sqlquery, user_id, function (err, rows) {
              var user_name = rows[0].user_name
              console.log(user_name)*/
              var sqlquery2 = 'select * from wastes where waste_index = ?'
              connection.query(sqlquery2, waste_index, function (err, rows1) {
                var waste_code = rows1[0].waste_code
                var waste_type = rows1[0].waste_type
                var waste_handler = rows1[0].waste_handler
                var method = rows1[0].waste_handle_method
                var eform_type = rows1[0].eform_type
                var conveyancer = rows1[0].waste_conveyancer
                var sqlquery3 = "select carnum from users where user_id = ? and user_type = 'conveyancer'"
                connection.query(sqlquery3, (selectt.conveyancer).split('#')[1], function (err, rows2) {
                  var carnum = rows2[0].carnum
                  var sqlquery4 = "select companies_id from users where user_id = ?"
                  connection.query(sqlquery4, selectt.reciever.split('#')[1], function (err, rows3) {
                    var comp_id = rows3[0].companies_id
                    var sqlquery4 = "select company_addr from companies where company_id = ?"
                    connection.query(sqlquery4, comp_id, function (err, rows4) {
                      var comp_loc = rows4[0].company_addr
                      var ticket = {
                        ticket_id: selectt.ticket_id,
                        waste_code : waste_code,
                        waste_type: waste_type,
                        weight: weight,
                        conveyancer: conveyancer,
                        carnum: carnum,
                        waste_handler: waste_handler,
                        method: method,
                        comp_loc: comp_loc,
                        transfer_date: transfer_date,
                        user_name: user_id,
                        eform_type: eform_type,
                        cur_convey_count: cur_convey_count,
                        pre_convey_count: pre_convey_count,
                      }
                      console.log("t : ", ticket);
                      my_tickets.push(ticket)
                      count++;
                      if (count == tickets.length) {
                        console.log("my tickets : ", my_tickets);
                        cb(true, my_tickets);
                      }
                    })
                  })
                })
             // })
            })
          } else {
            //cur_convey_count != pre_convey_count (convey finished)
            count++;
            if (count == tickets.length) {
              console.log("my tickets : ", my_tickets);
              cb(true, my_tickets);
            }
          }
        }
      }))
    }
    else {
      cb(false, []);
    }
  })
}

module.exports = router;

