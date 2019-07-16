var network = require('./../../recycling_tracker/network.js');
var request = require('request');

exports.create_compasset = function(asset_id, save_weight, comp_id, waste_code, cb){
  //(asset_id,gen_weight,save_weight, handle_weight,comp_id, waste_code) 
    console.log("Comp asset create")
    network.create_compasset(asset_id,'',save_weight,'',comp_id,waste_code).then((response) => { 
    //return error if error in response
    if (response.error != null) {
        console.log("create compasset failed");
        cb(false);
      } else {
        console.log("create compasset succeed");
        cb(true);
      }
    });    
};

exports.get_company_compasset_by_company_id = function(company_id, cb){
    console.log("getusercompassetinfo");
  request.get({
    url : 'http://localhost:3000/api/queries/select_compasset_by_comp_id?comp_id=' + company_id
    },function(error,res,body){
      if(!error){
        var compassets = JSON.parse(body);
        console.log("compassets : ",compassets);
        var my_compassets = []
        var count = 0;
        if(compassets.length == 0){
          console.log("none!")
          cb(true,[]);
        }
        for(var i = 0; i< compassets.length; i++){
          //(asset_id,gen_weight, handle_weight, save_weight)
          var asset_id = compassets[i].asset_id.split('.');
          var gen_weight=compassets[i].gen_weight;
          var handle_weight=compassets[i].handle_weight;
          var save_weight=compassets[i].save_weight;
          var waste_code=compassets[i].waste_code;
          var sqlquery = "SELECT * FROM wastes WHERE waste_code=?";
          connection.query(sqlquery,waste_code,function (err, row) {
            if (err) {
              console.log("no match");
              res.redirect('back');
            } else {
              console.log("found company");
              console.log(row);
              var compasset = {
                asset_id: asset_id,
                gen_weight: gen_weight,
                handle_weight:handle_weight,
                save_weight: save_weight,
                waste_code: waste_code,
                waste_type: row[0].waste_type,
                waste_state: row[0].waste_state,
                waste_classify: row[0].waste_classify,
              }
              console.log(compasset);
              my_compassets.push(compasset)
              count++;
              if(count == compassets.length){
                console.log("my compassets : ",my_compassets);
                cb(true,my_compassets);
              }
          }
        });
        }
      }
      else{
        cb(false, []);
      }
  })
};

exports.update_company_asset = function(asset_id,gen_weight, handle_weight, save_weight, cb){
  network.update_company_asset(asset_id,gen_weight, handle_weight, save_weight).then((response) => { 
        //return error if error in response
        if (response.error != null) {
            console.log("update company compasset failed");
            cb(false);
          } else {
            console.log("update company compasset succeed");
            cb(true);
          }
        });    
};

exports.get_company_name_by_id = function(company_id){
  var sqlquery = "SELECT  company_id FROM companies WHERE company_id = ?";
  connection.query(sqlquery, company_id,function (err, row) {
    if (err) {
      console.log("no match");
      return false;
    } else {
      console.log("found company id");
      return row[0].company_id;
    }
  });   
};


exports.get_user_type_by_id = function(user_id){
  var sqlquery = "SELECT  user_type FROM users WHERE user_id = ?";
  connection.query(sqlquery, user_id,function (err, row) {
    if (err) {
      console.log("no match");
      return false;
    } else {
      console.log("found company id");
      return row[0].user_type;
    }
  });   
};