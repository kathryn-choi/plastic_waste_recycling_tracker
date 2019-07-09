var express = require('express');
var router = express.Router();
// var network = require('../recycling_tracker/network.js');

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

//전자 인계서 작성 페이지 불러오기
router.get('/form', function(req, res, next) {
  res.render('emitter/electronic_form',{
    waste_code: '',
    handler:'',
    handle_method: '',
    handle_address: '',
    conveyancer: '',
  });
});

//전자 인계서 저장하기
router.post('/form', function(req, res, next) {
  var waste_code=req.body.waste_code;
  var weight=req.body.weight;
  var conveyancer=req.body.conveyancer;
  var conveyancer_car_num=req.body.conveyancer_car_num;
  var handler=req.body.handler;
  var handle_address=req.body.handle_address;
  var transfer_date=req.body.transfer_date;
  var emitter_name=req.body.emitter_name;
  var user_id = req.session.user_id
  var ticket_id = user_id + "-" + waste_code + "-" + transfer_date

  var sqlquery = "SELECT * FROM users WHERE user_name = ? and user_type = 'conveyancer'"
  connection.query(sqlquery, conveyancer,function (err, rows) {
    if (err) {
      console.log("no match");
    } else {
      console.log("found user_id");
      var con_id = rows[0].user_id
      var sqlquery2 = "SELECT * FROM users WHERE user_id = ?"
      connection.query(sqlquery2, user_id,function (err, rows) {
        if (err) {
          console.log("no match");
        } else {
          console.log("found company_id");
          var company_id = rows[0].companies_id
          var sqlquery3= "SELECT * FROM companies WHERE company_id = ?"
          connection.query(sqlquery3, company_id,function (err, rows) {
            if (err) {
              console.log("no match");
            } else {
              console.log("found company_loc");
              var company_loc = rows[0].company_addr
              var sqlquery4= "SELECT * FROM users WHERE user_name = ? and user_type = 'handler'"
              connection.query(sqlquery4, handler,function (err, rows) {
                if (err) {
                  console.log("no match");
                } else {
                  console.log("found handler_id");
                  var hanlder_id = rows[0].user_id
                  console.log(hanlder_id)
                  network.create_ticket(ticket_id,company_loc,"",weight,transfer_date,user_id, "Emitter",hanlder_id,"Handler",con_id)
                }
              });
            }
          });
        }
      });
    }
  });
  //block에 insert
  // network.create_ticket(ticket_id,currentdes,"",weight,transfer_date,giver_id, giver_type,reciever_id,reciever_type,conveyer_id)
  res.jsonp({success : true, redirect_url : "/emitter"})
});

//search material info by name
router.post('/search', function(req, res, next) {
  console.log("search!");
  var material_type=req.body.material_type;
  var results=new Array();
  console.log(material_type);
  var sqlquery = "SELECT * FROM wastes WHERE waste_type LIKE ?";
  connection.query(sqlquery, material_type,function (err, rows) {
    if (err) {
      console.log("no match");
      res.redirect('back');
    } else {
      console.log("found company");
      results=rows;
      console.log(results);
      res.render('emitter/search_result',{result : results});
    }
  });
});
//get handler's address by handler name
function get_handler_address(company_name, cb){
  var handler_addr = '';
  var sqlquery = "SELECT company_addr FROM companies WHERE company_name = ?";
  connection.query(sqlquery, company_name,function (err, row) {
    if (err) {
      console.log("no match");
      cb(false, null);
    } else {
      console.log("user login successfully");
      handler_addr=row;
      console.log(handler_addr[0].company_addr)
      cb(true,handler_addr[0].company_addr);
    }
  });
}

//choose material from search result
router.post('/search_result', function(req, res, next) {
  var waste_code=req.body.waste_code;
  var handler=req.body.handler;
  var handle_method=req.body.handle_method;
  var conveyancer=req.body.conveyancer;
  var sqlquery = "SELECT carnum FROM users WHERE user_name = ?";
  connection.query(sqlquery, conveyancer,function (err, row) {
    if (err) {
      console.log("no match");
      cb(false, null);
    } else {
      console.log("get convey carnum success");
      var convey_carnum = row;
      get_handler_address(handler, function(result, handler_addr){
        if(result==true){
          res.render('emitter/electronic_form',{
            waste_code: waste_code,
            handler:handler,
            handle_method: handle_method,
            handle_address: handler_addr,
            conveyancer: conveyancer,
            carnum : convey_carnum
          });
        }else{
          res.render('emitter/electronic_form',{
            waste_code: waste_code,
            handler:handler,
            handle_method: handle_method,
            handle_address: '',
            conveyancer: conveyancer,
            carnum : convey_carnum
          });
        }
      })
    }
  });
  
});
module.exports = router;
