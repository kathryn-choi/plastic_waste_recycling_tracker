var express = require('express');
var request = require('request');
var router = express.Router();

//get notice list
router.get('/', function (req, res, next) {
    console.log("get notice list")
    var sqlquery = " Select * from notices"
    var notices = new Array();
    connection.query(sqlquery, function (err, rows) {
        if (err) {
            console.log("no match");
            res.redirect('back');
        } else {
            notices = rows;
            res.render('notice/list', {
                notices: notices,
                user_type: req.session.user_type,
                user_id: req.session.user_id,
            });
        }
    });
});

// get notice context by notice_index
router.get('/read/:notice_index', function (req, res, next) {
    console.log("get notice list")
    var notice_index = req.params.notice_index;
    var sqlquery = " Select * from notices where notice_index=?"
    var notice = new Array();
    connection.query(sqlquery, notice_index, function (err, rows) {
        if (err) {
            console.log("no match");
            res.redirect('back');
        } else {
            notice = rows;
            res.render('notice/context', {
                notice: notice
            });
        }
    });
});

//get notice form
router.get('/form', function (req, res, next) {
    console.log("Notice form")
    if (req.session.user_id) {
        res.render('notice/notice_form', {
            notice_title: '',
            notice_date: '',
            notice_context: '',
            notice_type: '',
            notice_file: '',
            form_action: 'write',
            user_id: req.session.user_id,
            user_type: req.session.user_type
        })
    } else {
        console.log("fds")
        res.render('notice/notice_form', {
            notice_title: '',
            notice_date: '',
            notice_context: '',
            notice_type: '',
            notice_file: '',
            form_action: 'write',
            user_id: -1,
            user_type: -1,
        })
    }
})

//write notice
router.post('/write', function (req, res, next) {
    console.log("write notice")
    var notice_title = req.body.notice_title;
    var notice_date = new Date();
    var notice_context = req.body.notice_context;
    var notice_type = req.body.notice_type;
    var notice_file = req.body.notice_file;

    var sqlquery3 = "insert into notices(notice_title, notice_date, notice_context, notice_type,notice_file) values (?,?,?,?,?)"
    connection.query(sqlquery3, [notice_title, notice_date, notice_context, notice_type, notice_file], function (err) {
        if (err) {
            console.log("no match");
            res.redirect('back');
        } else {
            console.log("notice insert success")
            res.redirect('/');
        }
    });
})

//edit notice form
router.get('/:notice_index/edit', function (req, res, next) {
    console.log("get edit notice")
    var notice_title = req.body.notice_title;
    var notice_date = new Date();
    var notice_context = req.body.notice_context;
    var notice_type = req.body.notice_type;
    var notice_file = req.body.notice_file;
    res.render('notice/notice_form', {
        notice_index: req.params.notice_index,
        notice_title: notice_title,
        notice_date: notice_date,
        notice_context: notice_context,
        notice_type: notice_type,
        notice_file: notice_file,
        form_action: 'edit',
    })
})

//edit notice
router.post('/edit', function (req, res, next) {
    console.log("edit notice")
    var notice_index = req.body.notice_index;
    var notice_title = req.body.notice_title;
    var notice_date = new Date();
    var notice_context = req.body.notice_context;
    var notice_type = req.body.notice_type;
    var notice_file = req.body.notice_file;
    var sqlquery3 = "UPDATE notices SET notice_title=?, notice_date=?, notice_context=?, notice_type=?,notice_file=? WHERE notice_index=?"
    connection.query(sqlquery3, [notice_title, notice_date, notice_context, notice_type, notice_file, notice_index], function (err) {
        if (err) {
            console.log("no match");
            res.redirect('back');
        } else {
            console.log("notice insert success")
            res.redirect('/');
        }
    });
})

//delete notice
router.post('/delete', function (req, res, next) {
    console.log("write notice")
    var sqlquery = "delete from notice where notice_index = ?"
    connection.query(sqlquery, req.body.notice_index, function (err) {
        if (err) {
            console.log("no match");
            res.redirect('back');
        } else {
            console.log("Deny company success")
            res.redirect('/');
        }
    });
})

//search notice
router.post('/search', function (req, res, next) {
    console.log("search notice")
    var search_type = req.body.search_type;
    var search_context = req.body.search_context;
    var notice_type = req.body.notice_type;
    if (search_type != '') {
        if (search_type == 'notice_title') {
            var sqlquery3 = "select * notices where notice_title LIKE ?"
            var title='%'+search_context+'%'
            connection.query(sqlquery3, [title], function (err, rows) {
                if (err) {
                    console.log("no match");
                    res.redirect('back');
                } else {
                    var search_results=rows;
                    res.render('notice/list', {
                        notice: search_results
                    })
                }
            });
        } else if (search_type = 'notice_context') {
            var sqlquery3 = "select * notices where notice_context LIKE ?"
            var context='%'+search_context+'%'
            connection.query(sqlquery3, [context], function (err, rows) {
                if (err) {
                    console.log("no match");
                    res.redirect('back');
                } else {
                    var search_results=rows;
                    res.render('notice/list', {
                        notice: search_results
                    })
                }
            });
        }
    } else if (notice_type != '') {
        var sqlquery3 = "select * notices where notice_type = ?"
        connection.query(sqlquery3, [notice_type], function (err, rows) {
            if (err) {
                console.log("no match");
                res.redirect('back');
            } else {
                var search_results=rows;
                res.render('notice/list', {
                    notice: search_results
                })
            }
        });
    } else {
        res.redirect('back');
    }
})

module.exports = router;