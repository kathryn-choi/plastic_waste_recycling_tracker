var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('emitter/mypage',{
    title: "Electronic Form"
  });
});

//전자 인계서 작성 페이지 불러오기
router.get('/form', function(req, res, next) {
  res.render('emitter/electronic_form',{
    title: "Electronic Form"
  });
});

//전자 인계서 저장하기
router.post('/form', function(req, res, next) {
  var material_type=req.body.material_type;
  var weigh=req.body.weigh;
  var conveyancer=req.body.conveyancer;
  var conveyancer_car_num=req.body.conveyancer_car_num;
  var handler=req.body.handler;
  var handle_address=req.body.handle_address;
  var transfer_date=req.body.transfer_date;
  var emitter_name=req.body.emitter_name;

  //block에 insert

  res.redirect('/emitter/myform');
});

module.exports = router;
