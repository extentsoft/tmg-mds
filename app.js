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
	var today = new Date();
    pool.query(stmt)
        .then(function(result) {
            //console.log(result[0].HLDNAM);
            console.log(result.length);
            console.log(result);
            //res.json(result);
			res.json(today);
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

app.post('/redeem_mpoint', function(req, res) {
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
            if (req.body.POINTBURN_TYPE == "DP") {
                cal_POINTBURN = parseInt(req.body.POINTBURN_MPOINT);
            } else if (req.body.POINTBURN_TYPE == "MI") {
                cal_POINTBURN = parseInt(req.body.POINTBURN_MPOINT) * parseInt(req.body.POINTBURN_MILE);
            } else if (req.body.POINTBURN_TYPE == "PR" || req.body.POINTBURN_TYPE == "SR" || req.body.POINTBURN_TYPE == "CC") {
                cal_POINTBURN = parseInt(req.body.POINTBURN_MPOINT) * parseInt(req.body.POINTBURN_PIECE);
            }
            var cal_MPOINR = parseInt(current_point_result[0].MBPOINR) + cal_POINTBURN;
            var cal_MBPOINT = parseInt(current_point_result[0].MBPOINC) - cal_MPOINR;


            if (parseInt(current_point_result[0].MBPOINT) < cal_POINTBURN) {
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": "",
                    "RESP_CDE": 201,
                    "MCARD_NUM": current_point_result[0].MBCODE,
                    "CARD_TYPE": current_point_result[0].MBMEMC,
                    "CARD_EXPIRY_DATE": current_point_result[0].MBEXP,
                    "CARD_POINT_BALANCE": current_point_result[0].MBPOINT,
                    "CARD_POINT_EXPIRY": current_point_result[0].MBCEXP,
                    "CARD_POINT_EXP_DATE": current_point_result[0].MBDATT,
                    "POINTBURN_MPOINT_SUCCESS": "0"
                });
            }

            // Now, MBPOINT (net point) is sufficient

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

                var point_master_stmt = "update MBRFLIB/MCRS2P ";
                point_master_stmt += " set MBPOINR=?, MBPOINT=? ";
                point_master_stmt += " where MBCODE=?";
                var point_master_params = [
                    cal_MPOINR,
                    cal_MBPOINT,
                    current_point_result[0].MBCODE
                ];


                var point_log_stmt = "insert into MBRFLIB/MCRR1P";
                point_log_stmt += "(MBAPP,MBCODE,MBBRH,MBDAT,MBRDC,MBTYR,MBRECN,MBRUN,MBPOINT,MBPIE,MBFLG,MBMILE,MBPOIND,MBAMTDP,MBAMA,MBAPVO,MBREFT,TERMINAL3,MBSAMT,MBRATE)";
                point_log_stmt += " values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                var point_log_params = [
                    (current_point_result[0].MBCODE).substring(15, (current_point_result[0].MBCODE).length),
                    current_point_result[0].MBCODE,
                    parseInt(req.body.POINTBURN_BRANCH), //POINTBURN_BRANCH --> MBBRH
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
                    req.body.POINTBURN_EDC_RATE
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
                                    "POINTBURN_MPOINT_SUCCESS": cal_POINTBURN
                                });
                            })
                            .fail(function(log_error) {
								console.log("ERROR");
								console.log(log_error);
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
                // 102 - more than 1 card
                // หากพบหลาย MCARD_NUM ให้เลือก อันที่สมัครล่าสุด โดยดูจาก MBDAT และ CARD_EXPIRY_DATE ยังไม่หมดอายุ
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
                    "POINTBURN_MPOINT_SUCCESS": "0"
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