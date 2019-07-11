var network = require('../recycling_tracker/network.js');

exports.create_compasset = function(asset_id, gen_weight, comp_id, cb){
    network.create_compasset(asset_id,gen_weight,'', '',comp_id).then((response) => { 
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
          var compasset = {
            asset_id: asset_id,
            gen_weight: gen_weight,
            handle_weight:handle_weight,
            save_weight: save_weight
          }
          my_compassets.push(compasset)
          count++;
          if(count == compassets.length){
            console.log("my compassets : ",my_compassets);
            cb(true,my_compassets);
          }
        }
      }
      else{
        cb(false, []);
      }
  })
};

exports.update_company_asset = function(asset_id,gen_weight, handle_weight, save_weight, cb){
    update_company_asset(asset_id,gen_weight, handle_weight, save_weight).then((response) => { 
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
