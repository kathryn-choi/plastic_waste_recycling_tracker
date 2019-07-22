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
      cb(false, [], [], []);
    } else {
      console.log("user login successfully");
      myinfo = rows;
      get_user_company_info(rows[0].companies_id, function (result, arr) {
        if (result == true) {
          get_user_ticketinfo(user_id, function (r, mytickets) {
            if (r == true) {
              console.log("HI")
              cb(true, myinfo, arr, mytickets);
            } else {
              cb(true, myinfo, arr, []);
            }
          })
          //cb(true,myinfo, arr,[]);
        } else {
          cb(true, myinfo, [], []);
        }
      });
    }
  });
}

function get_ticket_info(user_id, conveyancer, handler, cb) {
  var sqlquery = "SELECT * FROM users WHERE user_name = ? and user_type = 'conveyancer'"
  connection.query(sqlquery, conveyancer, function (err, rows) {
    if (err) {
      console.log(conveyancer)
      console.log("no match");
    } else {
      console.log("found user_id");
      var con_id = rows[0].user_id
      var sqlquery2 = "SELECT * FROM users WHERE user_id = ?"
      connection.query(sqlquery2, user_id, function (err, rows) {
        if (err) {
          console.log("no match");
          cb(false, "", "", "")
        } else {
          console.log("found company_id");
          var company_id = rows[0].companies_id
          var sqlquery3 = "SELECT * FROM companies WHERE company_id = ?"
          connection.query(sqlquery3, company_id, function (err, rows) {
            if (err) {
              console.log("no match");
              cb(false, "", "", "")
            } else {
              console.log("found company_loc");
              var company_loc = rows[0].company_addr
              var sqlquery4 = "SELECT * FROM users WHERE user_name = ? and user_type = 'handler'"
              connection.query(sqlquery4, handler, function (err, rows) {
                if (err) {
                  console.log("no match");
                  cb(false, "", "", "")
                } else {
                  console.log("found handler_id");
                  var hanlder_id = rows[0].user_id
                  console.log(hanlder_id)
                  cb(true, con_id, hanlder_id, company_loc)
                }
              });
            }
          });
        }
      });
    }
  });
}
//get user's ticketinfo by id
function get_user_ticketinfo(user_id, cb) {
  console.log("getuserticketinfo");
  request.get({
    url: 'http://localhost:3000/api/queries/select_ticket_by_user?user_id=resource%3Aorg.recycling.tracker.Emitter%23' + user_id
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
                    eform_type: eform_type
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
  get_user_info(user_id, function (result, myinfo, mycompany, mytickets) {
    if (result == true) {
      console.log("mytickets: ", mytickets);
      console.log("myinfo: ", myinfo);
      console.log("mycompany : ", mycompany);
      res.render('emitter/mypage', {
        myinfo: myinfo,
        mycompany: mycompany,
        mytickets: mytickets
      });
    } else {
      res.render('emitter/mypage', {
        myinfo: [],
        mycompany: [],
        mytickets: []
      });
    }
  })
});

//전자 인계서 작성 페이지 불러오기
router.get('/form', function (req, res, next) {
  res.render('emitter/electronic_form', {
    waste_code: '',
    handler: '',
    handle_method: '',
    handle_address: '',
    conveyancer: '',
    conveyancer_car_num: '',
  });
});

//전자 인계서 저장하기
router.post('/form', function (req, res, next) {

  var waste_code = req.body.waste_code;
  var weight = req.body.weight;
  var conveyancer = req.body.conveyancer;
  var conveyancer_car_num = req.body.conveyancer_car_num;
  var handler = req.body.handler;
  var handle_address = req.body.handle_address;
  var transfer_date = req.body.transfer_date;
  var emitter_name = req.body.emitter_name;
  var user_id = req.session.user_id
  var ticket_id = user_id + "." + waste_code + "." + transfer_date
  get_ticket_info(user_id, conveyancer, handler, function (result, con_id, hanlder_id, company_loc) {
    if (result == true) {
      network.create_ticket(ticket_id, company_loc, "", weight, transfer_date, user_id, "Emitter", hanlder_id, "Handler", con_id).then((response) => {
        //return error if error in response
        if (response.error != null) {
          console.log("network create ticket info failed");
          res.jsonp({ redirect_url: "/emitter" })
        } else {
          console.log("network create ticket info succeed");
          res.jsonp({ redirect_url: "/emitter" })
        }
      })
    }
    else {
      console.log("인계서 작성 오류")
      res.jsonp({ redirect_url: "/emitter" })
    }
  })

  // var sqlquery = "SELECT * FROM users WHERE user_name = ? and user_type = 'conveyancer'"
  // connection.query(sqlquery, conveyancer,function (err, rows) {
  //   if (err) {
  //     console.log("no match");
  //   } else {
  //     console.log("found user_id");
  //     var con_id = rows[0].user_id
  //     var sqlquery2 = "SELECT * FROM users WHERE user_id = ?"
  //     connection.query(sqlquery2, user_id,function (err, rows) {
  //       if (err) {
  //         console.log("no match");
  //       } else {
  //         console.log("found company_id");
  //         var company_id = rows[0].companies_id
  //         var sqlquery3= "SELECT * FROM companies WHERE company_id = ?"
  //         connection.query(sqlquery3, company_id,function (err, rows) {
  //           if (err) {
  //             console.log("no match");
  //           } else {
  //             console.log("found company_loc");
  //             var company_loc = rows[0].company_addr
  //             var sqlquery4= "SELECT * FROM users WHERE user_name = ? and user_type = 'handler'"
  //             connection.query(sqlquery4, handler,function (err, rows) {
  //               if (err) {
  //                 console.log("no match");
  //               } else {
  //                 console.log("found handler_id");
  //                 var hanlder_id = rows[0].user_id
  //                 console.log(hanlder_id)
  //                 network.create_ticket(ticket_id,company_loc,"",weight,transfer_date,user_id, "Emitter",hanlder_id,"Handler",con_id)
  //               }
  //             });
  //           }
  //         });
  //       }
  //     });
  //   }
  // });
  //block에 insert
  // network.create_ticket(ticket_id,currentdes,"",weight,transfer_date,giver_id, giver_type,reciever_id,reciever_type,conveyer_id)
  //res.jsonp({success : true, redirect_url : "/emitter"})
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
function get_handler_address(handler_id, cb) {
  var handler_addr = '';
  var sqlquery = "SELECT companies_id FROM companies WHERE user_id = ?";
  connection.query(sqlquery, company_name, function (err, row) {
    if (err) {
      console.log("no match");
      cb(false, null);
    } else {
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
  });
}

//choose material from search result
router.post('/search_result', function (req, res, next) {
  var waste_code = req.body.waste_code;
  var handler = req.body.handler;
  var handle_method = req.body.handle_method;
  var conveyancer = req.body.conveyancer;
  console.log(conveyancer);
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
        if (result == true) {
          handler_addr = handler_addr
        } else {
          handler_addr = ''
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

//choose material from search result
router.post('/change_ticketinfo', function (req, res, next) {
  console.log("change ticketinfo")
  //console.log(req.body)
  var ticket_id = req.body.ticket_id;
  var waste_type = req.body.waste_type;
  var conveyancer = req.body.conveyancer;
  var transfer_date = req.body.transfer_date;
  var weight = req.body.weight;
  var carnum = req.body.carnum;
  var waste_handler = req.body.waste_handler;
  var method = req.body.method;
  var comp_loc = req.body.comp_loc;
  var user_name = req.body.user_name;
  var user_id = req.session.user_id
  get_ticket_info(user_id, conveyancer, waste_handler, function (result, con_id, hanlder_id, company_loc) {
    /*if(result == true){
    request({
      url : 'http://localhost:3000/api/org.recycling.tracker.Ticket/'+ticket_id,
      method : "PUT",
      header : {
        "content-type" : "application/json",
      },
      json : {
        "$class": "org.recycling.tracker.Ticket",
        "ticket_id": ticket_id,
        "currentdes": company_loc,
        "previousdes": " ",
        "transfer_date": transfer_date,
        "weight": weight,
        "giver": "resource:org.recycling.tracker.Emitter#"+user_id,
        "reciever": "resource:org.recycling.tracker.Handler#"+hanlder_id,
        "conveyancer": "resource:org.recycling.tracker.Conveyancer#"+con_id
      }
      }),function(error,res,body){
        if(!error){
          console.log("network change ticket info succeed");
          res.redirect('/emitter'); 
        }
        else{
          console.log("network change ticket info failed");
          res.redirect('/emitter');
        }
      }*/

    if (result == true) {
      //change_ticket_info(ticket_id,currentdes,previousdes,transfer_date,weight,giver_id, giver_type,reciever_id,reciever_type,conveyer_id)
      network.change_ticket_info(ticket_id, company_loc, "", transfer_date, weight, user_id, "Emitter", hanlder_id, "Handler", con_id).then((response) => {
        //return error if error in response
        if (response.error != null) {
          console.log("network change ticket info failed");
          res.redirect('/emitter');
        } else {
          console.log("network change ticket info succeed");
          res.redirect('/emitter');
        }
      });
    }
    else {
      console.log("인계서 수정 오류")
      res.redirect('/emitter');
    }
  })


});


module.exports = router;
