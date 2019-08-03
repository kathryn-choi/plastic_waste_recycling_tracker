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
      get_user_company_info(rows[0].companies_id, function (result, mycompany){
        if(result==true){
          cb(true, myinfo, mycompany);
        }else{
          cb(true, myinfo, []);
        }
      })
    }
  });
}
//get user's company_info by company_id
function get_user_company_info(company_id, cb){
  var mycompany = new Array();
  var sqlquery = "SELECT  * FROM companies WHERE company_id = ?";
  connection.query(sqlquery, company_id,function (err, rows) {
    if (err) {
      console.log("no match");
     cb(false, null);
    } else {
      console.log("company search successfully");
      mycompany=rows;
      cb(true,mycompany);
    }
  });
}
/* GET admin listing. */
router.get('/', function(req, res, next) {
  var user_id=req.session.user_id;
  get_user_info(user_id, function(result, myinfo, mycompany) {
    if(result==true){
      get_alarms(function(result, alarms){
        if(result==true){
        res.render('admin/mypage',{
          myinfo: myinfo,
          mycompany: mycompany,
          user_type: 'admin',
          alarms : alarms,
        });
      }else{
        res.render('admin/mypage',{
          myinfo: myinfo,
          mycompany: mycompany,
          user_type: 'admin',
          alarms : [],
        });
      }
      })
    
    }else{
      res.render('admin/mypage',{
        myinfo: myinfo,
        mycompany: mycompany,
        user_type: 'admin',
        alarms : [],
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
        res.jsonp({success : true, results: results});
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
                    compticket : ticket_history,
                    user_type: 'admin'
                  })
                  //res.jsonp({success : true, redirect_url : "admin/comp_history", results : results})
                }
              }
            })
          }))
        }
      });
    }
  })
});

//get user's alarms
function get_alarms(cb){
  var alarms = new Array();
  var today=new Date();
  console.log("today : ", today);
  var sqlquery = "SELECT  * FROM alarms WHERE is_complete=?";
  connection.query(sqlquery, [false],function (err, rows) {
    if (err) {
      console.log("no match");
     cb(false, []);
    } else {
      console.log("got alarms");
      count=0;
      for (var i=0; i<rows.length; i++){
        var last_date=rows[i].last_date;
        console.log("last_date", last_date);
        var daydif = today- last_date
        if(daydif>30){
          var ticket_id=rows[i].ticket_id;
          var alarms_index=rows[i].alarms_index;
          var alarm={
            ticket_id : ticket_id,
            last_date : last_date,
            alarms_index : alarms_index
          }
          alarms.push(alarm);
        }
        count ++;
        if(count==rows.length && alarms.length!=0){
          cb(true,alarms);
        }
      }
      if(rows.length==0){
        cb(true, []);
      }
    }
  });
}
//delete alarms
router.post('/delete_alarm', function(req, res, next) {
  console.log("delete alarm")
  var alarms_index=req.body.alarms_index;
  var sqlquery =" Delete from alarms where alarms_index = ?"
      connection.query(sqlquery, alarms_index,function (err, rows) {
      if (err) {
        console.log("no match");
        res.redirect('back');
      } else {
          console.log("deleted alarms");
          res.redirect('/admin');
        }
      });
});


router.get('/register_company_list', function(req, res, next) {
  console.log("get register company list")
  var sqlquery =" Select * from company_register"
      connection.query(sqlquery,function (err, rows) {
      if (err) {
        console.log("no match");
        res.redirect('back');
      } else {
          console.log("register_company_list : ",rows);
          comp_list = rows
          res.render('admin/register_company_list',{comp_list:comp_list,
          user_type: 'admin'
          });
        }
      });
});

router.post('/accept_comp', function(req,res,next){
  console.log("company_registeration_accept")
  var sqlquery = "delete from company_register where idcompany_register = ?"
  if(req.body.pending == "deny"){
    connection.query(sqlquery,req.body.comp_index,function (err) {
      if (err) {
        console.log("no match");
        res.redirect('back');
      } else {
          console.log("Deny company success")
          res.jsonp({ success: false})
        }
      });
  }
  else{
    var sqlquery3 = "insert into companies(company_name, company_addr, company_contact, company_type, company_material_type,company_method,waste_code) values (?,?,?,?,?,?,?)"
    var sqlquery2 = "select * from company_register where idcompany_register = ?"
    connection.query(sqlquery2,req.body.comp_index,function (err,rows) {
      if (err) {
        console.log("no match");
        res.redirect('back');
      } else {
          console.log("get Company info success")
          connection.query(sqlquery3,[rows[0].company_name,rows[0].company_addr,rows[0].company_contact, rows[0].company_type, rows[0].company_material_type, rows[0].company_method, rows[0].waste_code],function (err) {
            if (err) {
              console.log("no match");
              res.redirect('back');
            } else {
                console.log("company insert success")
                connection.query(sqlquery,req.body.comp_index,function (err) {
                  if (err) {
                    console.log("no match");
                    res.redirect('back');
                  } else {
                      console.log("delete company success")
                      res.jsonp({ success: true})
                    }
                  });
              }
            });
        }
      });  
  }
})
module.exports = router;
