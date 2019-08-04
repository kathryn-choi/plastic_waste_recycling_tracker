var express = require('express');
var request = require('request');
var router = express.Router();

//get notice list
router.get('/', function (req, res, next) {
    console.log("get notice list")
    var sqlquery = "SELECT * from notices"
    var notices = new Array();
    connection.query(sqlquery, function (err, rows) {
        if (err) {
            console.log("no match");
            res.redirect('back');
        } else {
            var count = 0;
            for (var i = 0; i < rows.length; i++) {
                var notice_index = rows[i].notice_index;
                var notice_title = rows[i].notice_title;
                var notice_date = rows[i].notice_date;
                var notice_type = rows[i].notice_type;
                var notice_content = rows[i].notice_content;
                var notice_file = rows[i].notice_file;
                var notice = {
                    notice_index: notice_index,
                    notice_title: notice_title,
                    notice_date: notice_date,
                    notice_type: notice_type,
                    notice_content: notice_content,
                    notice_file: notice_file,
                }
                notices.push(notice);
                count++;
            }
            if (count == rows.length) {
                console.log('notices : ', notices);
                res.render('notice/list', {
                    notices: notices,
                    user_type: req.session.user_type,
                    user_id: req.session.user_id,
                });
            }
        }
    });
});

// get notice context by notice_index
router.get('/read/notice_index/:notice_index', function (req, res, next) {
    console.log("get notice list")
    var notice_index = req.params.notice_index;
    var sqlquery = " Select * from notices where notice_index=?"
    var notice = new Array();
    connection.query(sqlquery, notice_index, function (err, rows) {
        if (err) {
            console.log("no match");
            res.redirect('back');
        } else {
            var notice_index = rows[0].notice_index;
            var notice_title = rows[0].notice_title;
            var notice_date = rows[0].notice_date;
            var notice_type = rows[0].notice_type;
            var notice_content = rows[0].notice_content;
            var notice_file = rows[0].notice_file;
           
            if(req.session.user_id){
            res.render('notice/context', {
                notice_index: notice_index,
                notice_title: notice_title,
                notice_date: notice_date,
                notice_type: notice_type,
                notice_content: notice_content,
                notice_file: notice_file,
                user_type: req.session.user_type,
                user_id: req.session.user_id,
            });
        }else{
            res.render('notice/context', {
                notice_index: notice_index,
                notice_title: notice_title,
                notice_date: notice_date,
                notice_type: notice_type,
                notice_content: notice_content,
                notice_file: notice_file,
                user_type: -1,
                user_id: -1,
            });
        }
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
            notice_content: '',
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
            notice_content: '',
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
    var notice_content = req.body.notice_content;
    var notice_type = req.body.notice_type;
    var notice_file = req.body.notice_file;

    var sqlquery3 = "insert into notices(notice_title, notice_date, notice_content, notice_type,notice_file) values (?,?,?,?,?)"
    connection.query(sqlquery3, [notice_title, notice_date, notice_content, notice_type, notice_file], function (err) {
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
    var notice_content = req.body.notice_content;
    var notice_type = req.body.notice_type;
    var notice_file = req.body.notice_file;
    res.render('notice/notice_form', {
        notice_index: req.params.notice_index,
        notice_title: notice_title,
        notice_date: notice_date,
        notice_content: notice_content,
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
    var notice_content = req.body.notice_content;
    var notice_type = req.body.notice_type;
    var notice_file = req.body.notice_file;
    var sqlquery3 = "UPDATE notices SET notice_title=?, notice_date=?, notice_content=?, notice_type=?,notice_file=? WHERE notice_index=?"
    connection.query(sqlquery3, [notice_title, notice_date, notice_content, notice_type, notice_file, notice_index], function (err) {
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
    console.log("search_type", search_type);
    console.log("search_context", search_context);
    console.log("notice_type", notice_type);
    if(search_type!='' && notice_type!=''){
        if(notice_type==notice_title){
        var sqlquery3 = "select * notices where notice_title LIKE ? AND notice_type=?"
            var title = '%' + search_context + '%'
            connection.query(sqlquery3, [title, notice_type], function (err, rows) {
                if (err) {
                    console.log("no match");
                    res.redirect('back');
                } else {
                    var count = 0;
                    for (var i = 0; i < rows.length; i++) {
                        var notice_index = rows[i].notice_index;
                        var notice_title = rows[i].notice_title;
                        var notice_date = rows[i].notice_date;
                        var notice_type = rows[i].notice_type;
                        var notice_content = rows[i].notice_content;
                        var notice_file = rows[i].notice_file;
                        var notice = {
                            notice_index: notice_index,
                            notice_title: notice_title,
                            notice_date: notice_date,
                            notice_type: notice_type,
                            notice_content: notice_content,
                            notice_file: notice_file,
                        }
                        notices.push(notice);
                        count++;
                    }
                    if (count == rows.length) {
                        console.log('notices : ', notices);
                        res.render('notice/list', {
                            notices: notices,
                            user_type: req.session.user_type,
                            user_id: req.session.user_id,
                        });
                    }
                }
            });
        }else{
            var sqlquery3 = "select * notices where notice_content LIKE ? AND notice_type=?"
            var title = '%' + search_context + '%'
            connection.query(sqlquery3, [title, notice_type], function (err, rows) {
                if (err) {
                    console.log("no match");
                    res.redirect('back');
                } else {
                    var count = 0;
                    for (var i = 0; i < rows.length; i++) {
                        var notice_index = rows[i].notice_index;
                        var notice_title = rows[i].notice_title;
                        var notice_date = rows[i].notice_date;
                        var notice_type = rows[i].notice_type;
                        var notice_content = rows[i].notice_content;
                        var notice_file = rows[i].notice_file;
                        var notice = {
                            notice_index: notice_index,
                            notice_title: notice_title,
                            notice_date: notice_date,
                            notice_type: notice_type,
                            notice_content: notice_content,
                            notice_file: notice_file,
                        }
                        notices.push(notice);
                        count++;
                    }
                    if (count == rows.length) {
                        console.log('notices : ', notices);
                        res.render('notice/list', {
                            notices: notices,
                            user_type: req.session.user_type,
                            user_id: req.session.user_id,
                        });
                    }
                }
            });
        }
    }else if (search_type != '') {
        if (search_type == 'notice_title') {
            var sqlquery3 = "select * notices where notice_title LIKE ?"
            var title = '%' + search_context + '%'
            connection.query(sqlquery3, [title], function (err, rows) {
                if (err) {
                    console.log("no match");
                    res.redirect('back');
                } else {
                    var count = 0;
                    for (var i = 0; i < rows.length; i++) {
                        var notice_index = rows[i].notice_index;
                        var notice_title = rows[i].notice_title;
                        var notice_date = rows[i].notice_date;
                        var notice_type = rows[i].notice_type;
                        var notice_content = rows[i].notice_content;
                        var notice_file = rows[i].notice_file;
                        var notice = {
                            notice_index: notice_index,
                            notice_title: notice_title,
                            notice_date: notice_date,
                            notice_type: notice_type,
                            notice_content: notice_content,
                            notice_file: notice_file,
                        }
                        notices.push(notice);
                        count++;
                    }
                    if (count == rows.length) {
                        console.log('notices : ', notices);
                        res.render('notice/list', {
                            notices: notices,
                            user_type: req.session.user_type,
                            user_id: req.session.user_id,
                        });
                    }
                }
            });
        } else if (search_type = 'notice_content') {
            var sqlquery3 = "select * notices where notice_content LIKE ?"
            var context = '%' + search_context + '%'
            connection.query(sqlquery3, [context], function (err, rows) {
                if (err) {
                    console.log("no match");
                    res.redirect('back');
                } else {
                
                    var count = 0;
                    for (var i = 0; i < rows.length; i++) {
                        var notice_index = rows[i].notice_index;
                        var notice_title = rows[i].notice_title;
                        var notice_date = rows[i].notice_date;
                        var notice_type = rows[i].notice_type;
                        var notice_content = rows[i].notice_content;
                        var notice_file = rows[i].notice_file;
                        var notice = {
                            notice_index: notice_index,
                            notice_title: notice_title,
                            notice_date: notice_date,
                            notice_type: notice_type,
                            notice_content: notice_content,
                            notice_file: notice_file,
                        }
                        notices.push(notice);
                        count++;
                    }
                    if (count == rows.length) {
                        console.log('notices : ', notices);
                        res.render('notice/list', {
                            notices: notices,
                            user_type: req.session.user_type,
                            user_id: req.session.user_id,
                        });
                    }
                }
            });
        }
    } else if (notice_type != '') {
        console.log("notice_type");
        var sqlquery3 = "select * notices where notice_type = ?"
        connection.query(sqlquery3, [notice_type], function (err, rows) {
            if (err) {
                console.log("no match");
                res.redirect('back');
            } else {
                for()
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