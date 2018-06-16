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
    var point_master_params = [0, 200000, 200000];
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
    var stmt = "select MVM01P.MBOTEL,MVM01P.MBPTEL from MBRFLIB/MVM01P MVM01P";


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
    //var stmt = "select * from MBRFLIB/PM200MP";
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
        stmt += " where PM200MP.MBID = '3001598793505') as tbl";
		//stmt += " where PM200MP.PNID = '" + req.body.PARTNER_ID + "' and PM200MP.MBID = '" + req.body.CUST_ID + "') as tbl";
    var today = new Date();
    var date_str = '';
    date_str = today.getUTCFullYear().toString() + ((today.getUTCMonth() + 1) < 10 ? '0' : '').toString() + (today.getUTCMonth() + 1).toString() + (today.getUTCDate() < 10 ? '0' : '').toString() + today.getUTCDate();
    pool.query(stmt)
        .then(function(result) {
            //console.log(result[0].HLDNAM);
            console.log(result.length);
            console.log(result);
            res.json(result.length);
            //res.json(date_str);
        })
        .fail(function(error) {
            console.log(error);
        });

});
/*
app.head('/partner/:PARTNER_NBR', function(req,res){
  var stmt = "select PM200MP.PNNUM";
  stmt += " from MBRFLIB/PM200MP PM200MP";
  stmt += " where PM200MP.PNNUM = '" + req.params.PARTNER_NBR + "'";

  if()
  pool.query(stmt)
      .then(function(result) {
        if (result.length <= 0) res.status(404).end();
        else res.status(200).end();
      })
      .fail(function(err){
        res.status(422).end();
      });
});*/

app.post('/inquiry_mpoint', function(req, res) {
    var date_str = '';
    var today = new Date();
    date_str = today.getUTCFullYear().toString() + ((today.getUTCMonth() + 1) < 10 ? '0' : '').toString() + (today.getUTCMonth() + 1).toString() + (today.getUTCDate() < 10 ? '0' : '').toString() + today.getUTCDate();

    if ((typeof req.body.PARTNER_ID == 'undefined') || (typeof req.body.PARTNER_NBR == 'undefined')) {
        res.status(400);
        res.end();
        /*res.json({
            "RESP_SYSCDE": "",
            "RESP_DATETIME": date_str,
            "RESP_CDE": 400,
            "MCARD_NUM": "",
            "CARD_TYPE": "",
            "CARD_EXPIRY_DATE": "",
            "CARD_POINT_BALANCE": "",
            "CARD_POINT_EXPIRY": "",
            "CARD_POINT_EXP_DATE": "",
            "POINTBURN_MPOINT_SUCCESS": "0"
        });*/
    }
    var stmt_ = "SELECT PM200MP.PNID,PM200MP.PNNUM FROM MBRFLIB/PM200MP PM200MP inner join MBRFLIB/MVM01P MVM01P on PM200MP.MBCODE = MVM01P.MBCODE where PM200MP.PNNUM = '" + req.body.PARTNER_NBR + "'";
    var count_partner = 0;
    console.log(stmt_);
    pool.query(stmt_)
        .then(function(result) {
            console.log(result.length);
            console.log(result);
            count_partner = result.length;
            var stmt = "select MVM01P.MBCODE,MVM01P.MBMEMC,MVM01P.MBEXP,";
            stmt += " MCRS2P.MBPOINT,MCRS2P.MBCEXP,MCRS2P.MBDATT,";
            stmt += " MVM01P.MBTTLE,MVM01P.MBTNAM,MVM01P.MBTSUR,";
            stmt += " MVM01P.MBETLE,MVM01P.MBENAM,MVM01P.MBESUR ";
            stmt += " from MBRFLIB/MVM01P MVM01P";
            stmt += " inner join MBRFLIB/PM200MP PM200MP on MVM01P.MBCODE = PM200MP.MBCODE";
            stmt += " inner join MBRFLIB/MCRS2P MCRS2P on MVM01P.MBCODE = MCRS2P.MBCODE";
            stmt += " where PM200MP.PNID = '" + req.body.PARTNER_ID + "' and PM200MP.PNNUM = '" + req.body.PARTNER_NBR + "'";

            /*var stmt = "IF(SELECT COUNT(*) FROM MBRFLIB/PM200MP PM200MP where PM200MP.PNID = '" + req.body.PARTNER_ID + "') > 0 THEN";
            stmt += " select MVM01P.MBCODE,MVM01P.MBMEMC,MVM01P.MBEXP,";
            stmt += " MCRS2P.MBPOINT,MCRS2P.MBCEXP,MCRS2P.MBDATT,";
            stmt += " MVM01P.MBTTLE,MVM01P.MBTNAM,MVM01P.MBTSUR,";
            stmt += " MVM01P.MBETLE,MVM01P.MBENAM,MVM01P.MBESUR ";
            stmt += " from MBRFLIB/MVM01P MVM01P";
            stmt += " inner join MBRFLIB/PM200MP PM200MP on MVM01P.MBCODE = PM200MP.MBCODE";
            stmt += " inner join MBRFLIB/MCRS2P MCRS2P on MVM01P.MBCODE = MCRS2P.MBCODE";
            stmt += " where PM200MP.PNID = '" + req.body.PARTNER_ID + "' and PM200MP.PNNUM = '" + req.body.PARTNER_NBR + "';";
            stmt += " ELSE SELECT 999; END IF";*/

            console.log(stmt);
            pool.query(stmt)
                .then(function(result) {
                    console.log(result.length);
                    console.log(result);

                    if (count_partner <= 0) {
                        //302 - no mcard
                        res.status(404);
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
                    } else if (result.length <= 0 && count_partner > 0) {
                        //302 - no mcard
                        res.status(404);
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
                            "DEMO_EN_SURNAME": result[0].MBESUR
                        });
                    } else {
                        //301 - no partner card
                        res.status(404);
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
                    res.status(422);
                    res.end();
                    /*res.json({
                    	"RESP_SYSCDE": "",
                    	"RESP_DATETIME": date_str,
                    	"RESP_CDE": 400,
                    	"MCARD_NUM": "",
                    	"CARD_TYPE": "",
                    	"CARD_EXPIRY_DATE": "",
                    	"CARD_POINT_BALANCE": "",
                    	"CARD_POINT_EXPIRY": "",
                    	"CARD_POINT_EXP_DATE": "",
                    	"POINTBURN_MPOINT_SUCCESS": "0"
                    });*/
                });
        })
        .fail(function(error) {
            console.log(error);
        });


});
//cz
app.post('/inquiry_mpoint_byid', function(req, res) {
    var date_str = '';
    var today = new Date();
    date_str = today.getUTCFullYear().toString() + ((today.getUTCMonth() + 1) < 10 ? '0' : '').toString() + (today.getUTCMonth() + 1).toString() + (today.getUTCDate() < 10 ? '0' : '').toString() + today.getUTCDate();

    if ((typeof req.body.CUST_COUNTRYCODE == 'undefined') || (typeof req.body.CUST_ID == 'undefined') || (typeof req.body.PARTNER_ID == 'undefined') || (typeof req.body.SELRANGEDT == 'undefined') || (typeof req.body.SELRANGEDT.START == 'undefined') || (typeof req.body.SELRANGEDT.LIMIT == 'undefined')) {
        res.status(400);
        /*res.json({
            "RESP_SYSCDE": "",
            "RESP_DATETIME": date_str,
            "RESP_CDE": 400,
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
        });*/
    }
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

        stmt += " where PM200MP.PNID = '" + req.body.PARTNER_ID + "' and PM110CM100.CNTRYCD2='" + cntry + "' AND PM200MP.MBID = (select concat(CM1.CNTRYCD3,'" + req.body.CUST_ID + "') from MBRFLIB/CM100MP CM1 where CM1.CNTRYCD2 = '" + cntry + "') ) as tbl";
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
        stmt += " where PM200MP.PNID = '" + req.body.PARTNER_ID + "' and PM200MP.MBID = '" + req.body.CUST_ID + "') as tbl";
    }

    console.log(stmt);
    pool.query(stmt)
        .then(function(result) {
            console.log(result.length);
            console.log(result);

            if (result.length <= 0) {
                //301
                res.status(404);
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
            } else if (result.length == 1) {
                //101 - success
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": date_str,
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
                            //"PARTNER_DATE": date_str
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
                            //"PARTNER_DATE": date_str
                    });
                }

                res.json({
                    "RESP_SYSCDE": 101,
                    "RESP_DATETIME": date_str,
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
                res.status(404);
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": date_str,
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
            res.status(422);
            /*res.json({
                "RESP_SYSCDE": "",
                "RESP_DATETIME": "",
                "RESP_CDE": 422,
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
            });*/
        });
});

app.post('/redeem_mpoint', function(req, res) {
    var today = new Date();
    date_str = today.getUTCFullYear().toString() + ((today.getUTCMonth() + 1) < 10 ? '0' : '').toString() + (today.getUTCMonth() + 1).toString() + (today.getUTCDate() < 10 ? '0' : '').toString() + today.getUTCDate();
    /*req.body.PARTNER_ID
    req.body.PARTNER_NBR = '4548529000000039'
    req.body.POINTBURN_TYPE = 'DP
    req.body.POINTBURN_FLAG
    req.body.POINTBURN_BRANCH
    req.body.POINTBURN_DEPT
    req.body.POINTBURN_PROMO_NAM
    req.body.POINTBURN_ITEM_CODE
    req.body.POINTBURN_ITEM_NAME
    req.body.POINTBURN_PROMO_NUM
    req.body.POINTBURN_APPV_NUM
    req.body.POINTBURN_VENDER

    req.body.POINTBURN_EDC_SHOP_NAME
    req.body.POINTBURN_EDC_REFERENCE_NUM
    req.body.POINTBURN_EDC_RATE
    req.body.POINTBURN_EDC_SALE_AMOUNT
    req.body.POINTBURN_EDC_DISCOUNT_AMT
    req.body.POINTBURN_EDC_TERMINAL

    req.body.POINTBURN_MPOINT
    req.body.POINTBURN_PIECE


    req.body.POINTBURN_ITEM_AMT
    req.body.POINTBURN_ITEM_ADD_AMT
    req.body.POINTBURN_MILE
    req.body.POINTBURN_AIRLINECODE*/

    if ((typeof req.body.PARTNER_ID == 'undefined') || (typeof req.body.PARTNER_NBR == 'undefined') || (typeof req.body.POINTBURN_TYPE == 'undefined')) {
        console.log('Field Error Partner');
        res.status(400);
        res.end();

    }



    var current_point_stmt = "select MVM01P.MBCODE,MVM01P.MBEXP,MVM01P.MBMEMC,MCRS2P.MBPOINC, MCRS2P.MBPOINR, MCRS2P.MBPOINT, MCRS2P.MBCEXP, MCRS2P.MBDATT";
    current_point_stmt += " from MBRFLIB/MVM01P MVM01P";
    current_point_stmt += " inner join MBRFLIB/PM200MP PM200MP on MVM01P.MBCODE = PM200MP.MBCODE";
    current_point_stmt += " inner join MBRFLIB/MCRS2P MCRS2P on MVM01P.MBCODE = MCRS2P.MBCODE";
    current_point_stmt += " where PM200MP.PNID = '10200' and PM200MP.PNNUM ='" + req.body.PARTNER_NBR + "'";
    pool.query(current_point_stmt)
        .then(function(current_point_result) {
            console.log(current_point_result);

            //MCRS2P
            var cal_POINTBURN = 0;
            var POINTBURN_BRANCH_ = 0;
            var POINTBURN_ITEM_CODE_ = "";
            var POINTBURN_MPOINT_ = 0;
            var POINTBURN_PIECE_ = 0;
            var POINTBURN_MILE_ = 0;
            var POINTBURN_EDC_DISCOUNT_AMT_ = 0;
            var POINTBURN_ITEM_ADD_AMT_ = 0;
            var POINTBURN_APPV_NUM_ = "";
            var POINTBURN_EDC_REFERENCE_NUM_ = "";
            var POINTBURN_EDC_TERMINAL_ = "";
            var POINTBURN_EDC_SALE_AMOUNT_ = 0;
            var POINTBURN_EDC_RATE = "";
            if (req.body.POINTBURN_TYPE == "DP") {
                if ((typeof req.body.POINTBURN_FLAG == 'undefined') ||
                    (typeof req.body.POINTBURN_BRANCH == 'undefined') ||
                    (typeof req.body.POINTBURN_DEPT == 'undefined') ||
                    (typeof req.body.POINTBURN_PROMO_NAME == 'undefined') ||
                    (typeof req.body.POINTBURN_ITEM_CODE == 'undefined') ||
                    (typeof req.body.POINTBURN_PROMO_NUM == 'undefined') ||
                    (typeof req.body.POINTBURN_EDC_SHOP_NAME == 'undefined') ||
                    (typeof req.body.POINTBURN_EDC_REFERENCE_NUM == 'undefined') ||
                    (typeof req.body.POINTBURN_APPV_NUM == 'undefined') ||
                    (typeof req.body.POINTBURN_EDC_RATE == 'undefined') ||
                    (typeof req.body.POINTBURN_EDC_SALE_AMOUNT == 'undefined') ||
                    (typeof req.body.POINTBURN_EDC_DISCOUNT_AMT == 'undefined') ||
                    (typeof req.body.POINTBURN_EDC_TERMINAL == 'undefined') ||
                    (typeof req.body.POINTBURN_MPOINT == 'undefined')) {
                    console.log('Field Error DP');
                    res.status(400);
                    res.end();
                } else {
                    POINTBURN_BRANCH_ = req.body.POINTBURN_BRANCH;
                    POINTBURN_ITEM_CODE_ = req.body.POINTBURN_ITEM_CODE;
                    POINTBURN_MPOINT_ = parseInt(req.body.POINTBURN_MPOINT);
                    POINTBURN_EDC_DISCOUNT_AMT_ = parseInt(req.body.POINTBURN_EDC_DISCOUNT_AMT);
                    POINTBURN_APPV_NUM_ = req.body.POINTBURN_APPV_NUM;
                    POINTBURN_EDC_REFERENCE_NUM_ = req.body.POINTBURN_EDC_REFERENCE_NUM;
                    POINTBURN_EDC_TERMINAL_ = req.body.POINTBURN_EDC_TERMINAL;
                    POINTBURN_EDC_SALE_AMOUNT_ = parseInt(req.body.POINTBURN_EDC_SALE_AMOUNT);
                    POINTBURN_EDC_RATE = req.body.POINTBURN_EDC_RATE;
                }

                cal_POINTBURN = parseInt(req.body.POINTBURN_MPOINT);
            } else if (req.body.POINTBURN_TYPE == "MI") {
                if ((typeof req.body.POINTBURN_FLAG == 'undefined') ||
                    (typeof req.body.POINTBURN_BRANCH == 'undefined') ||
                    (typeof req.body.POINTBURN_ITEM_CODE == 'undefined') ||
                    (typeof req.body.POINTBURN_ITEM_NAME == 'undefined') ||
                    (typeof req.body.POINTBURN_MILE == 'undefined') ||
                    (typeof req.body.POINTBURN_AIRLINECODE == 'undefined') ||
                    (typeof req.body.POINTBURN_MPOINT == 'undefined')) {
                    console.log('Field Error MI');
                    res.status(400);
                    res.end();
                } else {
                    POINTBURN_BRANCH_ = req.body.POINTBURN_BRANCH;
                    POINTBURN_ITEM_CODE_ = req.body.POINTBURN_ITEM_CODE;
                    POINTBURN_MILE_ = parseInt(req.body.POINTBURN_MILE);
                    POINTBURN_MPOINT_ = parseInt(req.body.POINTBURN_MPOINT);
                }

                cal_POINTBURN = parseInt(req.body.POINTBURN_MPOINT) * parseInt(req.body.POINTBURN_MILE);
            } else if (req.body.POINTBURN_TYPE == "CC") {
                if ((typeof req.body.POINTBURN_FLAG == 'undefined') ||
                    (typeof req.body.POINTBURN_BRANCH == 'undefined') ||
                    (typeof req.body.POINTBURN_ITEM_CODE == 'undefined') ||
                    (typeof req.body.POINTBURN_ITEM_NAME == 'undefined') ||
                    (typeof req.body.POINTBURN_PIECE == 'undefined') ||
                    (typeof req.body.POINTBURN_ITEM_AMT == 'undefined') ||
                    (typeof req.body.POINTBURN_MPOINT == 'undefined')) {
                    console.log('Field Error CC');
                    res.status(400);
                    res.end();
                } else {
                    POINTBURN_BRANCH_ = req.body.POINTBURN_BRANCH;
                    POINTBURN_ITEM_CODE_ = req.body.POINTBURN_ITEM_CODE;
                    POINTBURN_PIECE_ = parseInt(req.body.POINTBURN_PIECE);
                    POINTBURN_MPOINT_ = parseInt(req.body.POINTBURN_MPOINT);
                }
                cal_POINTBURN = parseInt(req.body.POINTBURN_MPOINT) * parseInt(req.body.POINTBURN_PIECE);
            } else if (req.body.POINTBURN_TYPE == "SP") {
                if ((typeof req.body.POINTBURN_FLAG == 'undefined') ||
                    (typeof req.body.POINTBURN_BRANCH == 'undefined') ||
                    (typeof req.body.POINTBURN_ITEM_CODE == 'undefined') ||
                    (typeof req.body.POINTBURN_ITEM_NAME == 'undefined') ||
                    (typeof req.body.POINTBURN_VENDER == 'undefined') ||
                    (typeof req.body.POINTBURN_ITEM_ADD_AMT == 'undefined') ||
                    (typeof req.body.POINTBURN_PIECE == 'undefined') ||
                    (typeof req.body.POINTBURN_MPOINT == 'undefined')) {
                    console.log('Field Error SP');
                    res.status(400);
                    res.end();
                } else {
                    POINTBURN_BRANCH_ = req.body.POINTBURN_BRANCH;
                    POINTBURN_ITEM_CODE_ = req.body.POINTBURN_ITEM_CODE;
                    POINTBURN_PIECE_ = parseInt(req.body.POINTBURN_PIECE);
                    POINTBURN_MPOINT_ = parseInt(req.body.POINTBURN_MPOINT);
                }
                cal_POINTBURN = parseInt(req.body.POINTBURN_MPOINT) * parseInt(req.body.POINTBURN_PIECE);
            } else if (req.body.POINTBURN_TYPE == "PR") {
                if ((typeof req.body.POINTBURN_FLAG == 'undefined') ||
                    (typeof req.body.POINTBURN_BRANCH == 'undefined') ||
                    (typeof req.body.POINTBURN_ITEM_CODE == 'undefined') ||
                    (typeof req.body.POINTBURN_ITEM_NAME == 'undefined') ||
                    (typeof req.body.POINTBURN_PIECE == 'undefined') ||
                    (typeof req.body.POINTBURN_VENDER == 'undefined') ||
                    (typeof req.body.POINTBURN_MPOINT == 'undefined')) {
                    console.log('Field Error PR');
                    res.status(400);
                    res.end();
                } else {
                    POINTBURN_BRANCH_ = req.body.POINTBURN_BRANCH;
                    POINTBURN_ITEM_CODE_ = req.body.POINTBURN_ITEM_CODE;
                    POINTBURN_PIECE_ = parseInt(req.body.POINTBURN_PIECE);
                    POINTBURN_MPOINT_ = parseInt(req.body.POINTBURN_MPOINT);
                }
                cal_POINTBURN = parseInt(req.body.POINTBURN_MPOINT) * parseInt(req.body.POINTBURN_PIECE);
            } else {
                res.status(422);
                res.end();
            }



			console.log(req.body.POINTBURN_TYPE);
			console.log(current_point_result[0].MBPOINR);
            var cal_MPOINR = parseInt(current_point_result[0].MBPOINR) + cal_POINTBURN;
			console.log(cal_MPOINR);
			console.log(current_point_result[0].MBPOINC);
            var cal_MBPOINT = parseInt(current_point_result[0].MBPOINC) - cal_MPOINR;
			console.log(cal_MPOINR);
			console.log(cal_MBPOINT);
			console.log(current_point_result[0].MBCODE);




            // Now, MBPOINT (net point) is sufficient

            if (current_point_result.length <= 0) {
                //302 - no mcard
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": date_str,
                    "RESP_CDE": 302,
                    "MCARD_NUM": "",
                    "CARD_TYPE": "",
                    "CARD_EXPIRY_DATE": "",
                    "CARD_POINT_BALANCE": "",
                    "CARD_POINT_EXPIRY": "",
                    "CARD_POINT_EXP_DATE": "",
                    "POINTBURN_MPOINT_SUCCESS": "0"
                });
            } else if (current_point_result.length == 1) {
                //101 - success

                var point_master_stmt = "update MBRFLIB/MCRS2P ";
                point_master_stmt += " set MBPOINR=?, MBPOINT=? ";
                point_master_stmt += " where MBCODE=?";
                var point_master_params = [
                    cal_MPOINR,
                    cal_MBPOINT,
                    current_point_result[0].MBCODE
                ];

                if (parseInt(current_point_result[0].MBPOINT) < cal_POINTBURN) {
                    res.json({
                        "RESP_SYSCDE": "",
                        "RESP_DATETIME": date_str,
                        "RESP_CDE": 201,
                        "MCARD_NUM": current_point_result[0].MBCODE,
                        "CARD_TYPE": current_point_result[0].MBMEMC,
                        "CARD_EXPIRY_DATE": current_point_result[0].MBEXP,
                        "CARD_POINT_BALANCE": current_point_result[0].MBPOINT,
                        "CARD_POINT_EXPIRY": current_point_result[0].MBCEXP,
                        "CARD_POINT_EXP_DATE": current_point_result[0].MBDATT,
                        "POINTBURN_MPOINT_SUCCESS": "0"
                    });
                    return;
                } else {
                    var point_log_stmt = "insert into MBRFLIB/MCRR1P";
                    point_log_stmt += "(MBAPP,MBCODE,MBBRH,MBDAT,MBRDC,MBTYR,MBRECN,MBRUN,MBPOINT,MBPIE,MBFLG,MBMILE,MBPOIND,MBAMTDP,MBAMA,MBAPVO,MBREFT,TERMINAL3,MBSAMT,MBRATE)";
                    point_log_stmt += " values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    var point_log_params = [
                        (current_point_result[0].MBCODE).substring(15, (current_point_result[0].MBCODE).length),
                        current_point_result[0].MBCODE,
                        /*parseInt(req.body.POINTBURN_BRANCH), //POINTBURN_BRANCH --> MBBRH
                        0,
                        req.body.POINTBURN_ITEM_CODE, //POINTBURN_ITEM_CODE --> MBRDC
                        req.body.POINTBURN_TYPE, //POINTBUTN_TYPE --> MBFLG
                        get_mbrecn().toString(), //MBRECN (random)
                        get_mbrun(), //MBRUN (random)
                        parseInt(req.body.POINTBURN_MPOINT), //POINTBURN_MPOINT --> MBPOINT S(12)
                        parseInt(req.body.POINTBURN_PIECE), //POINTBURN_PIECE --> MBPIE S(4)
                        req.body.POINTBURN_FLAG, //POINTBURN_FLAG --> MBFLG
                        parseInt(req.body.POINTBURN_MILE), //POINTBURN_MILE --> MBMILE
                        parseInt(cal_POINTBURN),
                        parseInt(req.body.POINTBURN_EDC_DISCOUNT_AMT),
                        parseInt(req.body.POINTBURN_ITEM_ADD_AMT),
                        req.body.POINTBURN_APPV_NUM,
                        req.body.POINTBURN_EDC_REFERENCE_NUM,
                        req.body.POINTBURN_EDC_TERMINAL,
                        parseInt(req.body.POINTBURN_EDC_SALE_AMOUNT),
                        req.body.POINTBURN_EDC_RATE*/
                        POINTBURN_BRANCH_, //POINTBURN_BRANCH --> MBBRH
                        0,
                        POINTBURN_ITEM_CODE_, //POINTBURN_ITEM_CODE --> MBRDC
                        req.body.POINTBURN_TYPE, //POINTBUTN_TYPE --> MBFLG
                        get_mbrecn().toString(), //MBRECN (random)
                        get_mbrun(), //MBRUN (random)
                        parseInt(req.body.POINTBURN_MPOINT), //POINTBURN_MPOINT --> MBPOINT S(12)
                        POINTBURN_PIECE_, //POINTBURN_PIECE --> MBPIE S(4)
                        req.body.POINTBURN_FLAG, //POINTBURN_FLAG --> MBFLG
                        POINTBURN_MILE_, //POINTBURN_MILE --> MBMILE
                        parseInt(cal_POINTBURN),
                        POINTBURN_EDC_DISCOUNT_AMT_,
                        POINTBURN_ITEM_ADD_AMT_,
                        POINTBURN_APPV_NUM_,
                        POINTBURN_EDC_REFERENCE_NUM_,
                        POINTBURN_EDC_TERMINAL_,
                        POINTBURN_EDC_SALE_AMOUNT_,
                        POINTBURN_EDC_RATE
                    ];

                    //MCRR2P - not implemented yet
                    //point_log2_stmt = "";
                    console.log('point_log_stmt');
                    console.log(point_log_stmt);
                    console.log('point_log_params');
                    console.log(point_log_params);


                    pool.update(point_master_stmt, point_master_params)
                        .then(function(master_result) {
                            console.log(master_result);

                            pool.insertAndGetId(point_log_stmt, point_log_params)
                                .then(function(log_result) {
                                    console.log(log_result);




                                    res.json({
                                        "RESP_SYSCDE": "",
                                        "RESP_DATETIME": date_str,
                                        "RESP_CDE": 101,
                                        "MCARD_NUM": current_point_result[0].MBCODE,
                                        "CARD_TYPE": current_point_result[0].MBMEMC,
                                        "CARD_EXPIRY_DATE": current_point_result[0].MBEXP,
                                        "CARD_POINT_BALANCE": cal_MBPOINT.toString(),
                                        "CARD_POINT_EXPIRY": current_point_result[0].MBCEXP,
                                        "CARD_POINT_EXP_DATE": current_point_result[0].MBDATT,
                                        "POINTBURN_MPOINT_SUCCESS": cal_POINTBURN
                                    });
                                })
                                .fail(function(log_error) {
                                    console.log("ERROR UPDATE");
                                    console.log(log_error);
                                    res.status(500);
                                    /*
                                    res.json({
                                    	"RESP_SYSCDE": "",
                                    	"RESP_DATETIME": date_str,
                                    	"RESP_CDE": 500,
                                    	"MCARD_NUM": "",
                                    	"CARD_TYPE": "",
                                    	"CARD_EXPIRY_DATE": "",
                                    	"CARD_POINT_BALANCE": "",
                                    	"CARD_POINT_EXPIRY": "",
                                    	"CARD_POINT_EXP_DATE": "",
                                    	"POINTBURN_MPOINT_SUCCESS": "0"
                                    });*/
                                });
                        })
                        .fail(function(master_error) {
                            res.status(500);
                            /*res.json({
                            	"RESP_SYSCDE": "",
                            	"RESP_DATETIME": date_str,
                            	"RESP_CDE": 500,
                            	"MCARD_NUM": "",
                            	"CARD_TYPE": "",
                            	"CARD_EXPIRY_DATE": "",
                            	"CARD_POINT_BALANCE": "",
                            	"CARD_POINT_EXPIRY": "",
                            	"CARD_POINT_EXP_DATE": "",
                            	"POINTBURN_MPOINT_SUCCESS": "0"
                            });*/
                        });

                }


            } else if (current_point_result.length > 1) {
                // 102 - more than 1 card
                // หากพบหลาย MCARD_NUM ให้เลือก อันที่สมัครล่าสุด โดยดูจาก MBDAT และ CARD_EXPIRY_DATE ยังไม่หมดอายุ
                /*res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": date_str,
                    "RESP_CDE": 102,
                    "MCARD_NUM": current_point_result[0].MBCODE,
                    "CARD_TYPE": current_point_result[0].MBMEMC,
                    "CARD_EXPIRY_DATE": current_point_result[0].MBEXP,
                    "CARD_POINT_BALANCE": cal_MBPOINT.toString(),
                    "CARD_POINT_EXPIRY": current_point_result[0].MBCEXP,
                    "CARD_POINT_EXP_DATE": current_point_result[0].MBDATT,
                    "POINTBURN_MPOINT_SUCCESS": "0"
                });*/
				var point_master_stmt = "update MBRFLIB/MCRS2P ";
                point_master_stmt += " set MBPOINR=?, MBPOINT=? ";
                point_master_stmt += " where MBCODE=?";
                var point_master_params = [
                    cal_MPOINR,
                    cal_MBPOINT,
                    current_point_result[0].MBCODE
                ];

                if (parseInt(current_point_result[0].MBPOINT) < cal_POINTBURN) {
                    res.json({
                        "RESP_SYSCDE": "",
                        "RESP_DATETIME": date_str,
                        "RESP_CDE": 201,
                        "MCARD_NUM": current_point_result[0].MBCODE,
                        "CARD_TYPE": current_point_result[0].MBMEMC,
                        "CARD_EXPIRY_DATE": current_point_result[0].MBEXP,
                        "CARD_POINT_BALANCE": current_point_result[0].MBPOINT,
                        "CARD_POINT_EXPIRY": current_point_result[0].MBCEXP,
                        "CARD_POINT_EXP_DATE": current_point_result[0].MBDATT,
                        "POINTBURN_MPOINT_SUCCESS": "0"
                    });
                    return;
                } else {
                    var point_log_stmt = "insert into MBRFLIB/MCRR1P";
                    point_log_stmt += "(MBAPP,MBCODE,MBBRH,MBDAT,MBRDC,MBTYR,MBRECN,MBRUN,MBPOINT,MBPIE,MBFLG,MBMILE,MBPOIND,MBAMTDP,MBAMA,MBAPVO,MBREFT,TERMINAL3,MBSAMT,MBRATE)";
                    point_log_stmt += " values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    var point_log_params = [
                        (current_point_result[0].MBCODE).substring(15, (current_point_result[0].MBCODE).length),
                        current_point_result[0].MBCODE,
                        POINTBURN_BRANCH_, //POINTBURN_BRANCH --> MBBRH
                        0,
                        POINTBURN_ITEM_CODE_, //POINTBURN_ITEM_CODE --> MBRDC
                        req.body.POINTBURN_TYPE, //POINTBUTN_TYPE --> MBFLG
                        get_mbrecn().toString(), //MBRECN (random)
                        get_mbrun(), //MBRUN (random)
                        parseInt(req.body.POINTBURN_MPOINT), //POINTBURN_MPOINT --> MBPOINT S(12)
                        POINTBURN_PIECE_, //POINTBURN_PIECE --> MBPIE S(4)
                        req.body.POINTBURN_FLAG, //POINTBURN_FLAG --> MBFLG
                        POINTBURN_MILE_, //POINTBURN_MILE --> MBMILE
                        parseInt(cal_POINTBURN),
                        POINTBURN_EDC_DISCOUNT_AMT_,
                        POINTBURN_ITEM_ADD_AMT_,
                        POINTBURN_APPV_NUM_,
                        POINTBURN_EDC_REFERENCE_NUM_,
                        POINTBURN_EDC_TERMINAL_,
                        POINTBURN_EDC_SALE_AMOUNT_,
                        POINTBURN_EDC_RATE
                    ];

                    //MCRR2P - not implemented yet
                    //point_log2_stmt = "";
                    console.log('point_log_stmt');
                    console.log(point_log_stmt);
                    console.log('point_log_params');
                    console.log(point_log_params);


                    pool.update(point_master_stmt, point_master_params)
                        .then(function(master_result) {
                            console.log(master_result);

                            pool.insertAndGetId(point_log_stmt, point_log_params)
                                .then(function(log_result) {
                                    console.log(log_result);
                                    res.json({
                                        "RESP_SYSCDE": "",
                                        "RESP_DATETIME": date_str,
                                        "RESP_CDE": 102,
                                        "MCARD_NUM": current_point_result[0].MBCODE,
                                        "CARD_TYPE": current_point_result[0].MBMEMC,
                                        "CARD_EXPIRY_DATE": current_point_result[0].MBEXP,
                                        "CARD_POINT_BALANCE": cal_MBPOINT.toString(),
                                        "CARD_POINT_EXPIRY": current_point_result[0].MBCEXP,
                                        "CARD_POINT_EXP_DATE": current_point_result[0].MBDATT,
                                        "POINTBURN_MPOINT_SUCCESS": cal_POINTBURN
                                    });
                                })
                                .fail(function(log_error) {
                                    console.log("ERROR UPDATE");
                                    console.log(log_error);
                                    res.status(500);
                                });
                        })
                        .fail(function(master_error) {
                            res.status(500);
                        });

                }
				
            } else {
                //301 - no partner card
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": date_str,
                    "RESP_CDE": 301,
                    "MCARD_NUM": "",
                    "CARD_TYPE": "",
                    "CARD_EXPIRY_DATE": "",
                    "CARD_POINT_BALANCE": "",
                    "CARD_POINT_EXPIRY": "",
                    "CARD_POINT_EXP_DATE": "",
                    "POINTBURN_MPOINT_SUCCESS": "0"
                });
            }
        })
        .fail(function(error) {
            res.status(500);
            /*res.json({
                "RESP_SYSCDE": "",
                "RESP_DATETIME": date_str,
                "RESP_CDE": 500,
                "MCARD_NUM": "",
                "CARD_TYPE": "",
                "CARD_EXPIRY_DATE": "",
                "CARD_POINT_BALANCE": "",
                "CARD_POINT_EXPIRY": "",
                "CARD_POINT_EXP_DATE": "",
                "POINTBURN_MPOINT_SUCCESS": "0"
            });*/
        });

});

/**
 * =====================================================================================
 * TMG - iCFS
 * =====================================================================================
 */
app.post('/membercard', function(req, res) {
	
	if (typeof req.body.MBCODE == 'undefined') {
        res.status(401);
        res.json({
			"RESP_CDE": 401,
			"message": "Missing Required Field"
		});
        /*res.json({
            "RESP_SYSCDE": "",
            "RESP_DATETIME": date_str,
            "RESP_CDE": 400,
            "MCARD_NUM": "",
            "CARD_TYPE": "",
            "CARD_EXPIRY_DATE": "",
            "CARD_POINT_BALANCE": "",
            "CARD_POINT_EXPIRY": "",
            "CARD_POINT_EXP_DATE": "",
            "POINTBURN_MPOINT_SUCCESS": "0"
        });*/
    }
	
	else{
		var stmt = "select MVM01P.MBID,MVM01P.MBTTLE,MVM01P.MBTNAM,MVM01P.MBTSUR,";
			stmt += " MVM01P.MBETLE,MVM01P.MBENAM,MVM01P.MBESUR,MVM01P.MBPTEL ";
			stmt += " from MBRFLIB/MVM01P MVM01P";
			stmt += " where MVM01P.MBCODE = '" + req.body.MBCODE + "' ";

			console.log(stmt);
			pool.query(stmt)
				.then(function(result) {
					console.log(result.length);
					console.log(result);


					if (result.length <= 0) {
						//No mcard found
						res.status(404);
						res.json({
							"message": "record not found"
						});
						res.end();
					} else if (result.length >= 1) {
						//Success
						if(isNaN(result[0].MBID)){
							res.json({
								"fnme": result[0].MBENAM,
								"lnme": result[0].MBESUR,
								"lgnme": "EN",
								"mobile": result[0].MBPTEL
							});
						}
						else{
							res.json({
								"fnme": result[0].MBTNAM,
								"lnme": result[0].MBTSUR,
								"lgnme": "TH",
								"mobile": result[0].MBPTEL
							});
						}						
					}
				})
				.fail(function(error) {
					res.status(500);
					res.json({
						"message": error
					});
				});
	}
    
});


/**
 * =====================================================================================
 * Cobrand - validateID
 * =====================================================================================
 */
app.post('/validateid', function(req, res) {

    
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
		

    console.log(stmt);
    pool.query(stmt)
        .then(function(result) {
            console.log(result.length);
            console.log(result);

            if (result.length <= 0) {
                //301 - no mcard
                res.status(404);
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": "",
                    "RESP_CDE": 301,
                    "MCARD_NUM": "",
                    "CARD_TYPE": "",
                    "CARD_EXPIRY_DATE": "",
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
                });
            } else if (result.length > 1) {
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": "",
                    "RESP_CDE": 102,
                    "MCARD_NUM": result[0].MBCODE,
                    "CARD_TYPE": result[0].MBMEMC,
                    "CARD_EXPIRY_DATE": result[0].MBEXP,
                });
            }
        })
        .fail(function(error) {
			console.log(error);
            res.status(500);
            res.json({
                "message": "Internal error"
            });
        });
});

// Cobrand - updatePassport
app.post('/update_passport', function(req, res) {
    var partner_master_stmt = "update MBRFLIB/PM200MP PM200MP ";
    partner_master_stmt += " set MBID=?";
    partner_master_stmt += " where PM200MP.PNID = '" + req.body.PARTNER_ID + "' and PM200MP.PNNUM = '" + req.body.PARTNER_NBR + "' and PM200MP.MBID= '" + req.body.CUST_ID_OLD + "'";
    var partner_master_params = [req.body.CUST_ID_NEW];

    var statusCode = 101;

    console.log("UPDATE");
    pool.update(partner_master_stmt, partner_master_params)
        .then(function(master_result) {
            console.log(master_result);
            //console.log(master_result.length);
            if (master_result == 1) {
				console.log("single record");
				var stmt = "select * from MBRFLIB/PM200MP where PM200MP.PNID = '" + req.body.PARTNER_ID + "' and PM200MP.PNNUM = '" + req.body.PARTNER_NBR + "' and PM200MP.MBID= '" + req.body.CUST_ID_NEW + "'";
				var today = new Date();
				var date_str = '';
				date_str = today.getUTCFullYear().toString() + ((today.getUTCMonth() + 1) < 10 ? '0' : '').toString() + (today.getUTCMonth() + 1).toString() + (today.getUTCDate() < 10 ? '0' : '').toString() + today.getUTCDate();
				pool.query(stmt)
					.then(function(result) {
						//console.log(result[0].HLDNAM);
						console.log(result.length);
						//console.log(result);						
						res.json({
							"RESP_SYSCDE": "",
							"RESP_DATETIME": "",
							"RESP_CDE": 101,
							"MCARD_NUM": result[0].MBCODE,
							"CARD_TYPE": result[0].MBMEMC,
							"CARD_EXPIRY_DATE": result[0].MBEXP,
						});
					})
					.fail(function(error) {
						console.log(error);
					});
                
            } else if (master_result >= 1) {
                console.log("multiple records");
				var stmt = "select * from MBRFLIB/PM200MP where PM200MP.PNID = '" + req.body.PARTNER_ID + "' and PM200MP.PNNUM = '" + req.body.PARTNER_NBR + "' and PM200MP.MBID= '" + req.body.CUST_ID_NEW + "'";
				var today = new Date();
				var date_str = '';
				date_str = today.getUTCFullYear().toString() + ((today.getUTCMonth() + 1) < 10 ? '0' : '').toString() + (today.getUTCMonth() + 1).toString() + (today.getUTCDate() < 10 ? '0' : '').toString() + today.getUTCDate();
				pool.query(stmt)
					.then(function(result) {
						//console.log(result[0].HLDNAM);
						console.log(result.length);
						//console.log(result);						
						res.json({
							"RESP_SYSCDE": "",
							"RESP_DATETIME": "",
							"RESP_CDE": 102,
							"MCARD_NUM": result[0].MBCODE,
							"CARD_TYPE": result[0].MBMEMC,
							"CARD_EXPIRY_DATE": result[0].MBEXP,
						});
					})
					.fail(function(error) {
						console.log(error);
					});
            } else { // no updated records
				console.log("no updated records");
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": "",
                    "RESP_CDE": 303,
                    "MCARD_NUM": "",
                    "CARD_TYPE": "",
                    "CARD_EXPIRY_DATE": "",
                });
                // left over - 301, 302
            }
        })
        .fail(function(error) {
            json.status(500);
        });
});

// Cobrand - updatePartner 
app.post('/update_partner', function(req, res) {
    var partner_master_stmt = "update MBRFLIB/PM200MP PM200MP ";
    partner_master_stmt += " set PNNUM=?,PNSTS=?";
    partner_master_stmt += " where PM200MP.PNID = '" + req.body.PARTNER_ID + "' and PM200MP.MBID = '" + req.body.CUST_ID + "'";
    var partner_master_params = [req.body.PARTNER_NBR, req.body.PARTNER_DETAILS];

    console.log("UPDATE");
    pool.update(partner_master_stmt, partner_master_params)
        .then(function(master_result) {
            console.log(master_result);
            //console.log(master_result.length);
            if (master_result == 1) {
				console.log("single record");
				var stmt = "select * from MBRFLIB/PM200MP where PM200MP.PNID = '" + req.body.PARTNER_ID + "' and PM200MP.MBID = '" + req.body.CUST_ID + "'";
				var today = new Date();
				var date_str = '';
				date_str = today.getUTCFullYear().toString() + ((today.getUTCMonth() + 1) < 10 ? '0' : '').toString() + (today.getUTCMonth() + 1).toString() + (today.getUTCDate() < 10 ? '0' : '').toString() + today.getUTCDate();
				pool.query(stmt)
					.then(function(result) {
						//console.log(result[0].HLDNAM);
						console.log(result.length);
						//console.log(result);						
						res.json({
						"RESP_SYSCDE": "",
						"RESP_DATETIME": "",
						"RESP_CDE": 101,
						"MCARD_NUM": result[0].MBCODE,
						"CARD_TYPE": result[0].MBMEMC,
						"CARD_EXPIRY_DATE": result[0].MBEXP,
						});
					})
					.fail(function(error) {
						console.log(error);
					});                
            } else if (master_result >= 1) {
				console.log("multiple records");
                var stmt = "select * from MBRFLIB/PM200MP where PM200MP.PNID = '" + req.body.PARTNER_ID + "' and PM200MP.MBID = '" + req.body.CUST_ID + "'";
				var today = new Date();
				var date_str = '';
				date_str = today.getUTCFullYear().toString() + ((today.getUTCMonth() + 1) < 10 ? '0' : '').toString() + (today.getUTCMonth() + 1).toString() + (today.getUTCDate() < 10 ? '0' : '').toString() + today.getUTCDate();
				pool.query(stmt)
					.then(function(result) {
						//console.log(result[0].HLDNAM);
						console.log(result.length);
						//console.log(result);						
						res.json({
						"RESP_SYSCDE": "",
						"RESP_DATETIME": "",
						"RESP_CDE": 102,
						"MCARD_NUM": result[0].MBCODE,
						"CARD_TYPE": result[0].MBMEMC,
						"CARD_EXPIRY_DATE": result[0].MBEXP,
						});
					})
					.fail(function(error) {
						console.log(error);
					});                
            } else { // no updated records
				console.log("no updated records");
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": "",
                    "RESP_CDE": 302,
                    "MCARD_NUM": "",
                    "CARD_TYPE": "",
                    "CARD_EXPIRY_DATE": "",
                });
                // left over - 302
            }
        })
        .fail(function(error) {
            json.status(500);
        });
});


/**
 * =====================================================================================
 * Cobrand - earnPoint
 * =====================================================================================
 */
app.post('/earn_mpoint', function(req, res) {

    var current_point_stmt = "select MVM01P.MBCODE,MVM01P.MBEXP,MVM01P.MBMEMC,MCRS2P.MBPOINC,MCRS2P.MBPOINR,MCRS2P.MBPOINE,MCRS2P.MBPOINS,MCRS2P.MBPOINP , MCRS2P.MBPOINT, MCRS2P.MBCEXP, MCRS2P.MBDATT, MCRS2P.MBAMTS, MCRS2P.MBAMTF, MCRS2P.MBPOIF";
    current_point_stmt += " from MBRFLIB/MVM01P MVM01P";
    current_point_stmt += " inner join MBRFLIB/PM200MP PM200MP on MVM01P.MBCODE = PM200MP.MBCODE";
    current_point_stmt += " inner join MBRFLIB/MCRS2P MCRS2P on MVM01P.MBCODE = MCRS2P.MBCODE";
    current_point_stmt += " where PM200MP.PNID = '10200' and PM200MP.PNNUM ='" + req.body.PARTNER_NBR + "'";
    pool.query(current_point_stmt)
        .then(function(current_point_result) {
            console.log(current_point_result);

            if (current_point_result.length <= 0) {
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
                    "POINTBURN_MPOINT_SUCCESS": "0"
                });
            } else if (current_point_result.length == 1) {
                //101 - success
                var cal_MBPOINC = parseInt(current_point_result[0].MBPOINC) + parseInt(req.body.POINTEARN_MPOINT_SPECIAL);
                var cal_MBPOINT = parseInt(current_point_result[0].MBPOINT) + parseInt(req.body.POINTEARN_MPOINT_SPECIAL);

                var point_master_stmt = "update MBRFLIB/MCRS2P ";
                point_master_stmt += " set MBPOINC=?, MBPOINT=? ";
                point_master_stmt += " where MBCODE=?";
                var point_master_params = [
                    cal_MBPOINC,
                    cal_MBPOINT,
                    current_point_result[0].MBCODE
                ];


                var point_log_stmt = "insert into MBRFLIB/MCRS1P";
                point_log_stmt += "(MBBRH,MBCPER,MBCODE,MBAPP,MBAMT,MBPOINC,MBPOINE,MBPOINS,MBPOINP,MBDATT,MBFLG,MBAMTS,MBAMTF,MBPOIF)";
                point_log_stmt += " values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                var point_log_params = [
                    parseInt(req.body.POINTBURN_BRANCH), //POINTBURN_BRANCH --> MBBRH 
                    '',
                    current_point_result[0].MBCODE,
                    (current_point_result[0].MBCODE).substring(15, (current_point_result[0].MBCODE).length),
                    req.body.POINTEARN_SALE_AMOUNT, //**** can be null
                    current_point_result[0].MBPOINC,
                    current_point_result[0].MBPOINE,
                    current_point_result[0].MBPOINS,
                    current_point_result[0].MBPOINP,
                    current_point_result[0].MBDATT,
                    '',
                    current_point_result[0].MBAMTS,
                    current_point_result[0].MBAMTF,
                    current_point_result[0].MBPOIF
                ];

                //MCRR2P - not implemented yet
                //point_log2_stmt = ""; 

                pool.update(point_master_stmt, point_master_params)
                    .then(function(master_result) {
                        console.log(master_result);

                        pool.insertAndGetId(point_log_stmt, point_log_params)
                            .then(function(log_result) {
                                console.log(log_result);
                                res.json({
                                    "RESP_SYSCDE": "",
                                    "RESP_DATETIME": "",
                                    "RESP_CDE": 101,
                                    "MCARD_NUM": current_point_result[0].MBCODE,
                                    "CARD_TYPE": current_point_result[0].MBMEMC,
                                    "CARD_EXPIRY_DATE": current_point_result[0].MBEXP,
                                    "CARD_POINT_BALANCE": cal_MBPOINT.toString(),
                                    "CARD_POINT_EXPIRY": current_point_result[0].MBCEXP,
                                    "CARD_POINT_EXP_DATE": current_point_result[0].MBDATT,
                                    "POINTBURN_MPOINT_SUCCESS": req.body.POINTBURN_MPOINT
                                });
                            })
                            .fail(function(log_error) {
                                res.status(500);
                                res.json({
                                    "RESP_SYSCDE": "",
                                    "RESP_DATETIME": "",
                                    "RESP_CDE": 500,
                                    "MCARD_NUM": "",
                                    "CARD_TYPE": "",
                                    "CARD_EXPIRY_DATE": "",
                                    "CARD_POINT_BALANCE": "",
                                    "CARD_POINT_EXPIRY": "",
                                    "CARD_POINT_EXP_DATE": "",
                                    "POINTBURN_MPOINT_SUCCESS": "0"
                                });
                            });
                    })
                    .fail(function(master_error) {
                        res.status(500);
                        res.json({
                            "RESP_SYSCDE": "",
                            "RESP_DATETIME": "",
                            "RESP_CDE": 500,
                            "MCARD_NUM": "",
                            "CARD_TYPE": "",
                            "CARD_EXPIRY_DATE": "",
                            "CARD_POINT_BALANCE": "",
                            "CARD_POINT_EXPIRY": "",
                            "CARD_POINT_EXP_DATE": "",
                            "POINTBURN_MPOINT_SUCCESS": "0"
                        });
                    });

            } else if (current_point_result.length > 1) {
                var cal_MBPOINC = parseInt(current_point_result[0].MBPOINC) + parseInt(req.body.POINTEARN_MPOINT_SPECIAL);
                var cal_MBPOINT = parseInt(current_point_result[0].MBPOINT) + parseInt(req.body.POINTEARN_MPOINT_SPECIAL);

                var point_master_stmt = "update MBRFLIB/MCRS2P ";
                point_master_stmt += " set MBPOINC=?, MBPOINT=? ";
                point_master_stmt += " where MBCODE=?";
                var point_master_params = [
                    cal_MBPOINC,
                    cal_MBPOINT,
                    current_point_result[0].MBCODE
                ];


                var point_log_stmt = "insert into MBRFLIB/MCRS1P";
                point_log_stmt += "(MBBRH,MBCPER,MBCODE,MBAPP,MBAMT,MBPOINC,MBPOINE,MBPOINS,MBPOINP,MBDATT,MBFLG,MBAMTS,MBAMTF,MBPOIF)";
                point_log_stmt += " values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                var point_log_params = [
                    parseInt(req.body.POINTBURN_BRANCH), //POINTBURN_BRANCH --> MBBRH 
                    '',
                    current_point_result[0].MBCODE,
                    (current_point_result[0].MBCODE).substring(15, (current_point_result[0].MBCODE).length),
                    req.body.POINTEARN_SALE_AMOUNT, //**** can be null
                    current_point_result[0].MBPOINC,
                    current_point_result[0].MBPOINE,
                    current_point_result[0].MBPOINS,
                    current_point_result[0].MBPOINP,
                    current_point_result[0].MBDATT,
                    '',
                    current_point_result[0].MBAMTS,
                    current_point_result[0].MBAMTF,
                    current_point_result[0].MBPOIF
                ];

                //MCRR2P - not implemented yet
                //point_log2_stmt = ""; 

                pool.update(point_master_stmt, point_master_params)
                    .then(function(master_result) {
                        console.log(master_result);

                        pool.insertAndGetId(point_log_stmt, point_log_params)
                            .then(function(log_result) {
                                console.log(log_result);
                                res.json({
                                    "RESP_SYSCDE": "",
                                    "RESP_DATETIME": "",
                                    "RESP_CDE": 102,
                                    "MCARD_NUM": current_point_result[0].MBCODE,
                                    "CARD_TYPE": current_point_result[0].MBMEMC,
                                    "CARD_EXPIRY_DATE": current_point_result[0].MBEXP,
                                    "CARD_POINT_BALANCE": cal_MBPOINT.toString(),
                                    "CARD_POINT_EXPIRY": current_point_result[0].MBCEXP,
                                    "CARD_POINT_EXP_DATE": current_point_result[0].MBDATT,
                                    "POINTBURN_MPOINT_SUCCESS": req.body.POINTBURN_MPOINT
                                });
                            })
                            .fail(function(log_error) {
                                res.status(500);
                                res.json({
                                    "RESP_SYSCDE": "",
                                    "RESP_DATETIME": "",
                                    "RESP_CDE": 500,
                                    "MCARD_NUM": "",
                                    "CARD_TYPE": "",
                                    "CARD_EXPIRY_DATE": "",
                                    "CARD_POINT_BALANCE": "",
                                    "CARD_POINT_EXPIRY": "",
                                    "CARD_POINT_EXP_DATE": "",
                                    "POINTBURN_MPOINT_SUCCESS": "0"
                                });
                            });
                    })
                    .fail(function(master_error) {
                        res.status(500);
                        res.json({
                            "RESP_SYSCDE": "",
                            "RESP_DATETIME": "",
                            "RESP_CDE": 500,
                            "MCARD_NUM": "",
                            "CARD_TYPE": "",
                            "CARD_EXPIRY_DATE": "",
                            "CARD_POINT_BALANCE": "",
                            "CARD_POINT_EXPIRY": "",
                            "CARD_POINT_EXP_DATE": "",
                            "POINTBURN_MPOINT_SUCCESS": "0"
                        });
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
                    "POINTBURN_MPOINT_SUCCESS": "0"
                });
            }
        })
        .fail(function(error) {
            res.status(500);
            res.json({
                "RESP_SYSCDE": "",
                "RESP_DATETIME": "",
                "RESP_CDE": 500,
                "MCARD_NUM": "",
                "CARD_TYPE": "",
                "CARD_EXPIRY_DATE": "",
                "CARD_POINT_BALANCE": "",
                "CARD_POINT_EXPIRY": "",
                "CARD_POINT_EXP_DATE": "",
                "POINTBURN_MPOINT_SUCCESS": "0"
            });
        });

});

// Cobrand - registerMCard

// =================================================================================

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