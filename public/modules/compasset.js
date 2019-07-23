var network = require('./../../recycling_tracker/network.js');
var request = require('request');

exports.create_compasset = function (asset_id, save_weight, comp_id, waste_code, cb) {
  //(asset_id,gen_weight,save_weight, handle_weight,comp_id, waste_code) 
  console.log("Comp asset create")
  network.create_compasset(asset_id, '', save_weight, '', comp_id, waste_code).then((response) => {
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
exports.get_compasset_history_by_company_id = function (company_id, cb) {
  console.log("get user compasset history");
  request.get({
    url: 'http://localhost:3000/api/queries/get_compasset_history'
  }, async function (error, res, body) {
    if (!error) {
      var compassets = JSON.parse(body);
      console.log("compassets history: ", compassets);
      var my_compassets = []
      var temp = []
      var count = 0;
      if (compassets.length == 0) {
        console.log("none!")
        cb(true, []);
      }
      //for(var i = 0; i< compassets.length; i++)
      await Promise.all(compassets.map(async (file) => {
        var event = file.eventsEmitted[0]
        if (event.comp_id == company_id) {
          temp.push(event);
        }
      }))
      console.log("compasset history : ", temp)
      if (temp.length == 0) cb(true, my_compassets);
      else {
        await Promise.all(temp.map(async (asset) => {
          //(asset_id,gen_weight, handle_weight, save_weight
          var transaction_type = asset.$class.split('.')[3];
          if (transaction_type == "compasset_create") {
            transaction_type = "생성"
          }
          else {
            transaction_type = "수정"
          }
          var asset_id = asset.asset_id;
          var gen_weight = asset.gen_weight;
          var handle_weight = asset.handle_weight;
          var save_weight = asset.save_weight;
          var waste_code = asset.waste_code;
          var timestamp = asset.timestamp;
          var sqlquery = "SELECT * FROM wastes WHERE waste_code=?";
          connection.query(sqlquery, waste_code, function (err, row) {
            if (err) {
              console.log("no match");
              res.redirect('back');
            } else {
              console.log("found company");
              console.log(row);
              var compasset = {
                asset_id: asset_id,
                transaction_type: transaction_type,
                gen_weight: gen_weight,
                handle_weight: handle_weight,
                save_weight: save_weight,
                timestamp: timestamp,
                waste_code: waste_code,
                waste_type: row[0].waste_type,
                waste_state: row[0].waste_state,
                waste_classify: row[0].waste_classify,
              }
              console.log(compasset);
              my_compassets.push(compasset)
              count++;
              if (count == compassets.length) {
                my_compassets.sort(function(a, b) { 
                  return a.timestamp > b.timestamp ? -1 : a.timestamp < b.timestamp ? 1 : 0;
                });
                console.log("my compassets : ", my_compassets);
                cb(true, my_compassets);
              }
            }
          });
        }))
      }
    }
    else {
      cb(false, []);
    }
  })
}

exports.get_company_compasset_by_company_id = async function (company_id, cb) {
  console.log("getusercompassetinfo");
  await request.get({
    url: 'http://localhost:3000/api/queries/select_compasset_by_comp_id?comp_id=' + company_id
  }, async function (error, res, body) {
    if (!error) {
      var compassets = JSON.parse(body);
      console.log("compassets : ", compassets);
      var my_compassets = []
      var count = 0;
      if (compassets.length == 0) {
        console.log("none!")
        cb(true, []);
      }
      //for(var i = 0; i< compassets.length; i++){
      await Promise.all(compassets.map(async (file) => {
        //(asset_id,gen_weight, handle_weight, save_weight)
        console.log(file);
        var asset_id = file.asset_id.split('.');
        var gen_weight = file.gen_weight;
        var handle_weight = file.handle_weight;
        var save_weight = file.save_weight;
        var waste_code = file.waste_code;
        var sqlquery = "SELECT * FROM wastes WHERE waste_code=?";
        connection.query(sqlquery, waste_code, function (err, row) {
          if (err) {
            console.log("no match");
            res.redirect('back');
          } else {
            console.log("found company");
            console.log(row);
            var compasset = {
              asset_id: asset_id,
              gen_weight: gen_weight,
              handle_weight: handle_weight,
              save_weight: save_weight,
              waste_code: waste_code,
              waste_type: row[0].waste_type,
              waste_state: row[0].waste_state,
              waste_classify: row[0].waste_classify,
            }
            console.log(compasset);
            my_compassets.push(compasset)
            count++;
            if (count == compassets.length) {
              console.log("my compassets : ", my_compassets);
              cb(true, my_compassets);
            }
          }
        });
      }))
    }
    else {
      cb(false, []);
    }
  })
};

exports.update_company_asset = function (asset_id, gen_weight, handle_weight, save_weight, cb) {
  var final_weight = save_weight + gen_weight - handle_weight;
  network.update_company_asset(asset_id, gen_weight, handle_weight, final_weight).then((response) => {
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

exports.get_company_name_by_id = function (company_id, cb) {
  var sqlquery = "SELECT  company_name FROM companies WHERE company_id = ?";
  connection.query(sqlquery, company_id, function (err, row) {
    if (err) {
      console.log("no match");
      cb(false);
    } else {
      console.log("found company name");
      console.log(row[0].company_name);
      cb(row[0].company_name);
    }
  });
};

exports.get_company_name_by_userid = function (user_id, cb) {
  var sqlquery = "SELECT  company_id FROM users WHERE user_id = ?";
  connection.query(sqlquery, user_id, function (err, row) {
    if (err) {
      console.log("no match");
      cb(false);
    } else {
      var sqlquery = "SELECT  company_name FROM companies WHERE company_id = ?";
      connection.query(sqlquery, row[0].company_id, function (err, row) {
        if (err) {
          console.log("no match");
          cb(false);
        } else {
          console.log("found company name");
          console.log(row[0].company_name);
          cb(row[0].company_name);
        }
      });
    }
  });
};

exports.get_user_type_by_id = function (user_id) {
  var sqlquery = "SELECT  user_type FROM users WHERE user_id = ?";
  connection.query(sqlquery, user_id, function (err, row) {
    if (err) {
      console.log("no match");
      return false;
    } else {
      console.log("found company id");
      return row[0].user_type;
    }
  });
};