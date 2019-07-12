var network = require('../recycling_tracker/network.js');
var compassetM = require('./../../public/modules/compasset.js');

 router.get('/', function(req, res, next) {
    console.log("compasset!");
    var user_id= req.session.user_id;
    var sqlquery = "SELECT company_id FROM users WHERE user_id=?";
    connection.query(sqlquery, user_id,function (err, rows) {
      if (err) {
        console.log("no match");
        res.redirect('back');
      } else {
        var company_id= row[0].company_id;
        console.log('company id : ', company_id);
        compassetM.get_company_compasset_by_company_id(company_id,function (result, mycompassets) {
            if(result==true){
                console.log("mycompassest", mycompassets);
                var company_name = compassetM.get_company_name_by_id(company_id);
                var user_type= compassetM.get_user_type_by_id(user_id);
                res.render('compasset/mycompassets', {
                    mycompassets: mycompassets, 
                    company_name: company_name,
                    user_type: user_type,
                });
            }else{
                console.log("error");
                res.redirect('back');
            }
        });
      }
  });
});
//최초 보관량 등록하기 페이지 불러오기
router.get('/create_compasset', function(req, res, next) {
    res.render('compasset/create_compasset',{
        waste_code: '',
    });
}); 

//search material info by name
router.post('/search', function(req, res, next) {
    console.log("search!");
    var material_type="%"+req.body.material_type+ "%";
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
        res.render('compasset/search_result',{result : results});
      }
    });
  });

//choose material from search result and get waste_code
router.post('/search_result', function(req, res, next) {
    var waste_code=req.body.waste_code;
    res.render('compasset/create_compasset',{
        waste_code: waste_code,
    });
  });

//최초 보관량 등록하기
router.post('/create_compasset', function(req, res, next) {
    var waste_code=req.body.waste_code;
    var save_date=req.body.save_date;
    var first_save_weight=req.body.first_save_weight;
    var user_id= req.session.user_id;
    //asset_id = save_date + "_" + waste_code+"_" + user_id
    var asset_id=save_date+"_"+waste_code+"_"+user_id;
    var sqlquery = "SELECT company_id FROM users WHERE user_id=?";
    connection.query(sqlquery, user_id,function (err, row) {
      if (err) {
        console.log("no match");
        res.redirect('back');
      } else {
        var company_id= row[0].company_id;
        compassetM.create_compasset(asset_id, first_save_weight, company_id, waste_code, function(result){
            if(result==true){
                console.log("create compasset true!");
                res.redirect('/compasset');
            }else{
                console.log("create compasset false!");
                res.redirect('/compasset');
            }
        });
    }
  });
});
//발생량 등록하기
router.post('/update_compasset', function(req, res, next) {
    var asset_id=req.body.asset_id;
    var gen_weight=req.body.gen_weight;
    var handle_weight=req.body.handle_weight;
    var save_weight=req.body.save_weight;
    //현재보관량 = 최초 보관량 + 발생량 - 배출량 
    var new_save_weight=save_weight+gen_weight-handle_weight;
    //(asset_id,gen_weight, handle_weight, save_weight, cb)
    compassetM.update_compasset(asset_id, gen_weight, handle_weight, new_save_weight, function(result){
        if(result==true){
            console.log("update compasset true!");
            res.redirect('/compasset');
        }else{
            console.log("update compasset false!");
            res.redirect('/compasset');
        }
    });
});