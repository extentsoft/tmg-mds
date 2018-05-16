//import { ECHILD } from 'constants';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');

var index = require('./routes/index');
var users = require('./routes/users');
const config = {
    host: '10.1.1.5',
    user: 'MCAPI01',
    password: 'W4@B1O#1'
        //host: '172.16.25.71',
        //user: 'qsecofr',
        //password: 'qsecofr'
}
const pool = require('node-jt400').pool(config);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.get('/test', function(req, res) {
    console.log('test');

    request.get({
        url: "https://jsonplaceholder.typicode.com/posts",
    }, function(error, response, body) {
        console.log(body);
        res.json(body);
    });
});
app.get('/test2', function(req, res) {
	 var point_master_stmt = "update MBRFLIB/MCRS2P ";
     point_master_stmt += " set MBPOINR=?, MBPOINT=? , MBPOINC=?";
     point_master_stmt += " where MBCODE=7109000900003026";
     var point_master_params = [ 0,200000,200000 ];
     //MCRR2P - not implemented yet
     //point_log2_stmt = "";
	console.log("UPDATE");
     pool.update(point_master_stmt, point_master_params)
         .then(function(master_result) {
             console.log(master_result);
            //console.log(result[0].HLDNAM);
            console.log(master_result.length);
            res.json(master_result);
        })
        .fail(function(error) {
            console.log(error);
        });

});

app.get('/test3', function(req, res) {
    var stmt = "select * from(select ROW_NUMBER() OVER (ORDER BY  MVM01P.MBCODE) AS ROWNUM, MVM01P.MBCODE,MVM01P.MBMEMC,MVM01P.MBEXP,";
    stmt += " MCRS2P.MBPOINT,MCRS2P.MBCEXP,MCRS2P.MBDATT,";
    stmt += " MVM01P.MBTTLE,MVM01P.MBTNAM,MVM01P.MBTSUR,";
    stmt += " MVM01P.MBETLE,MVM01P.MBENAM,MVM01P.MBESUR,";
    stmt += " PM110MP.PNPROD,PM110MP.PNNUM,PM110MP.PNDETAIL,PM110MP.CLADTE,PM200MP.MBID";
    stmt += " from MBRFLIB/PM200MP PM200MP";
    stmt += " inner join MBRFLIB/MVM01P MVM01P on PM200MP.MBCODE = MVM01P.MBCODE";
    stmt += " inner join MBRFLIB/MCRS2P MCRS2P on PM200MP.MBCODE = MCRS2P.MBCODE";
    stmt += " inner join MBRFLIB/PM110MP PM110MP on PM200MP.PNID = PM110MP.PNID and PM200MP.PNNUM = PM110MP.PNNUM) as tbl";


    pool.query(stmt)
        .then(function(result) {
            //console.log(result[0].HLDNAM);
            console.log(result.length);
            console.log(result);
            res.json(result);
        })
        .fail(function(error) {
            console.log(error);
        });

});

app.get('/test4', function(req, res) {
    var stmt = "select * from MBRFLIB/MCRR1P where MBCODE = '7109000900003026'";

    pool.query(stmt)
        .then(function(result) {
            //console.log(result[0].HLDNAM);
            console.log(result.length);
            console.log(result);
            res.json(result);
        })
        .fail(function(error) {
            console.log(error);
        });

});


app.post('/inquiry_mpoint', function(req, res) {
    var stmt = "select MVM01P.MBCODE,MVM01P.MBMEMC,MVM01P.MBEXP,";
    stmt += " MCRS2P.MBPOINT,MCRS2P.MBCEXP,MCRS2P.MBDATT,";
    stmt += " MVM01P.MBTTLE,MVM01P.MBTNAM,MVM01P.MBTSUR,";
    stmt += " MVM01P.MBETLE,MVM01P.MBENAM,MVM01P.MBESUR ";
    stmt += " from MBRFLIB/MVM01P MVM01P";
    stmt += " inner join MBRFLIB/PM200MP PM200MP on MVM01P.MBCODE = PM200MP.MBCODE";
    stmt += " inner join MBRFLIB/MCRS2P MCRS2P on MVM01P.MBCODE = MCRS2P.MBCODE";
    stmt += " where PM200MP.PNID = '" + req.body.PARTNER_ID + "' and PM200MP.PNNUM = '" + req.body.PARTNER_NBR + "'";

    console.log(stmt);
    pool.query(stmt)
        .then(function(result) {
            console.log(result.length);
            console.log(result);

            if (result.length <= 0) {
                //302 - no mcard
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": "",
                    "RESP_CDE": 302,
                    "MCARD_NUM": "",
                    "CARD_TYPE": 0,
                    "CARD_EXPIRY_DATE": "",
                    "CARD_POINT_BALANCE": "",
                    "CARD_POINT_EXPIRY": "",
                    "CARD_POINT_EXP_DATE": "",
                    "DEMO_TH_TITLE": "",
                    "DEMO_TH_NAME": "",
                    "DEMO_TH_SURNAME": "",
                    "DEMO_EN_TITLE": "",
                    "DEMO_EN_NAME": "",
                    "DEMO_EN_SURNAME": ""
                });
            } else if (result.length == 1) {
                //101 - success
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": "",
                    "RESP_CDE": 101,
                    "MCARD_NUM": result[0].MBCODE,
                    "CARD_TYPE": result[0].MBMEMC,
                    "CARD_EXPIRY_DATE": result[0].MBEXP,
                    "CARD_POINT_BALANCE": result[0].MBPOINT,
                    "CARD_POINT_EXPIRY": result[0].MBCEXP,
                    "CARD_POINT_EXP_DATE": result[0].MBDATT,
                    "DEMO_TH_TITLE": result[0].MBTTLE,
                    "DEMO_TH_NAME": result[0].MBTNAM,
                    "DEMO_TH_SURNAME": result[0].MBTSUR,
                    "DEMO_EN_TITLE": result[0].MBETLE,
                    "DEMO_EN_NAME": result[0].MBENAM,
                    "DEMO_EN_SURNAME": result[0].MBESUR
                });
            } else if (result.length > 1) {
                //102 - more than 1 card
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": "",
                    "RESP_CDE": 101,
                    "MCARD_NUM": result[0].MBCODE,
                    "CARD_TYPE": result[0].MBMEMC,
                    "CARD_EXPIRY_DATE": result[0].MBEXP,
                    "CARD_POINT_BALANCE": result[0].MBPOINT,
                    "CARD_POINT_EXPIRY": result[0].MBCEXP,
                    "CARD_POINT_EXP_DATE": result[0].MBDATT,
                    "DEMO_TH_TITLE": result[0].MBTTLE,
                    "DEMO_TH_NAME": result[0].MBTNAM,
                    "DEMO_TH_SURNAME": result[0].MBTSUR,
                    "DEMO_EN_TITLE": result[0].MBETLE,
                    "DEMO_EN_NAME": result[0].MBENAM,
                    "DEMO_EN_SURNAME": result[0].MBESUR
                });
            } else {
                //301 - no partner card
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": "",
                    "RESP_CDE": 301,
                    "MCARD_NUM": "",
                    "CARD_TYPE": 0,
                    "CARD_EXPIRY_DATE": "",
                    "CARD_POINT_BALANCE": "",
                    "CARD_POINT_EXPIRY": "",
                    "CARD_POINT_EXP_DATE": "",
                    "DEMO_TH_TITLE": "",
                    "DEMO_TH_NAME": "",
                    "DEMO_TH_SURNAME": "",
                    "DEMO_EN_TITLE": "",
                    "DEMO_EN_NAME": "",
                    "DEMO_EN_SURNAME": ""
                });
            }
        })
        .fail(function(error) {
            console.log(error);
        });
});
//cz
app.post('/inquiry_mpoint_byid', function(req, res) {

    var cntry = '';
    var custid = '';
    var trigger = 1;
    if (req.body.CUST_COUNTRYCODE == '') {
        trigger = 0;
    } else {
        trigger = 1;
        cntry = req.body.CUST_COUNTRYCODE;
    }

    if (trigger == 1) {
        var stmt = "select * from (select ROW_NUMBER() OVER (ORDER BY  MVM01P.MBCODE) AS ROWNUM, MVM01P.MBCODE,MVM01P.MBMEMC,MVM01P.MBEXP,";
        stmt += " MCRS2P.MBPOINT,MCRS2P.MBCEXP,MCRS2P.MBDATT,";
        stmt += " MVM01P.MBTTLE,MVM01P.MBTNAM,MVM01P.MBTSUR,";
        stmt += " MVM01P.MBETLE,MVM01P.MBENAM,MVM01P.MBESUR,";
        stmt += " PM110CM100.PNPROD,PM110CM100.PNNUM,PM110CM100.PNDETAIL,PM110CM100.CLADTE";
        stmt += " from MBRFLIB/PM200MP PM200MP";
        stmt += " inner join MBRFLIB/MVM01P MVM01P on PM200MP.MBCODE = MVM01P.MBCODE";
        stmt += " inner join MBRFLIB/MCRS2P MCRS2P on PM200MP.MBCODE = MCRS2P.MBCODE";

        //1
        //stmt += " inner join MBRFLIB/PM110MP PM110MP on PM200MP.PNID = PM110MP.PNID and PM200MP.PNNUM = PM110MP.PNNUM";
        //2
        stmt += " inner join (select * from MBRFLIB/PM110MP PM110MP inner join MBRFLIB/CM100MP CM100MP on CM100MP.CNTRYCD3 = PM110MP.CNTRYCD3) as PM110CM100 on PM200MP.PNID = PM110CM100.PNID and PM200MP.PNNUM = PM110CM100.PNNUM";

        stmt += " where PM110CM100.CNTRYCD2='" + cntry + "' AND PM200MP.MBID = (select concat(CM1.CNTRYCD3,'" + req.body.CUST_ID + "') from MBRFLIB/CM100MP CM1 where CM1.CNTRYCD2 = '" + cntry + "') ) as tbl" ;
    } else {
        var stmt = "select * from (select ROW_NUMBER() OVER (ORDER BY  MVM01P.MBCODE) AS ROWNUM, MVM01P.MBCODE,MVM01P.MBMEMC,MVM01P.MBEXP,";
        stmt += " MCRS2P.MBPOINT,MCRS2P.MBCEXP,MCRS2P.MBDATT,";
        stmt += " MVM01P.MBTTLE,MVM01P.MBTNAM,MVM01P.MBTSUR,";
        stmt += " MVM01P.MBETLE,MVM01P.MBENAM,MVM01P.MBESUR,";
        stmt += " PM110MP.PNPROD,PM110MP.PNNUM,PM110MP.PNDETAIL,PM110MP.CLADTE";
        stmt += " from MBRFLIB/PM200MP PM200MP";
        stmt += " inner join MBRFLIB/MVM01P MVM01P on PM200MP.MBCODE = MVM01P.MBCODE";
        stmt += " inner join MBRFLIB/MCRS2P MCRS2P on PM200MP.MBCODE = MCRS2P.MBCODE";
        stmt += " inner join MBRFLIB/PM110MP PM110MP on PM200MP.PNID = PM110MP.PNID and PM200MP.PNNUM = PM110MP.PNNUM";
        //stmt += " where PM200MP.MBID = '" + req.body.cust_id + "' OFFSET  " + req.body.selrangedt.start + " ROWS FETCH FIRST " + req.body.selrangedt.limit + " ROWS";
        stmt += " where PM200MP.MBID = '" + req.body.CUST_ID + "') as tbl";
    }

    console.log(stmt);
    pool.query(stmt)
        .then(function(result) {
            console.log(result.length);
            console.log(result);

            if (result.length <= 0) {
                //302 - no mcard
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": "",
                    "RESP_CDE": 302,
                    "MCARD_NUM": "",
                    "CARD_TYPE": "",
                    "CARD_EXPIRY_DATE": "",
                    "CARD_POINT_BALANCE": "",
                    "CARD_POINT_EXPIRY": "",
                    "CARD_POINT_EXP_DATE": "",
                    "DEMO_TH_TITLE": "",
                    "DEMO_TH_NAME": "",
                    "DEMO_TH_SURNAME": "",
                    "DEMO_EN_TITLE": "",
                    "DEMO_EN_NAME": "",
                    "DEMO_EN_SURNAME": "",
                    "CARDS": [],
                    "RECORDCTRL": {
                        "SEQNO": 0,
                        "CARD_COUNT": 0
                    }
                });
            } else if (result.length == 1) {
                //101 - success
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": "",
                    "RESP_CDE": 102,
                    "MCARD_NUM": result[0].MBCODE,
                    "CARD_TYPE": result[0].MBMEMC,
                    "CARD_EXPIRY_DATE": result[0].MBEXP,
                    "CARD_POINT_BALANCE": result[0].MBPOINT,
                    "CARD_POINT_EXPIRY": result[0].MBCEXP,
                    "CARD_POINT_EXP_DATE": result[0].MBDATT,
                    "DEMO_TH_TITLE": result[0].MBTTLE,
                    "DEMO_TH_NAME": result[0].MBTNAM,
                    "DEMO_TH_SURNAME": result[0].MBTSUR,
                    "DEMO_EN_TITLE": result[0].MBETLE,
                    "DEMO_EN_NAME": result[0].MBENAM,
                    "DEMO_EN_SURNAME": result[0].MBESUR,
                    "CARDS": [{
                        "PARTNER_PROD": result[0].PNPROD,
                        "PARTNER_NBR": result[0].PNNUM,
                        "PARTNER_DETAILS": result[0].PNDETAIL,
                        "PARTNER_STATUS": "ACTIVE",
                        "PARTNER_DATE": result[0].CLADTE
                    }],
                    "RECORDCTRL": {
                        "SEQNO": 1,
                        "CARD_COUNT": result[0].length
                    }
                });
            } else if (result.length > 0) {
                //102 - more than 1 card
                var cards = [];
                var max_ = 0;
                var limit_ = 0;
                var start_ = parseInt(req.body.SELRANGEDT.START);
                max_ = start_;
                max_ = max_ + parseInt(req.body.SELRANGEDT.LIMIT);
                if (max_ > result.length) {
                    limit_ = result.length;
                } else if (max_ == 0) {
                    limit_ = result.length;
                } else {
                    limit_ = max_;
                }
                for (var i = start_; i < limit_; i++) {
                    cards.push({
                        "PARTNER_PROD": result[i].PNPROD,
                        "PARTNER_NBR": result[i].PNNUM,
                        "PARTNER_DETAILS": result[i].PNDETAIL,
                        "PARTNER_STATUS": "ACTIVE",
                        "PARTNER_DATE": result[i].CLADTE
                    });
                }

                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": "",
                    "RESP_CDE": 101,
                    "MCARD_NUM": result[0].MBCODE,
                    "CARD_TYPE": result[0].MBMEMC,
                    "CARD_EXPIRY_DATE": result[0].MBEXP,
                    "CARD_POINT_BALANCE": result[0].MBPOINT,
                    "CARD_POINT_EXPIRY": result[0].MBCEXP,
                    "CARD_POINT_EXP_DATE": result[0].MBDATT,
                    "DEMO_TH_TITLE": result[0].MBTTLE,
                    "DEMO_TH_NAME": result[0].MBTNAM,
                    "DEMO_TH_SURNAME": result[0].MBTSUR,
                    "DEMO_EN_TITLE": result[0].MBETLE,
                    "DEMO_EN_NAME": result[0].MBENAM,
                    "DEMO_EN_SURNAME": result[0].MBESUR,
                    "CARDS": cards,
                    "RECORDCTRL": {
                        "SEQNO": limit_,
                        "CARD_COUNT": result.length
                    }
                });
            } else {
                //301 - no partner card
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": "",
                    "RESP_CDE": 301,
                    "MCARD_NUM": "",
                    "CARD_TYPE": "",
                    "CARD_EXPIRY_DATE": "",
                    "CARD_POINT_BALANCE": "",
                    "CARD_POINT_EXPIRY": "",
                    "CARD_POINT_EXP_DATE": "",
                    "DEMO_TH_TITLE": "",
                    "DEMO_TH_NAME": "",
                    "DEMO_TH_SURNAME": "",
                    "DEMO_EN_TITLE": "",
                    "DEMO_EN_NAME": "",
                    "DEMO_EN_SURNAME": "",
                    "CARDS": [],
                    "RECORDCTRL": {
                        "SEQNO": 0,
                        "CARD_COUNT": 0
                    }
                });
            }
        })
        .fail(function(error) {
            console.log(error);
        });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err.stack);

    // render the error page
    res.status(err.status || 500);
    res.render('error');
    res.json({});
});

function get_mbrecn() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 13; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function get_mbrun() {
    return Math.floor(Math.random() * 100);
}

module.exports = app;
