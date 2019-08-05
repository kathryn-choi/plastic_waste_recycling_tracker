var express = require('express');
var router = express.Router();
var request = require('request');

//waste_code form
router.get('/', function (req, res, next) {
    console.log("waste_code form")
    res.render('waste_code/wform', {
        user_id: req.session.user_id,
        user_type: req.session.user_type,
        waste_code: '',
    });
});

//waste_code list
router.get('/list', function (req, res, next) {
    console.log("waste_code list")
    var wastes = new Array();
    var sqlquery = "SELECT  * FROM wastes WHERE waste_pending = ?";
    connection.query(sqlquery, [false], function (err, rows) {
        if (err) {
            console.log("no match");
            res.redirect('back')
        } else {
            console.log("waste list");
            var count = 0;
            for (var i = 0; i < rows.length; i++) {
                var waste_index = rows[i].waste_index;
                var waste_code = rows[i].waste_code;
                var waste_state = rows[i].waste_state;
                var waste_type = rows[i].waste_type;
                var waste_classify = rows[i].waste_classify;
                var waste_handler = rows[i].waste_handler;
                var waste_handler_condition = rows[i].waste_handler_condition;
                var waste_handle_method = rows[i].waste_handle_method;
                var waste_conveyancer = rows[i].waste_conveyancer;
                var waste_conveyancer_condition = rows[i].waste_conveyancer_condition;
                var eform_type = rows[i].eform_type;
                var waste = {
                    waste_index: waste_index,
                    waste_code: waste_code,
                    waste_state: waste_state,
                    waste_type: waste_type,
                    waste_classify: waste_classify,
                    waste_handler: waste_handler,
                    waste_handler_condition: waste_handler_condition,
                    waste_handle_method: waste_handle_method,
                    waste_conveyancer: waste_conveyancer,
                    waste_conveyancer_condition: waste_conveyancer_condition,
                    eform_type: eform_type,
                }
                wastes.push(waste);
                count++;
            }
            if (count == rows.length) {
                res.render('waste_code/list', {
                    wastes: wastes,
                    user_id: req.session.user_id,
                    user_type: req.session.user_type,
                })
            }
        }
    });
});

//add waste_code form
router.post('/add', function (req, res, next) {
    console.log("add waste_code")
    var waste_code = req.body.waste_code;
    var waste_state = req.body.waste_state;
    var waste_type = req.body.waste_type;
    var waste_classify = req.body.waste_classify;
    var waste_handler = req.body.waste_handler;
    var waste_handle_method = req.body.waste_handle_method
    var waste_handler_condition = req.body.waste_handler_condition;
    var waste_conveyancer = req.body.waste_conveyancer;
    var waste_conveyancer_condition = req.body.waste_conveyancer_condition;
    var eform_type = req.body.eform_type;

    var sql = "insert into wastes(waste_code,waste_state, waste_type, waste_classify, waste_handler, waste_handler_condition, waste_handle_method, waste_conveyancer, waste_conveyancer_condition, eform_type ) values (?,?,?,?,?,?,?,?,?,?)"
    connection.query(sql, [waste_code, waste_state, waste_type, waste_classify, waste_handler, waste_handler_condition, waste_handle_method, waste_conveyancer, waste_conveyancer_condition, eform_type], function (err) {
        if (err) {
            console.log("no match");
            res.jsonp({ success: true, redirect_url: "/waste_code" });
        } else {
            console.log("insert succeed"); 
            res.jsonp({ success: true, redirect_url: "/waste_code" });
        }
    });
});

//accept waste_code form
router.post('/accept', function (req, res, next) {
    console.log("accept waste_code")
    var waste_index = req.body.waste_index;
    var sql = "UPDATE wastes SET waste_pending=? WHERE waste_index=? ";
    connection.query(sql, [true, waste_index], function (err) {
        if (err) {
            console.log("no match");
            res.redirect('back')
        } else {
            console.log("waste_code accepted");
            res.redirect('/waste_code/list');
        }
    });
});

//deny waste_code form
router.post('/deny', function (req, res, next) {
    console.log("deny waste_code")
    var waste_index = req.body.waste_index;
    var sql = "DELETE FROM wastes WHERE waste_index=? ";
    connection.query(sql, [true, waste_index], function (err) {
        if (err) {
            console.log("no match");
            res.redirect('back')
        } else {
            console.log("waste_code deleted");
            res.redirect('/waste_code/list');
        }
    });
});

//search material info by name
router.post('/search', function (req, res, next) {
    console.log("search!");
    var material_type = "%" + req.body.material_type + "%";
    var results = new Array();
    console.log(material_type);
    var sqlquery = "SELECT * FROM waste_info WHERE waste_type LIKE ?";
    connection.query(sqlquery, material_type, function (err, rows) {
        if (err) {
            console.log("no match");
            res.redirect('back');
        } else {
            console.log("found waste_info");
            results = rows;
            console.log(results);
            res.jsonp({ success: true, results: results });

        }
    });
});

//choose material from search result
router.post('/search_result', function (req, res, next) {
    var waste_code = req.body.waste_code;
    var waste_state = req.body.waste_state;
    var waste_type = req.body.waste_type;
    var waste_classify = req.body.waste_classify;

    var results = {
        waste_code: waste_code,
        waste_state: waste_state,
        waste_type: waste_type,
        waste_classify: waste_classify
    }
    console.log(results)
    res.jsonp({ success: true, results: results });
})

function find_user_info_by_company_id(company_id, company_name, company_method, cb){
    console.log(company_id)
    var sqlquery2 = "SELECT * FROM users WHERE companies_id = ?";
    connection.query(sqlquery2, company_id, function (err, row) {
        if (err) {
            console.log("no match");
            cb(false, null);
        } else {
            console.log(row);
            if(row.length != 0){
                var user_id = row[0].user_id;
                var user_contact = row[0].user_contact;
                var user_name = row[0].user_name;
                var result = {
                    handler_id: user_id,
                    handler_contact: user_contact,
                    handler_name: user_name,
                    company_id: company_id,
                    company_name: company_name,
                    company_method: company_method,
                }
                cb(true, result)
            }
            else cb(false,null)
        }
    })
}


//search handler user info by company name
router.post('/search_handler', function (req, res, next) {
    console.log("search!");
    var handler_comp_name = "%" + req.body.handler_comp_name + "%";
    var results = new Array();
    var sqlquery = "SELECT * FROM companies WHERE company_name LIKE ? and company_type = 'handler'";
    connection.query(sqlquery, handler_comp_name, function (err, rows) {
        if (err) {
            console.log("no match");
            res.redirect('back');
        } else {
            var count = 0;
            console.log(rows);
            for (var i = 0; i < rows.length; i++) {
                var company_id = rows[i].company_id;
                var company_name = rows[i].company_name;
                var company_method=rows[i].company_method;
                find_user_info_by_company_id(company_id, company_name, company_method, function(r,result ){
                    if(r==true){
                        count++;
                        results.push(result);
                        if (count == rows.length) {
                            console.log("SUCCESS")
                            console.log(results);
                            res.jsonp({ success: true, results: results });
                        }
                    }else{
                        count++;
                        if (count == rows.length) {
                            res.jsonp({ success: true, results: results });
                        }
                    }
                })
            }
        }
    });
});

//choose handler from search result
router.post('/search_handler_result', function (req, res, next) {
    var waste_handler = req.body.waste_handler;
    var waste_handle_method = req.body.waste_handle_method;

    var results = {
       waste_handler: waste_handler,
       waste_handle_method : waste_handle_method
    }
    console.log(results)
    res.jsonp({ success: true, results: results });
})

//search handler user info by company name
router.post('/search_conveyancer', function (req, res, next) {
    console.log("search!");
    var conveyancer_comp_name = "%" + req.body.conveyancer_comp_name + "%";
    var results = new Array();
    var sqlquery = "SELECT * FROM companies WHERE company_name LIKE ? and company_type = 'conveyancer'";
    connection.query(sqlquery, conveyancer_comp_name, function (err, rows) {
        if (err) {
            console.log("no match");
            res.redirect('back');
        } else {
            console.log(conveyancer_comp_name)
            var count = 0;
            console.log(rows);
            for (var i = 0; i < rows.length; i++) {
                var company_id = rows[i].company_id;
                var company_name = rows[i].company_name;
                var company_method=rows[i].company_method;
                find_user_info_by_company_id(company_id, company_name, company_method, function(r,result ){
                    if(r==true){
                        count++;
                        results.push(result);
                        if (count == rows.length) {
                            console.log("SUCCESS")
                            console.log(results);
                            res.jsonp({ success: true, results: results });
                        }
                    }else{
                        count++;
                        if (count == rows.length) {
                            res.jsonp({ success: true, results: results });
                        }
                    }
                })
            }
        }
    });
});

module.exports = router;