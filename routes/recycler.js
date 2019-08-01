var express = require('express');
var router = express.Router();
var request = require('request');
var network = require('../recycling_tracker/network.js');
const util = require('util');

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
      cb(false, [], [], [], []);
    } else {
      console.log("user login successfully");
      myinfo = rows;
      get_user_company_info(rows[0].companies_id, function (result, arr) {
        if (result == true) {
          get_user_ticketinfo(user_id, function (r, mytickets) {
            if (r == true) {
              console.log("HI")
              get_my_received_ticket(user_id, function (r, rtickets) {
                if (r == true) {
                  console.log("HI");
                  cb(true, myinfo, arr, mytickets, rtickets);
                } else {
                  cb(true, myinfo, arr, mytickets, []);
                }
              });
            } else {
              cb(true, myinfo, arr, [], []);
            }
          })
        } else {
          cb(true, myinfo, [], [], []);
        }
      });
    }
  });
}
//get user's ticketinfo by id
function get_user_ticketinfo(user_id, cb) {
  console.log("getuserticketinfo");
  request.get({
    url: 'http://localhost:3000/api/queries/select_ticket_by_user?user_id=resource%3Aorg.recycling.tracker.Recycler%23' + user_id
  }, function (error, res, body) {
    if (!error) {
      var tickets = JSON.parse(body);
      console.log("tickets : ", tickets);
      var my_tickets = []
      var count = 0;
      if (tickets.length == 0) {
        console.log("none!")
        cb(true, []);
      }
      for (var i = 0; i < tickets.length; i++) {
        console.log(i, " TICKET  :", tickets[i]);
        var temp = tickets[i].ticket_id.split('.')
        var user_id = temp[0]
        var waste_code = temp[1]
        var transfer_date = tickets[i].transfer_date
        var weight = tickets[i].weight
        var sqlquery = 'select user_name from users where user_id = ?'
        var selectt = tickets[i]
        connection.query(sqlquery, user_id, function (err, rows) {
          var user_name = rows[0].user_name
          console.log(user_name)
          var sqlquery2 = 'select * from wastes where waste_code = ?'
          connection.query(sqlquery2, waste_code, function (err, rows1) {
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
                    waste_type: waste_type,
                    weight: weight,
                    conveyancer: conveyancer,
                    carnum: carnum,
                    waste_handler: waste_handler,
                    method: method,
                    comp_loc: comp_loc,
                    transfer_date: transfer_date,
                    user_name: user_name,
                    eform_type: eform_type
                  }
                  my_tickets.push(ticket)
                  count++;
                  if (count == tickets.length) {
                    console.log("my tickets : ", my_tickets);
                    cb(true, my_tickets);
                  }
                })
              })
            })
          })
        })
      }
    }
    else {
      cb(false, []);
    }
  })
}
//get my received ticket by userid
function get_my_received_ticket(user_id, cb) {
  console.log("getuserticketinfo");
  request.get({
    url: 'http://localhost:3000/api/queries/select_ticket_user_received?user_id=resource%3Aorg.recycling.tracker.Recycler%23' + user_id
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
        //for(var i = 0; i< tickets.length; i++){
        var temp = file.ticket_id.split('.')
        var user_id = temp[0]
        var waste_code = temp[1]
        var transfer_date = file.transfer_date
        var weight = file.weight
        var cur_convey_count = file.cur_convey_count
        var pre_convey_count = file.pre_convey_count
        console.log("count : ", cur_convey_count, pre_convey_count);
        //only the ones that are finished convey
        if (cur_convey_count != pre_convey_count) {
          var sqlquery = 'select user_name from users where user_id = ?'
          var selectt = file
          connection.query(sqlquery, user_id, function (err, rows) {
            var user_name = rows[0].user_name
            console.log(user_name)
            var sqlquery2 = 'select * from wastes where waste_code = ?'
            connection.query(sqlquery2, waste_code, function (err, rows1) {
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
                      waste_type: waste_type,
                      weight: weight,
                      conveyancer: conveyancer,
                      carnum: carnum,
                      waste_handler: waste_handler,
                      method: method,
                      comp_loc: comp_loc,
                      transfer_date: transfer_date,
                      user_name: user_name,
                      eform_type: eform_type,
                      pre_convey_count: pre_convey_count,
                      cur_convey_count: cur_convey_count
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
            })
          })
        } else {
          count++;
          if (count == tickets.length) {
            console.log("my tickets : ", my_tickets);
            cb(true, my_tickets);
          }
        }
      }))
    }
    else {
      cb(false, []);
    }
  })
}
/* GET users listing. */
router.get('/', function (req, res, next) {
  var user_id = req.session.user_id;
  get_user_info(user_id, function (result, myinfo, mycompany, mytickets, rtickets) {
    if (result == true) {
      console.log("mytickets: ", mytickets);
      console.log("myinfo: ", myinfo);
      console.log("mycompany : ", mycompany);
      res.render('recycler/mypage', {
        myinfo: myinfo,
        mycompany: mycompany,
        mytickets: mytickets,
        rtickets: rtickets
      });
    } else {
      res.render('recycler/mypage', {
        myinfo: [],
        mycompany: [],
        mytickets: [],
        rtickets: []
      });
    }
  })
});

//전자 인계서 작성 페이지 불러오기
router.get('/form', function (req, res, next) {
  res.render('recycler/electronic_form', {
    waste_code: '',
    handler: '',
    handle_method: '',
    handle_address: '',
    conveyancer: '',
    conveyancer_car_num: '',
    pre_convey_count: req.body.pre_convey_count,
    cur_convey_count: req.body.cur_convey_count,
    user_id: req.session.user_id
  });
});

//전자 인계서 저장하기
router.post('/form', function (req, res, next) {
  console.log("FORM!");
  var ticket_id = req.body.ticket_id;
  var previousdes = req.body.previousdes;
  var waste_code = req.body.waste_code;
  var weight = req.body.weight;
  var conveyancer = req.body.conveyancer;
  var conveyancer_car_num = req.body.conveyancer_car_num;
  var reciever_id = req.body.handler;
  var handle_address = req.body.handle_address;
  var transfer_date = req.body.transfer_date;
  var giver_id = req.body.emitter_name;
  var giver_type = "handler";
  var cur_convey_count = req.body.cur_convey_count;
  var p_convey_count = req.body.pre_convey_count;
  console.log("count : ", cur_convey_count, p_convey_count)
  // increase previous convey count +1
  var increased_count = parseInt(p_convey_count)
  increased_count = increased_count + 1
  console.log("i : ", increased_count);
  var pre_convey_count = (increased_count).toString();
  console.log("pcc", pre_convey_count);
  console.log(typeof (pre_convey_count));

  get_usertype_by_id(reciever_id, function (result, reciever_type) {
    if (result == true) {

      //change_ticket_info(ticket_id,currentdes,previousdes,transfer_date,weight,giver_id, giver_type,reciever_id,reciever_type,conveyer_id)
      network.change_ticket_info(ticket_id, handle_address, previousdes, transfer_date, weight, giver_id, giver_type, reciever_id, reciever_type, conveyancer, pre_convey_count, cur_convey_count).then((response) => {
        //return error if error in response
        if (response.error != null) {
          console.log("network change ticket info failed");
          res.jsonp({ success: false, redirect_url: "/handler" })
        } else {
          console.log("network change ticket info succeed");
          res.jsonp({ success: true, redirect_url: "/handler" })
        }
      });
    }
  })
});

//search material info by name
router.post('/search', function (req, res, next) {
  console.log("search!");
  var material_type = "%" + req.body.material_type + "%";
  var results = new Array();
  console.log(material_type);
  var sqlquery = "SELECT * FROM wastes WHERE waste_type LIKE ?";
  connection.query(sqlquery, material_type, function (err, rows) {
    if (err) {
      console.log("no match");
      res.redirect('back');
    } else {
      console.log("found company");
      results = rows;
      console.log(results);
      res.jsonp({ success: true, results: results });

    }
  });
});
//get handler's address by handler name
function get_handler_address(company_name, cb) {
  var handler_addr = '';
  var sqlquery = "SELECT company_addr FROM companies WHERE company_name = ?";
  connection.query(sqlquery, company_name, function (err, row) {
    if (err) {
      console.log("no match");
      cb(false, null);
    } else {
      console.log("found company addr");
      console.log(row);
      handler_addr = row[0].company_addr;
      console.log(handler_addr)
      cb(true, handler_addr);
    }
  });
}

//choose material from search result
router.post('/search_result', function (req, res, next) {
  var waste_code = req.body.waste_code;
  var handler = req.body.handler;
  var handle_method = req.body.handle_method;
  var conveyancer = req.body.conveyancer;

  var sqlquery = "SELECT carnum FROM users WHERE user_id = ?";
  connection.query(sqlquery, conveyancer, function (err, row) {
    if (err) {
      console.log("no match");
      cb(false, null);
    } else {
      console.log("get convey carnum success");
      var convey_carnum = row[0].carnum;
      console.log(row[0].carnum);
      get_handler_address(handler, function (result, handler_addr) {
        var handler_addr = '';
        if (result == true) {
          handler_addr = handler_addr
        }
        results = {
          waste_code: waste_code,
          handler: handler,
          handle_method: handle_method,
          handle_address: handler_addr,
          conveyancer: conveyancer,
          carnum: convey_carnum
        }
        console.log(results)
        res.jsonp({ success: true, results: results });
      })
    }
  });
});

//change ticket info
router.post('/change_ticketinfo', function (req, res, next) {
  var ticket_id = req.body.ticket_id;
  var currentdes = req.body.currentdes;
  var previousdes = req.body.previousdes;
  var transfer_date = req.body.transfer_date;
  var weight = req.body.weight;
  var giver_id = req.body.giver_id;
  var giver_type = req.body.giver_type;
  var reciever_id = req.body.reciever_id;
  var reciever_type = req.body.reciever_type;
  var conveyer_id = req.body.conveyer_id;
  var pre_convey_count = req.body.pre_convey_count;
  var cur_convey_count = req.body.cur_convey_count;
  //change_ticket_info(ticket_id,currentdes,previousdes,transfer_date,weight,giver_id, giver_type,reciever_id,reciever_type,conveyer_id)
  network.change_ticket_info(ticket_id, currentdes, previousdes, transfer_date, weight, giver_id, giver_type, reciever_id, reciever_type, conveyer_id, pre_convey_count, cur_convey_count).then((response) => {
    //return error if error in response
    if (response.error != null) {
      console.log("network change ticket info failed");
      res.redirect('/recycler');
    } else {
      console.log("network change ticket info succeed");
      res.redirect('/recycler');
    }
  });
});
//complete ticket info
router.post('/complete_ticket', function (req, res, next) {
  var ticket_id = req.body.ticket_id;
  //delete_ticket(ticket_id) 
  network.delete_ticket(ticket_id).then((response) => {
    //return error if error in response
    if (response.error != null) {
      console.log("network delete ticket info failed");
      res.redirect('/recycler');
    } else {
      console.log("network delete ticket info succeed");
      res.redirect('/recycler');
    }
  });
});
//get usertype by userid
function get_usertype_by_id(user_id, cb) {
  var sqlquery = "SELECT user_type FROM users WHERE user_id = ?";
  connection.query(sqlquery, user_id, function (err, row) {
    if (err) {
      console.log("no match");
      cb(false, null);
    } else {
      var user_type = row[0].user_type;
      console.log("type : ", user_type);
      cb(true, user_type);
    }
  });
}

//전자 인계서 수정 페이지 불러오기
router.post('/eform', function (req, res, next) {
  res.render('recycler/electronic_form', {
    ticket_id: req.body.ticket_id,
    previousdes: req.body.previousdes,
    waste_code: '',
    handler: '',
    handle_method: '',
    handle_address: '',
    conveyancer: '',
    conveyancer_car_num: '',
    cur_convey_count: req.body.cur_convey_count,
    pre_convey_count: req.body.pre_convey_count,
    user_id: req.session.user_id
  });
});
module.exports = router;
