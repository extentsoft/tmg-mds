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
    point_master_stmt += " where MBCODE='7102100000002097'";
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
    var stmt = "delete from MBRFLIB/MCRTA7P MCRTA7P where MCRTA7P.MBID = '3001598793505'";


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
	var stmt = "delete from MBRFLIB/PM110MP PM110MP where PM110MP.PNNUM = '4548529000000006'";
    //var stmt = "select * from MBRFLIB/PM200MP";
	/*var stmt = "select max(tbl.MBCODE) as MB from (select ROW_NUMBER() OVER (ORDER BY  MVM01P.MBCODE) AS ROWNUM, MVM01P.MBCODE,MVM01P.MBMEMC,MVM01P.MBEXP,";
        stmt += " MCRS2P.MBPOINT,MCRS2P.MBCEXP,MCRS2P.MBDATT,";
        stmt += " MVM01P.MBTTLE,MVM01P.MBTNAM,MVM01P.MBTSUR,";
        stmt += " MVM01P.MBETLE,MVM01P.MBENAM,MVM01P.MBESUR,";
        stmt += " PM110MP.PNPROD,PM110MP.PNNUM,PM110MP.PNDETAIL,PM110MP.CLADTE";
        stmt += " from MBRFLIB/PM200MP PM200MP";
        stmt += " inner join MBRFLIB/MVM01P MVM01P on PM200MP.MBCODE = MVM01P.MBCODE";
        stmt += " inner join MBRFLIB/MCRS2P MCRS2P on PM200MP.MBCODE = MCRS2P.MBCODE";
        stmt += " inner join MBRFLIB/PM110MP PM110MP on PM200MP.PNID = PM110MP.PNID and PM200MP.PNNUM = PM110MP.PNNUM";
        //stmt += " where PM200MP.MBID = '" + req.body.cust_id + "' OFFSET  " + req.body.selrangedt.start + " ROWS FETCH FIRST " + req.body.selrangedt.limit + " ROWS";
		stmt += " where PM200MP.PNID = '10200' and PM200MP.PNNUM = '4548529000000006') as tbl";*/
    var today = new Date();
    var date_str = '';
    date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();
    pool.query(stmt)
        .then(function(result) {
            //console.log(result[0].HLDNAM);
            console.log(result.length);
            console.log(result);
            res.json(result);
            res.json(result.length);
        })
        .fail(function(error) {
            console.log(error);
        });

});

app.get('/test5', function(req, res) {
    var insert_mcard = "insert into MBRFLIB/MVM01P";
			insert_mcard += " (MBAPP,MBCODE,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBPUR,MBEXP,MBID,MBBIRH,MBAGE,MBPASS,MBNAT,MBHSTS,MBSEX,MBCHIL,MBJOB,MBSINC,MBHNO,MBHVIL,MBFLR,MBHSOI,MBHRD,MBHPFT,MBHBOR,MBHPRV,MBHPOS,MBHTEL,MBPTEL,MBMEMC,MBDAT,MBEMAIL,MBBRH,MBAGEN)";
			//insert_mcard += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
			insert_mcard += " values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
			//insert_mcard += " values(?,?,?,?,?,?,?,?,?,?)";
				
			var insert_mcard_params = [
				02  //MBAPP
				,mb  //MBCODE                    
				,req.body.DEMO_TH_TITLE  //MBTTLE
				,req.body.DEMO_TH_NAME  //MBTNAM
				,req.body.DEMO_TH_SURNAME  //MBTSUR
				,req.body.DEMO_EN_TITLE  //MBETLE
				,req.body.DEMO_EN_NAME  //MBENAM
				,req.body.DEMO_EN_SURNAME  //MBESUR
				,11 //MBPUR
				,999912  //MBEXP
				,citizen  //MBID
				,req.body.DEMO_DOB  //MBBIRH
				,age //MBAGE
				,passport //MBPASS
				,req.body.DEMO_NTNL  //MBNAT					
				,req.body.DEMO_MRTLSTS  //MBHSTS
				,req.body.DEMO_GENDER  //MBSEX
				,req.body.DEMO_HAVE_KIDS  //MBCHIL
				,req.body.DEMO_OCCUP  //MBJOB
				,parseInt(today.getFullYear().toString()) //MBSINC
				,req.body.ADD_HOUSE_NUM  //MBHNO
				,village  //MBHVIL
				,floor  //MBFLR
				,soi  //MBHSOI
				,req.body.ADD_ROAD  //MBHRD
				,req.body.ADD_SUB_DISTRICT  //MBHPFT
				,req.body.ADD_DISTRICT  //MBHBOR
				,req.body.ADD_PROVINCE  //MBHPRV
				,req.body.ADD_POSTAL_CODE  //MBHPOS
				,contacthome  //MBHTEL
				,req.body.CONTACT_MOBILE  //MBPTEL	
				,'MC' //MBMEMC
				,parseInt(date_str)  //MBDAT
				,req.body.CONTACT_EMAIL  //MBEMAIL
				,02 //MBBRH
				,'SCB' //MBAGEN
			 ];

			 //MCRR2P - not implemented yet
			 //point_log2_stmt = "";
			 //console.log('insert_mcard_stmt');
			 //console.log(insert_mcard);
			 //console.log('insert_mcard_params');
			 //console.log(insert_mcard_params);

			 pool.insertAndGetId(insert_mcard, insert_mcard_params)
			.then(function(log_result) {

            //console.log(result[0].HLDNAM);
            //console.log(result.length);
            //console.log(result);
            res.json(log_result);
        })
        .fail(function(error) {
            console.log(error);
        });

});

app.get('/test6', function(req, res) {
    var stmt = "select * FROM MBRFLIB/PM200MP PM200MP where PM200MP.PNNUM = '4966159000000006'";


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

app.post('/register_test_mvm', function(req, res) {
	var today = new Date();
	
	console.log('Start : ' + today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate() +' - '+ (today.getHours() < 10 ? '0' : '') + today.getHours() + ':' + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes() + ':' + (today.getSeconds() < 10 ? '0' : '') + today.getSeconds() + ':' + today.getMilliseconds());
	
    var date_str = '';
    date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();
	
	var date_str4 = date_str.substr(2,4);
	var mtyr = 'DP';
	var mrec = mtyr+date_str4;
	
	
    var stmt = "select * from MBRFLIB/MCRTA3P where SUBSTR(MBRECN,1,6)='"+ mrec +"'";

    pool.query(stmt)
        .then(function(result) {
            //console.log(result[0].HLDNAM);
            //console.log(result);
			var endcall = new Date();
	
	console.log('Start : ' + endcall.getFullYear().toString() + ((endcall.getMonth() + 1) < 10 ? '0' : '').toString() + (endcall.getMonth() + 1).toString() + (endcall.getDate() < 10 ? '0' : '').toString() + endcall.getDate() +' - '+ endcall.getDate() + (endcall.getHours() < 10 ? '0' : '') + endcall.getHours() + (endcall.getMinutes() < 10 ? '0' : '') + endcall.getMinutes() + (endcall.getSeconds() < 10 ? '0' : '') + endcall.getSeconds() + endcall.getMilliseconds());
            res.json(result);
			
        })
        .fail(function(error) {
            console.log(error);
        });

});

function length_validate(check,req){
	console.log(check);
	var res_ = [];
	check_l = check;
	console.log(check_l);
		
	for(i = 0; i < check_l.length; i++){
		console.log(check_l[i]);
		console.log(req.body[check_l[i]].toString());
		console.log(req.body[check_l[i]].toString().length);
		if(check_l[i] == 'PARTNER_ID' && req.body[check_l[i]].toString().length > 5){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'PARTNER_NBR' && req.body[check_l[i]].toString().length > 50){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'SELRANGEDT' && (req.body.SELRANGEDT.LIMIT.toString().length > 4 || req.body.SELRANGEDT.START.toString().length > 4 || isNaN(req.body.SELRANGEDT.START) || isNaN(req.body.SELRANGEDT.LIMIT) || typeof req.body.SELRANGEDT.START == 'string' || typeof req.body.SELRANGEDT.LIMIT == 'string')){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'CUST_COUNTRYCODE' && req.body[check_l[i]].toString().length > 2){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'CUST_ID' && req.body[check_l[i]].toString().length > 13){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'POINTBURN_TYPE' && req.body[check_l[i]].toString().length > 2){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'POINTBURN_FLAG' && req.body[check_l[i]].toString().length > 1){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'POINTBURN_BRANCH' && (req.body[check_l[i]].toString().length > 2 || isNaN(req.body.POINTBURN_BRANCH) || typeof req.body.POINTBURN_BRANCH == 'string')){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'POINTBURN_DEPT' && req.body[check_l[i]].toString().length > 5){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'POINTBURN_PROMO_NAME' && req.body[check_l[i]].toString().length > 20){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'POINTBURN_ITEM_CODE' && req.body[check_l[i]].toString().length > 8){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'POINTBURN_PROMO_NUM' && req.body[check_l[i]].toString().length > 4){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'POINTBURN_EDC_SHOP_NAME' && req.body[check_l[i]].toString().length > 50){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'POINTBURN_REFERENCE_NUM' && req.body[check_l[i]].toString().length > 20){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'POINTBURN_APPV_NUM' && req.body[check_l[i]].toString().length > 6){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'POINTBURN_EDC_RATE' && req.body[check_l[i]].toString().length > 12){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'POINTBURN_EDC_SALE_AMOUNT' && (req.body[check_l[i]].toString().length > 12 || isNaN(req.body.POINTBURN_EDC_SALE_AMOUNT) || typeof req.body.POINTBURN_EDC_SALE_AMOUNT == 'string')){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'POINTBURN_EDC_DISCOUNT_AMT' && (req.body[check_l[i]].toString().length > 12 || isNaN(req.body.POINTBURN_EDC_DISCOUNT_AMT) || typeof req.body.POINTBURN_EDC_DISCOUNT_AMT == 'string')){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'POINTBURN_EDC_TERMINAL' && req.body[check_l[i]].toString().length > 8){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'POINTBURN_MPOINT' && (req.body[check_l[i]].toString().length > 12 || isNaN(req.body.POINTBURN_MPOINT) || typeof req.body.POINTBURN_MPOINT == 'string')){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'POINTBURN_ITEM_NAME' && req.body[check_l[i]].toString().length > 45){
			res_.push(check_l[i]);
		}else if(check_l[i] == 'POINTBURN_MILE' && (req.body[check_l[i]].toString().length > 12 || isNaN(req.body.POINTBURN_MILE) || typeof req.body.POINTBURN_MILE == 'string')){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'POINTBURN_AIRLINECODE' && req.body[check_l[i]].toString().length > 10){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'POINTBURN_PIECE' && (req.body[check_l[i]].toString().length > 4 || isNaN(req.body.POINTBURN_PIECE) || typeof req.body.POINTBURN_PIECE == 'string')){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'POINTBURN_ITEM_AMT' && (req.body[check_l[i]].toString().length > 12 || isNaN(req.body.POINTBURN_ITEM_AMT) || typeof req.body.POINTBURN_ITEM_AMT == 'string')){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'POINTBURN_VENDER' && req.body[check_l[i]].toString().length > 5){
			res_.push(check_l[i]);
		}
		else if(check_l[i] == 'POINTBURN_ITEM_ADD_AMT' && (req.body[check_l[i]].toString().length > 12 || isNaN(req.body.POINTBURN_ITEM_ADD_AMT) || typeof req.body.POINTBURN_ITEM_ADD_AMT == 'string')){
			res_.push(check_l[i]);
		}
		
	}
	
	
	return res_;
}

app.post('/inquiry_mpoint', function(req, res) {
    var date_str = '';
    var today = new Date();
    date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();
	
	var check1 = [];
	var check2 = [];

    if ((typeof req.body.PARTNER_ID == 'undefined') || (typeof req.body.PARTNER_NBR == 'undefined')) {
		
		check1 = ['PARTNER_ID','PARTNER_NBR'];
					
		console.log(req.body);
		for(i=0;i < check1.length;i++){
			console.log(req.body[check1[i]]);
			if(typeof req.body[check1[i]] == 'undefined'){
				check2.push(check1[i]);
			}
		}
		console.log("Missing Required Field : " + check2);
        res.json({
			"RESP_CDE": 401,
			"RESP_MSG": "Missing Required Field : " + check2 
		});
		
		return;
    }
	
	/*else if(req.body.PARTNER_ID.toString().length > 5 || req.body.PARTNER_NBR.toString().length > 50){
		console.log('Max length exceed');
        res.json({
			"RESP_CDE": 402,
			"RESP_MSG": "Invalid Format"
		});
		return;
	}*/
	
	
	else{
		check1 = ['PARTNER_ID','PARTNER_NBR'];
		var x = length_validate(check1,req); 
		
		if(x.length > 0){
			res.json({
				"RESP_CDE": 402,
				"RESP_MSG": "Invalid Format : " + x
			});
			return;
		}
		else{
			
		}		
	}
    var stmt_ = "SELECT PM200MP.PNID,PM200MP.PNNUM FROM MBRFLIB/PM200MP PM200MP inner join MBRFLIB/MVM01P MVM01P on PM200MP.MBCODE = MVM01P.MBCODE where PM200MP.PNNUM = '" + req.body.PARTNER_NBR + "' and PM200MP.PNID = '" + req.body.PARTNER_ID + "'";
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
            stmt += " left join MBRFLIB/MCRS2P MCRS2P on MVM01P.MBCODE = MCRS2P.MBCODE";
            stmt += " where PM200MP.PNID = '" + req.body.PARTNER_ID + "' and PM200MP.PNNUM = '" + req.body.PARTNER_NBR + "'";

            console.log(stmt);
            pool.query(stmt)
                .then(function(result) {
                    console.log(result.length);
                    console.log(result);
					
					var MBEXP_ = 0;
					var MBPOINT_ = 0;
					var MBCEXP_ = 0;
					var MBDATT_ = 0;

					
					if(result.length <= 0 && count_partner > 0){
                    //if (count_partner <= 0) {
                        //302 - no mcard
                        res.json({
                            "RESP_SYSCDE": "",
                            "RESP_DATETIME": date_str,							
                            "RESP_CDE": 302,
							"RESP_MSG": "Not success, not found MCard",
                            "MCARD_NUM": "",
                            "CARD_TYPE": "",
                            "CARD_EXPIRY_DATE": 0,
                            "CARD_POINT_BALANCE": 0,
                            "CARD_POINT_EXPIRY": 0,
                            "CARD_POINT_EXP_DATE": 0,
                            "DEMO_TH_TITLE": "",
                            "DEMO_TH_NAME": "",
                            "DEMO_TH_SURNAME": "",
                            "DEMO_EN_TITLE": "",
                            "DEMO_EN_NAME": "",
                            "DEMO_EN_SURNAME": ""
                        });
						return;
                    } else if (result.length <= 0 && count_partner <= 0) {
                        //302 - no mcard
                        res.json({
                            "RESP_SYSCDE": "",
                            "RESP_DATETIME": date_str,
                            "RESP_CDE": 301,
							"RESP_MSG": "Not success/ Not found Partner ID/Partner NBR",
                            "MCARD_NUM": "",
                            "CARD_TYPE": "",
                            "CARD_EXPIRY_DATE": 0,
                            "CARD_POINT_BALANCE": 0,
                            "CARD_POINT_EXPIRY": 0,
                            "CARD_POINT_EXP_DATE": 0,
                            "DEMO_TH_TITLE": "",
                            "DEMO_TH_NAME": "",
                            "DEMO_TH_SURNAME": "",
                            "DEMO_EN_TITLE": "",
                            "DEMO_EN_NAME": "",
                            "DEMO_EN_SURNAME": ""
                        });
						return;
                    } else if (result.length == 1) {
                        //101 - success
						var MBEXP_ = 0;
						var MBPOINT_ = 0;
						var MBCEXP_ = 0;
						var MBDATT_ = 0;
						if(result[0].MBEXP){
							MBEXP_ = result[0].MBEXP;
						}
						if(result[0].MBPOINT){
							MBPOINT_ = result[0].MBPOINT;
						}
						if(result[0].MBCEXP){
							MBCEXP_ = result[0].MBCEXP;
						}
						if(result[0].MBDATT){
							MBDATT_ = result[0].MBDATT;
						}
                        res.json({
                            "RESP_SYSCDE": "",
                            "RESP_DATETIME": date_str,
                            "RESP_CDE": 101,
							"RESP_MSG": "Success",
                            "MCARD_NUM": result[0].MBCODE,
                            "CARD_TYPE": result[0].MBMEMC,
                            "CARD_EXPIRY_DATE": MBEXP_,
                            "CARD_POINT_BALANCE": MBPOINT_,
                            "CARD_POINT_EXPIRY": MBCEXP_,
                            "CARD_POINT_EXP_DATE": MBDATT_,
                            "DEMO_TH_TITLE": result[0].MBTTLE,
                            "DEMO_TH_NAME": result[0].MBTNAM,
                            "DEMO_TH_SURNAME": result[0].MBTSUR,
                            "DEMO_EN_TITLE": result[0].MBETLE,
                            "DEMO_EN_NAME": result[0].MBENAM,
                            "DEMO_EN_SURNAME": result[0].MBESUR
                        });
						return;
                    } else if (result.length > 1) {
                        //102 - more than 1 card
						var MBEXP_ = 0;
						var MBPOINT_ = 0;
						var MBCEXP_ = 0;
						var MBDATT_ = 0;
						if(result[0].MBEXP){
							MBEXP_ = result[0].MBEXP;
						}
						if(result[0].MBPOINT){
							MBPOINT_ = result[0].MBPOINT;
						}
						if(result[0].MBCEXP){
							MBCEXP_ = result[0].MBCEXP;
						}
						if(result[0].MBDATT){
							MBDATT_ = result[0].MBDATT;
						}
                        res.json({
                            "RESP_SYSCDE": "",
                            "RESP_DATETIME": date_str,
                            "RESP_CDE": 102,
							"RESP_MSG": "Success, found many Mcard",
                            "MCARD_NUM": result[0].MBCODE,
                            "CARD_TYPE": result[0].MBMEMC,
                            "CARD_EXPIRY_DATE": MBEXP_,
                            "CARD_POINT_BALANCE": MBPOINT_,
                            "CARD_POINT_EXPIRY": MBCEXP_,
                            "CARD_POINT_EXP_DATE": MBDATT_,
                            "DEMO_TH_TITLE": result[0].MBTTLE,
                            "DEMO_TH_NAME": result[0].MBTNAM,
                            "DEMO_TH_SURNAME": result[0].MBTSUR,
                            "DEMO_EN_TITLE": result[0].MBETLE,
                            "DEMO_EN_NAME": result[0].MBENAM,
                            "DEMO_EN_SURNAME": result[0].MBESUR
                        });
						return;
                    } else {
                        //301 - no partner card
                        res.json({
                            "RESP_SYSCDE": "",
                            "RESP_DATETIME": date_str,
                            "RESP_CDE": 301,
							"RESP_MSG": "Not success/ Not found Partner ID/Partner NBR",
                            "MCARD_NUM": "",
                            "CARD_TYPE": "",
                            "CARD_EXPIRY_DATE": 0,
                            "CARD_POINT_BALANCE": 0,
                            "CARD_POINT_EXPIRY": 0,
                            "CARD_POINT_EXP_DATE": 0,
                            "DEMO_TH_TITLE": "",
                            "DEMO_TH_NAME": "",
                            "DEMO_TH_SURNAME": "",
                            "DEMO_EN_TITLE": "",
                            "DEMO_EN_NAME": "",
                            "DEMO_EN_SURNAME": ""
                        });
						return;
                    }
                })
                .fail(function(error) {
                    console.log(error);
                    res.status(500);
					res.end();
					return;
                });
        })
        .fail(function(error) {
            console.log(error);
			res.status(500);
			res.end();
			return;
        });


});
//cz
app.post('/inquiry_mpoint_byid', function(req, res) {
    var date_str = '';
    var today = new Date();
    date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();
	
	var check1 = [];
	var check2 = [];

    if ((typeof req.body.CUST_COUNTRYCODE == 'undefined') || (typeof req.body.CUST_ID == 'undefined') || (typeof req.body.PARTNER_ID == 'undefined') || (typeof req.body.SELRANGEDT == 'undefined') || (typeof req.body.SELRANGEDT.START == 'undefined') || (typeof req.body.SELRANGEDT.LIMIT == 'undefined')) {

		check1 = ['PARTNER_ID','CUST_COUNTRYCODE','CUST_ID','SELRANGEDT'];
		
		console.log(req.body);
		for(i=0;i < check1.length;i++){
			console.log(req.body[check1[i]]);
			if(typeof req.body[check1[i]] == 'undefined'){				
				check2.push(check1[i]);
			}
			else if(check1[i] == 'SELRANGEDT'){
				if(typeof req.body.SELRANGEDT.START == 'undefined'){				
					check2.push('SELRANGEDT.START');
				}
				else if(typeof req.body.SELRANGEDT.LIMIT == 'undefined'){
					check2.push('SELRANGEDT.LIMIT');
				}
			}
		}
		console.log("Missing Required Field : " + check2);
        res.json({
			"RESP_CDE": 401,
			"RESP_MSG": "Missing Required Field : " + check2 
		});
		
		return;
    } 
	/*else if(isNaN(req.body.SELRANGEDT.START) || isNaN(req.body.SELRANGEDT.LIMIT) || typeof req.body.SELRANGEDT.START == 'string' || typeof req.body.SELRANGEDT.LIMIT == 'string'){
		console.log('Invalid Format');
        res.json({
			"RESP_CDE": 402,
			"RESP_MSG": "Invalid Format"
		});
		return;
	} else if(req.body.PARTNER_ID.toString().length > 5 || req.body.CUST_ID.toString().length > 50 || req.body.CUST_COUNTRYCODE.toString().length > 2 || req.body.SELRANGEDT.LIMIT.toString().length > 4 || req.body.SELRANGEDT.START.toString().length > 4){
		console.log('Max length exceed');
        res.json({
			"RESP_CDE": 402,
			"RESP_MSG": "Invalid Format"
		});
		return;
	}*/
	else{
		check1 = ['PARTNER_ID','CUST_COUNTRYCODE','CUST_ID','SELRANGEDT'];
		var x = length_validate(check1,req); 
		
		if(x.length > 0){
			res.json({
				"RESP_CDE": 402,
				"RESP_MSG": "Invalid Format : " + x
			});
			return;
		}
		else{
			
		}		
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
        var stmt_ = "select * from (select PM200MP.PNID,PM200MP.PNNUM,PM200MP.MBID";
        stmt_ += " from MBRFLIB/PM200MP PM200MP";
        stmt_ += " inner join (select * from MBRFLIB/PM110MP PM110MP inner join MBRFLIB/CM100MP CM100MP on CM100MP.CNTRYCD3 = PM110MP.CNTRYCD3) as PM110CM100 on PM200MP.PNID = PM110CM100.PNID and PM200MP.PNNUM = PM110CM100.PNNUM";
        stmt_ += " where PM200MP.PNID = '" + req.body.PARTNER_ID + "' and PM110CM100.CNTRYCD2='" + cntry + "' AND PM200MP.MBID = (select concat(CM1.CNTRYCD3,'" + req.body.CUST_ID + "') from MBRFLIB/CM100MP CM1 where CM1.CNTRYCD2 = '" + cntry + "') ) as tbl";
    } else {
        var stmt_ = "select * from (select PM200MP.PNID,PM200MP.PNNUM,PM200MP.MBID";
        stmt_ += " from MBRFLIB/PM200MP PM200MP";
        stmt_ += " inner join MBRFLIB/PM110MP PM110MP on PM200MP.PNID = PM110MP.PNID and PM200MP.PNNUM = PM110MP.PNNUM";
        stmt_ += " where PM200MP.PNID = '" + req.body.PARTNER_ID + "' and PM200MP.MBID = '" + req.body.CUST_ID + "') as tbl";
    }

    var count_partner = 0;
    console.log(stmt_);
    pool.query(stmt_)
        .then(function(result) {
            console.log(result.length);
            console.log(result);
			count_partner = result.length;
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

					if (result.length <= 0 && count_partner > 0) {
						//301
						res.json({
							"RESP_SYSCDE": "",
							"RESP_DATETIME": date_str,
							"RESP_CDE": 302,
							"RESP_MSG": "Not success, not found MCard",
							"MCARD_NUM": "",
							"CARD_TYPE": "",
							"CARD_EXPIRY_DATE": 0,
							"CARD_POINT_BALANCE": 0,
							"CARD_POINT_EXPIRY": 0,
							"CARD_POINT_EXP_DATE": 0,
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
						return;
					} else if (result.length == 1) {
						//101 - success
						var MBEXP_ = 0;
						var MBPOINT_ = 0;
						var MBCEXP_ = 0;
						var MBDATT_ = 0;
						if(result[0].MBEXP){
							MBEXP_ = result[0].MBEXP;
						}
						if(result[0].MBPOINT){
							MBPOINT_ = result[0].MBPOINT;
						}
						if(result[0].MBCEXP){
							MBCEXP_ = result[0].MBCEXP;
						}
						if(result[0].MBDATT){
							MBDATT_ = result[0].MBDATT;
						}
						res.json({
							"RESP_SYSCDE": "",
							"RESP_DATETIME": date_str,
							"RESP_CDE": 101,
							"RESP_MSG": "Success",
							"MCARD_NUM": result[0].MBCODE,
							"CARD_TYPE": result[0].MBMEMC,
							"CARD_EXPIRY_DATE": MBEXP_,
							"CARD_POINT_BALANCE": MBPOINT_,
							"CARD_POINT_EXPIRY": MBCEXP_,
							"CARD_POINT_EXP_DATE": MBDATT_,
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
								"CARD_COUNT": result.length
							}
						});
						return;
					} else if (result.length > 0) {
						//102 - more than 1 card
						var MBEXP_ = 0;
						var MBPOINT_ = 0;
						var MBCEXP_ = 0;
						var MBDATT_ = 0;
						if(result[0].MBEXP){
							MBEXP_ = result[0].MBEXP;
						}
						if(result[0].MBPOINT){
							MBPOINT_ = result[0].MBPOINT;
						}
						if(result[0].MBCEXP){
							MBCEXP_ = result[0].MBCEXP;
						}
						if(result[0].MBDATT){
							MBDATT_ = result[0].MBDATT;
						}
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
							"RESP_SYSCDE": "",
							"RESP_DATETIME": date_str,
							"RESP_CDE": 102,
							"RESP_MSG": "Success, found many Mcard",
							"MCARD_NUM": result[0].MBCODE,
							"CARD_TYPE": result[0].MBMEMC,
							"CARD_EXPIRY_DATE": MBEXP_,
							"CARD_POINT_BALANCE": MBPOINT_,
							"CARD_POINT_EXPIRY": MBCEXP_,
							"CARD_POINT_EXP_DATE": MBDATT_,
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
						return;
					} else {
						//301 - no partner card
						res.json({
							"RESP_SYSCDE": "",
							"RESP_DATETIME": date_str,
							"RESP_CDE": 301,
							"RESP_MSG": "Not success/ Not found Partner ID/Partner NBR",
							"MCARD_NUM": "",
							"CARD_TYPE": "",
							"CARD_EXPIRY_DATE": 0,
							"CARD_POINT_BALANCE": 0,
							"CARD_POINT_EXPIRY": 0,
							"CARD_POINT_EXP_DATE": 0,
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
						return;
					}
				})
				.fail(function(error) {
					console.log(error);
					res.status(500);
					res.end();
					return;
				});
		})
		.fail(function(error) {
			console.log(error);
			res.status(500);
			res.end();
			return;
		});
});

app.post('/redeem_mpoint', function(req, res) {
    var today = new Date();
	var check1 = [];
	var check2 = [];
	
	var check_ = [];
	
	var partnerid = '';
	var partnernbr = '';
	var type_ = '';
	
    date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();

    time_str = (today.getHours() < 10 ? '0' : '') + today.getHours() + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes() + (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();
    
    if (typeof req.body.PARTNER_ID == 'undefined') {
		
		check1 = ['PARTNER_ID'];
		check_ = [];
		
		console.log(req.body);
		for(i=0;i < check1.length;i++){
			console.log(req.body[check1[i]]);
			if(typeof req.body[check1[i]] == 'undefined'){
				check_.push(check1[i]);
			}
		}
		
        console.log('Field Error Type');
		
        res.json({
			"RESP_CDE": 401,
			"RESP_MSG": "Missing Required Field : " + check_ 
		});
		return;

    }
	else if (typeof req.body.PARTNER_NBR == 'undefined') {
		
		check1 = ['PARTNER_NBR'];
		check_ = [];
		
		console.log(req.body);
		for(i=0;i < check1.length;i++){
			console.log(req.body[check1[i]]);
			if(typeof req.body[check1[i]] == 'undefined'){
				check_.push(check1[i]);
			}
		}
		
        console.log('Field Error Type');
		
        res.json({
			"RESP_CDE": 401,
			"RESP_MSG": "Missing Required Field : " + check_ 
		});
		return;

    }
	else if (typeof req.body.POINTBURN_TYPE == 'undefined') {
		
		check1 = ['POINTBURN_TYPE'];
		check_ = [];
		
		console.log(req.body);
		for(i=0;i < check1.length;i++){
			console.log(req.body[check1[i]]);
			if(typeof req.body[check1[i]] == 'undefined'){
				check_.push(check1[i]);
			}
		}
		
        console.log('Field Error Type');
		
        res.json({
			"RESP_CDE": 401,
			"RESP_MSG": "Missing Required Field : " + check_ 
		});
		return;

    }
	else if ((typeof req.body.PARTNER_ID == 'undefined') || (typeof req.body.PARTNER_NBR == 'undefined')) {
		
		check1 = ['PARTNER_ID','PARTNER_NBR'];
		check_ = [];
		
		console.log('Field Error Header');
		type_ = req.body.POINTBURN_TYPE.toString();
        /*res.json({
			"RESP_CDE": 401,
			"RESP_MSG": "Missing Required Field : " + check_ 
		});
		return;*/

    } 
	/*else if(req.body.PARTNER_ID.length > 5 || req.body.PARTNER_NBR.length > 50 || req.body.POINTBURN_TYPE.length > 2){
		console.log('Max length exceed');
        res.json({
			"RESP_CDE": 402,
			"RESP_MSG": "Invalid Format"
		});
		return;
	}*/
	
	else{
		check1 = ['PARTNER_ID'];
		check2 = ['PARTNER_NBR'];
		check3 = ['POINTBURN_TYPE'];
		var x = length_validate(check1,req); 
		var y = length_validate(check2,req);
		var z = length_validate(check3,req);
		if(x.length > 0){
			res.json({
				"RESP_CDE": 402,
				"RESP_MSG": "Invalid Format : " + x
			});
			return;
		}
		else if(y.length > 0){
			res.json({
				"RESP_CDE": 402,
				"RESP_MSG": "Invalid Format : " + y
			});
			return;
		}
		else if(z.length > 0){
			res.json({
				"RESP_CDE": 402,
				"RESP_MSG": "Invalid Format : " + z
			});
			return;
		}
		else{
			partnerid = req.body.PARTNER_ID.toString();
			partnernbr = req.body.PARTNER_NBR.toString();
			type_ = req.body.POINTBURN_TYPE.toString();
		}		
	}
	
	/*else {
		partnerid = req.body.PARTNER_ID.toString();
		partnernbr = req.body.PARTNER_NBR.toString();
		type_ = req.body.POINTBURN_TYPE.toString();
	}*/



    var current_point_stmt = "select MVM01P.MBCODE,MVM01P.MBAPP,MVM01P.MBEXP,MVM01P.MBMEMC,MCRS2P.MBPOINC, MCRS2P.MBPOINR, MCRS2P.MBPOINT, MCRS2P.MBCEXP, MCRS2P.MBDATT,PM100MP.MBAGEN";
    current_point_stmt += " from MBRFLIB/MVM01P MVM01P";
    current_point_stmt += " inner join MBRFLIB/PM200MP PM200MP on MVM01P.MBCODE = PM200MP.MBCODE";
    current_point_stmt += " left join MBRFLIB/MCRS2P MCRS2P on MVM01P.MBCODE = MCRS2P.MBCODE";
	current_point_stmt += " inner join MBRFLIB/PM100MP PM100MP on PM100MP.PNID = PM200MP.PNID";
    current_point_stmt += " where PM200MP.PNID = '" + partnerid + "' and PM200MP.PNNUM ='" + partnernbr + "' and PM200MP.PNSTS != 'C'";
    pool.query(current_point_stmt)
        .then(function(current_point_result) {
            console.log(current_point_result);
			console.log(current_point_result.length);
			
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
			
			
            if (type_ == "DP") {
                if ((typeof req.body.POINTBURN_FLAG == 'undefined') ||
                    (typeof req.body.POINTBURN_BRANCH == 'undefined') ||
                    (typeof req.body.POINTBURN_DEPT == 'undefined') ||
                    (typeof req.body.POINTBURN_PROMO_NAME == 'undefined') ||
                    (typeof req.body.POINTBURN_ITEM_CODE == 'undefined') ||
                    (typeof req.body.POINTBURN_PROMO_NUM == 'undefined') ||
                    (typeof req.body.POINTBURN_EDC_SHOP_NAME == 'undefined') ||
                    (typeof req.body.POINTBURN_REFERENCE_NUM == 'undefined') ||
                    (typeof req.body.POINTBURN_APPV_NUM == 'undefined') ||
                    (typeof req.body.POINTBURN_EDC_RATE == 'undefined') ||
                    (typeof req.body.POINTBURN_EDC_SALE_AMOUNT == 'undefined') ||
                    (typeof req.body.POINTBURN_EDC_DISCOUNT_AMT == 'undefined') ||
                    (typeof req.body.POINTBURN_EDC_TERMINAL == 'undefined') ||
                    (typeof req.body.POINTBURN_MPOINT == 'undefined') || (typeof req.body.PARTNER_ID == 'undefined') || (typeof req.body.PARTNER_NBR == 'undefined')) {
					//check1 = [typeof req.body.POINTBURN_FLAG,typeof req.body.POINTBURN_BRANCH,typeof req.body.POINTBURN_DEPT,typeof req.body.POINTBURN_PROMO_NAME,typeof req.body.POINTBURN_ITEM_CODE,typeof req.body.POINTBURN_PROMO_NUM,typeof req.body.POINTBURN_EDC_SHOP_NAME,typeof req.body.POINTBURN_REFERENCE_NUM,typeof req.body.POINTBURN_APPV_NUM,typeof req.body.POINTBURN_EDC_RATE,typeof req.body.POINTBURN_EDC_SALE_AMOUNT ,typeof req.body.POINTBURN_EDC_DISCOUNT_AMT,typeof req.body.POINTBURN_EDC_TERMINAL,typeof req.body.POINTBURN_MPOINT];
					
					check1 = ['PARTNER_ID','PARTNER_NBR','POINTBURN_FLAG','POINTBURN_BRANCH','POINTBURN_DEPT','POINTBURN_PROMO_NAME','POINTBURN_ITEM_CODE','POINTBURN_PROMO_NUM','POINTBURN_EDC_SHOP_NAME','POINTBURN_REFERENCE_NUM','POINTBURN_APPV_NUM','POINTBURN_EDC_RATE','POINTBURN_EDC_SALE_AMOUNT','POINTBURN_EDC_DISCOUNT_AMT','POINTBURN_EDC_TERMINAL','POINTBURN_MPOINT'];
					
					check2 = check_;
					
					console.log(req.body);
					for(i=0;i < check1.length;i++){
						console.log(req.body[check1[i]]);
						if(typeof req.body[check1[i]] == 'undefined'){
							check2.push(check1[i]);
						}
					}
                    console.log('Field Error DP');
					console.log("Missing Required Field : " + check2);
                    res.json({
						"RESP_CDE": 401,
						"RESP_MSG": "Missing Required Field : " + check2 
					});
					return;
                } 
				else{
					check1 = ['PARTNER_ID','PARTNER_NBR','POINTBURN_FLAG','POINTBURN_BRANCH','POINTBURN_DEPT','POINTBURN_PROMO_NAME','POINTBURN_ITEM_CODE','POINTBURN_PROMO_NUM','POINTBURN_EDC_SHOP_NAME','POINTBURN_REFERENCE_NUM','POINTBURN_APPV_NUM','POINTBURN_EDC_RATE','POINTBURN_EDC_SALE_AMOUNT','POINTBURN_EDC_DISCOUNT_AMT','POINTBURN_EDC_TERMINAL','POINTBURN_MPOINT'];
					var x = length_validate(check1,req); 
					
					if(x.length > 0){
						res.json({
							"RESP_CDE": 402,
							"RESP_MSG": "Invalid Format : " + x
						});
						return;
					}
					else{
						POINTBURN_BRANCH_ = parseInt(req.body.POINTBURN_BRANCH);
						POINTBURN_ITEM_CODE_ = req.body.POINTBURN_ITEM_CODE;
						POINTBURN_MPOINT_ = parseInt(req.body.POINTBURN_MPOINT);
						POINTBURN_EDC_DISCOUNT_AMT_ = parseInt(req.body.POINTBURN_EDC_DISCOUNT_AMT);
						POINTBURN_APPV_NUM_ = req.body.POINTBURN_APPV_NUM;
						POINTBURN_EDC_REFERENCE_NUM_ = req.body.POINTBURN_REFERENCE_NUM;
						POINTBURN_EDC_TERMINAL_ = req.body.POINTBURN_EDC_TERMINAL;
						POINTBURN_EDC_SALE_AMOUNT_ = parseInt(req.body.POINTBURN_EDC_SALE_AMOUNT);
						POINTBURN_EDC_RATE = req.body.POINTBURN_EDC_RATE;
					}		
				}

                cal_POINTBURN = parseInt(req.body.POINTBURN_MPOINT);
            } else if (type_ == "MI") {
                if ((typeof req.body.POINTBURN_FLAG == 'undefined') ||
                    (typeof req.body.POINTBURN_BRANCH == 'undefined') ||
                    (typeof req.body.POINTBURN_ITEM_CODE == 'undefined') ||
                    (typeof req.body.POINTBURN_ITEM_NAME == 'undefined') ||
					(typeof req.body.POINTBURN_REFERENCE_NUM == 'undefined') ||
                    (typeof req.body.POINTBURN_MILE == 'undefined') ||
                    (typeof req.body.POINTBURN_AIRLINECODE == 'undefined') ||
                    (typeof req.body.POINTBURN_MPOINT == 'undefined') || (typeof req.body.PARTNER_ID == 'undefined') || (typeof req.body.PARTNER_NBR == 'undefined')) {
						
                    check1 = ['PARTNER_ID','PARTNER_NBR','POINTBURN_FLAG','POINTBURN_BRANCH','POINTBURN_ITEM_CODE','POINTBURN_ITEM_NAME','POINTBURN_REFERENCE_NUM','POINTBURN_MILE','POINTBURN_AIRLINECODE','POINTBURN_MPOINT'];
					
					check2 = check_;
					
					console.log(req.body);
					for(i=0;i < check1.length;i++){
						console.log(req.body[check1[i]]);
						if(typeof req.body[check1[i]] == 'undefined'){
							check2.push(check1[i]);
						}
					}
                    console.log('Field Error MI');
					console.log("Missing Required Field : " + check2);
                    res.json({
						"RESP_CDE": 401,
						"RESP_MSG": "Missing Required Field : " + check2 
					});
					return;
                } 

				else{
					check1 = ['PARTNER_ID','PARTNER_NBR','POINTBURN_FLAG','POINTBURN_BRANCH','POINTBURN_ITEM_CODE','POINTBURN_ITEM_NAME','POINTBURN_REFERENCE_NUM','POINTBURN_MILE','POINTBURN_AIRLINECODE','POINTBURN_MPOINT'];
					var x = length_validate(check1,req); 
					
					if(x.length > 0){
						res.json({
							"RESP_CDE": 402,
							"RESP_MSG": "Invalid Format : " + x
						});
						return;
					}
					else{
						POINTBURN_BRANCH_ = parseInt(req.body.POINTBURN_BRANCH);
						POINTBURN_ITEM_CODE_ = req.body.POINTBURN_ITEM_CODE;
						POINTBURN_MILE_ = parseInt(req.body.POINTBURN_MILE);
						POINTBURN_MPOINT_ = parseInt(req.body.POINTBURN_MPOINT);
					}		
				}

                cal_POINTBURN = parseInt(req.body.POINTBURN_MPOINT) * parseInt(req.body.POINTBURN_MILE);
            } else if (type_ == "CC") {
                if ((typeof req.body.POINTBURN_FLAG == 'undefined') ||
                    (typeof req.body.POINTBURN_BRANCH == 'undefined') ||
                    (typeof req.body.POINTBURN_ITEM_CODE == 'undefined') ||
                    (typeof req.body.POINTBURN_ITEM_NAME == 'undefined') ||
                    (typeof req.body.POINTBURN_PIECE == 'undefined') ||
                    (typeof req.body.POINTBURN_ITEM_AMT == 'undefined') ||
					(typeof req.body.POINTBURN_REFERENCE_NUM == 'undefined') ||
                    (typeof req.body.POINTBURN_MPOINT == 'undefined') || (typeof req.body.PARTNER_ID == 'undefined') || (typeof req.body.PARTNER_NBR == 'undefined')) {
                    	
                    check1 = ['PARTNER_ID','PARTNER_NBR','POINTBURN_FLAG','POINTBURN_BRANCH','POINTBURN_ITEM_CODE','POINTBURN_ITEM_NAME','POINTBURN_PIECE','POINTBURN_ITEM_AMT','POINTBURN_REFERENCE_NUM','POINTBURN_MPOINT'];
					
					check2 = check_;
					
					console.log(req.body);
					for(i=0;i < check1.length;i++){
						console.log(req.body[check1[i]]);
						if(typeof req.body[check1[i]] == 'undefined'){
							check2.push(check1[i]);
						}
					}
                    console.log('Field Error CC');
					console.log("Missing Required Field : " + check2);
                    res.json({
						"RESP_CDE": 401,
						"RESP_MSG": "Missing Required Field : " + check2 
					});
					return;
                } 
				
				else{
                    check1 = ['PARTNER_ID','PARTNER_NBR','POINTBURN_FLAG','POINTBURN_BRANCH','POINTBURN_ITEM_CODE','POINTBURN_ITEM_NAME','POINTBURN_PIECE','POINTBURN_ITEM_AMT','POINTBURN_REFERENCE_NUM','POINTBURN_MPOINT'];
					var x = length_validate(check1,req); 
					
					if(x.length > 0){
						res.json({
							"RESP_CDE": 402,
							"RESP_MSG": "Invalid Format : " + x
						});
						return;
					}
					else{
						POINTBURN_BRANCH_ = parseInt(req.body.POINTBURN_BRANCH);
						POINTBURN_ITEM_CODE_ = req.body.POINTBURN_ITEM_CODE;
						POINTBURN_PIECE_ = parseInt(req.body.POINTBURN_PIECE);
						POINTBURN_MPOINT_ = parseInt(req.body.POINTBURN_MPOINT);
					}		
				}
                cal_POINTBURN = parseInt(req.body.POINTBURN_MPOINT) * parseInt(req.body.POINTBURN_PIECE);
            } else if (type_ == "SP") {
                if ((typeof req.body.POINTBURN_FLAG == 'undefined') ||
                    (typeof req.body.POINTBURN_BRANCH == 'undefined') ||
                    (typeof req.body.POINTBURN_ITEM_CODE == 'undefined') ||
                    (typeof req.body.POINTBURN_ITEM_NAME == 'undefined') ||
                    (typeof req.body.POINTBURN_VENDER == 'undefined') ||
                    (typeof req.body.POINTBURN_ITEM_ADD_AMT == 'undefined') ||
                    (typeof req.body.POINTBURN_PIECE == 'undefined') ||
					(typeof req.body.POINTBURN_REFERENCE_NUM == 'undefined') ||
                    (typeof req.body.POINTBURN_MPOINT == 'undefined') || (typeof req.body.PARTNER_ID == 'undefined') || (typeof req.body.PARTNER_NBR == 'undefined')) {
                    	
                    check1 = ['PARTNER_ID','PARTNER_NBR','POINTBURN_FLAG','POINTBURN_BRANCH','POINTBURN_ITEM_CODE','POINTBURN_ITEM_NAME','POINTBURN_PIECE','POINTBURN_ITEM_ADD_AMT','POINTBURN_VENDER','POINTBURN_REFERENCE_NUM','POINTBURN_MPOINT'];
					
					check2 = check_;
					
					console.log(req.body);
					for(i=0;i < check1.length;i++){
						console.log(req.body[check1[i]]);
						if(typeof req.body[check1[i]] == 'undefined'){
							check2.push(check1[i]);
						}
					}
                    console.log('Field Error SP');
					console.log("Missing Required Field : " + check2);
                    res.json({
						"RESP_CDE": 401,
						"RESP_MSG": "Missing Required Field : " + check2 
					});
					return;
                } 
				
				else{
					check1 = ['PARTNER_ID','PARTNER_NBR','POINTBURN_FLAG','POINTBURN_BRANCH','POINTBURN_ITEM_CODE','POINTBURN_ITEM_NAME','POINTBURN_PIECE','POINTBURN_ITEM_ADD_AMT','POINTBURN_VENDER','POINTBURN_REFERENCE_NUM','POINTBURN_MPOINT'];

					var x = length_validate(check1,req); 
					
					if(x.length > 0){
						res.json({
							"RESP_CDE": 402,
							"RESP_MSG": "Invalid Format : " + x
						});
						return;
					}
					else{
						POINTBURN_BRANCH_ = parseInt(req.body.POINTBURN_BRANCH);
						POINTBURN_ITEM_CODE_ = req.body.POINTBURN_ITEM_CODE;
						POINTBURN_PIECE_ = parseInt(req.body.POINTBURN_PIECE);
						POINTBURN_MPOINT_ = parseInt(req.body.POINTBURN_MPOINT);
					}		
				}
                cal_POINTBURN = parseInt(req.body.POINTBURN_MPOINT) * parseInt(req.body.POINTBURN_PIECE);
            } else if (type_ == "PR") {
                if ((typeof req.body.POINTBURN_FLAG == 'undefined') ||
                    (typeof req.body.POINTBURN_BRANCH == 'undefined') ||
                    (typeof req.body.POINTBURN_ITEM_CODE == 'undefined') ||
                    (typeof req.body.POINTBURN_ITEM_NAME == 'undefined') ||
                    (typeof req.body.POINTBURN_PIECE == 'undefined') ||
                    (typeof req.body.POINTBURN_VENDER == 'undefined') ||
					(typeof req.body.POINTBURN_REFERENCE_NUM == 'undefined') ||
                    (typeof req.body.POINTBURN_MPOINT == 'undefined') || (typeof req.body.PARTNER_ID == 'undefined') || (typeof req.body.PARTNER_NBR == 'undefined')) {
                    	
                    check1 = ['PARTNER_ID','PARTNER_NBR','POINTBURN_FLAG','POINTBURN_BRANCH','POINTBURN_ITEM_CODE','POINTBURN_ITEM_NAME','POINTBURN_PIECE','POINTBURN_VENDER','POINTBURN_REFERENCE_NUM','POINTBURN_MPOINT'];
					
					check2 = check_;
					
					console.log(req.body);
					for(i=0;i < check1.length;i++){
						console.log(req.body[check1[i]]);
						if(typeof req.body[check1[i]] == 'undefined'){
							check2.push(check1[i]);
						}
					}
                    console.log('Field Error PR');
					console.log("Missing Required Field : " + check2);
                    res.json({
						"RESP_CDE": 401,
						"RESP_MSG": "Missing Required Field : " + check2 
					});
					return;
                } 
				
				else{
                    check1 = ['PARTNER_ID','PARTNER_NBR','POINTBURN_FLAG','POINTBURN_BRANCH','POINTBURN_ITEM_CODE','POINTBURN_ITEM_NAME','POINTBURN_PIECE','POINTBURN_VENDER','POINTBURN_REFERENCE_NUM','POINTBURN_MPOINT'];

					var x = length_validate(check1,req); 
					
					if(x.length > 0){
						res.json({
							"RESP_CDE": 402,
							"RESP_MSG": "Invalid Format : " + x
						});
						return;
					}
					else{
						POINTBURN_BRANCH_ = parseInt(req.body.POINTBURN_BRANCH);
						POINTBURN_ITEM_CODE_ = req.body.POINTBURN_ITEM_CODE;
						POINTBURN_PIECE_ = parseInt(req.body.POINTBURN_PIECE);
						POINTBURN_MPOINT_ = parseInt(req.body.POINTBURN_MPOINT);
					}		
				}
                cal_POINTBURN = parseInt(req.body.POINTBURN_MPOINT) * parseInt(req.body.POINTBURN_PIECE);
            } else {
				console.log('Unknown type');
				res.json({
					"RESP_CDE": 402,
					"RESP_MSG": "Invalid Format : POINTBURN_TYPE" 
				});
				return;
				
            }

            // Now, MBPOINT (net point) is sufficient

            if (current_point_result.length <= 0) {
                //302 - no mcard
				console.log('Not found Partner ID/Partner NBR');
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": date_str,
                    "RESP_CDE": 301,
					"RESP_MSG": "Not success/ Not found Partner ID/Partner NBR",
                    "MCARD_NUM": "",
                    "CARD_TYPE": "",
                    "CARD_EXPIRY_DATE": "",
                    "CARD_POINT_BALANCE": "",
                    "CARD_POINT_EXPIRY": "",
                    "CARD_POINT_EXP_DATE": "",
                    "POINTBURN_MPOINT_SUCCESS": "0"
                });
				return;
            } else if (current_point_result.length > 0) {
                //101 - success
				console.log(req.body.POINTBURN_TYPE);
				console.log(current_point_result[0].MBPOINR);
				var cal_MPOINR = parseInt(current_point_result[0].MBPOINR) + cal_POINTBURN;
				console.log(cal_MPOINR);
				console.log(current_point_result[0].MBPOINC);
				var cal_MBPOINT = parseInt(current_point_result[0].MBPOINC) - cal_MPOINR;
				console.log(cal_MPOINR);
				console.log(cal_MBPOINT);
				console.log(current_point_result[0].MBCODE);
				
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
						"RESP_CDE": 201,
						"RESP_MSG": "Insufficient MPoint" 
					});
                    return;
                } else {
                    pool.update(point_master_stmt, point_master_params)
                        .then(function(master_result) {
                            console.log(master_result);
							
							var date_str4 = date_str.substr(2,4);
							var mtyr = req.body.POINTBURN_TYPE;
							var mrec = mtyr+date_str4;
							
							console.log(mrec);
							var mrec_n = '';
							var mrec_c = '';
							var stmt = "select SUBSTR(MBRECN,3,11) as RECN  from MBRFLIB/MCRTA3P where MBMYM='"+ date_str4 +"' and MBBRH='88' and MBTYR='"+ mtyr +"'";

							pool.query(stmt)
								.then(function(result) {
									//console.log(result[0].HLDNAM);
									console.log(result);
									if(result.length > 0){										
										mrec_n = mtyr + (parseInt(result[0].RECN)+1).toString();
										
										var update_stmt = "update MBRFLIB/MCRTA3P ";
										update_stmt += " set MBRECN=?";
										update_stmt += " where MBMYM='"+ date_str4 +"' and MBBRH='88' and MBTYR='"+ mtyr +"'";
										var update_params = [mrec_n];
										//MCRR2P - not implemented yet
										//point_log2_stmt = "";
										console.log("UPDATE");
										pool.update(update_stmt, update_params)
											.then(function(update_result) {
												console.log(update_result);
												//console.log(result[0].HLDNAM);
											})
											.fail(function(error) {
												console.log("ERROR LOG");
												console.log(log_error);
												res.status(500);
												return;
											});										
									}
									else{
										mrec_n = mrec + '0000001';
										var point_log_stmt_3p = "insert into MBRFLIB/MCRTA3P";
										point_log_stmt_3p += "(MBMYM,MBBRH,MBTYR,MBRECN)";
										point_log_stmt_3p += " values(?,?,?,?)";
										var point_log_params_3p = [
											parseInt(date_str4),
											88,
											mtyr,
											mrec_n
										];
										console.log(parseInt(date_str4));
										pool.insertAndGetId(point_log_stmt_3p, point_log_params_3p)
											.then(function(log_result) {
												console.log(log_result);
												})
											.fail(function(log_error) {
												console.log("ERROR LOG");
												console.log(log_error);
												res.status(500);
												return;
											});
									}
									
									
									if(req.body.POINTBURN_TYPE == 'DP'){
										var point_log_params_1p = [
										parseInt(current_point_result[0].MBAPP), //MBAPP
										current_point_result[0].MBCODE, //MBCODE
										parseInt(req.body.POINTBURN_BRANCH), //POINTBURN_BRANCH --> MBBRH
										parseInt(date_str), //MBDAT
										req.body.POINTBURN_ITEM_CODE, //POINTBURN_ITEM_CODE --> MBRDC
										req.body.POINTBURN_TYPE, //POINTBUTN_TYPE --> MBTYR
										mrec_n, //MBRECN
										1, //MBRUN
										0, // MBPOINT
										0, //MBPIE
										parseInt(time_str),  //MBHOR														
										'R', //POINTBURN_FLAG --> MBFLG							
										0, //POINTBURN_MILE --> MBMILE
										'',  //MBROP
										'',  //PDNAME
										'',  //VDCODE
										0,  //MBAMT
										parseInt(req.body.POINTBURN_MPOINT),  //MBPOIND
										parseInt(req.body.POINTBURN_EDC_DISCOUNT_AMT), //MBAMTDP
										req.body.POINTBURN_APPV_NUM, //MBAPVO
										req.body.POINTBURN_REFERENCE_NUM, //MBREFT
										req.body.POINTBURN_EDC_TERMINAL, //TERMINAL3
										req.body.POINTBURN_DEPT, //MBDEPE
										req.body.POINTBURN_PROMO_NUM, //MBPROC
										req.body.POINTBURN_PROMO_NAME, //MBPRON
										parseInt(req.body.POINTBURN_EDC_SALE_AMOUNT), //MBSAMT
										parseInt(req.body.POINTBURN_EDC_DISCOUNT_AMT), //MBUAMT			
										req.body.POINTBURN_EDC_RATE, //MBRATE,
										current_point_result[0].MBAGEN,//MBAGEN
										req.body.PARTNER_NBR, //PNNUM
										req.body.PARTNER_ID //PNID
										];
									}
									else if(req.body.POINTBURN_TYPE == 'MI'){
										var point_log_params_1p = [
										parseInt(current_point_result[0].MBAPP), //MBAPP
										current_point_result[0].MBCODE, //MBCODE
										parseInt(req.body.POINTBURN_BRANCH), //POINTBURN_BRANCH --> MBBRH
										parseInt(date_str), //MBDAT
										req.body.POINTBURN_ITEM_CODE, //POINTBURN_ITEM_CODE --> MBRDC
										req.body.POINTBURN_TYPE, //POINTBUTN_TYPE --> MBTYR
										mrec_n, //MBRECN
										1, //MBRUN
										parseInt(req.body.POINTBURN_MPOINT), // MBPOINT
										0, //MBPIE
										parseInt(time_str),  //MBHOR														
										'R', //POINTBURN_FLAG --> MBFLG							
										parseInt(req.body.POINTBURN_MILE), //POINTBURN_MILE --> MBMILE
										req.body.POINTBURN_AIRLINECODE,  //MBROP
										'',  //PDNAME
										'',  //VDCODE
										0,  //MBAMT
										0,  //MBPOIND
										0, //MBAMTDP
										'', //MBAPVO
										req.body.POINTBURN_REFERENCE_NUM, //MBREFT
										'', //TERMINAL3
										'', //MBDEPE
										'', //MBPROC
										'', //MBPRON
										0, //MBSAMT
										0, //MBUAMT			
										'', //MBRATE,
										current_point_result[0].MBAGEN,//MBAGEN
										req.body.PARTNER_NBR, //PNNUM
										req.body.PARTNER_ID //PNID
										];
									}
									else if(req.body.POINTBURN_TYPE == 'PR'){
										var point_log_params_1p = [
										parseInt(current_point_result[0].MBAPP), //MBAPP
										current_point_result[0].MBCODE, //MBCODE
										parseInt(req.body.POINTBURN_BRANCH), //POINTBURN_BRANCH --> MBBRH
										parseInt(date_str), //MBDAT
										req.body.POINTBURN_ITEM_CODE, //POINTBURN_ITEM_CODE --> MBRDC
										req.body.POINTBURN_TYPE, //POINTBUTN_TYPE --> MBTYR
										mrec_n, //MBRECN
										1, //MBRUN
										parseInt(req.body.POINTBURN_MPOINT), // MBPOINT
										parseInt(req.body.POINTBURN_PIECE), //POINTBURN_PIECE --> MBPIE
										parseInt(time_str),  //MBHOR														
										'R', //POINTBURN_FLAG --> MBFLG							
										0, //POINTBURN_MILE --> MBMILE
										'',  //MBROP
										req.body.POINTBURN_ITEM_NAME,  //PDNAME
										req.body.POINTBURN_VENDER,  //VDCODE
										0,  //MBAMT
										0,  //MBPOIND
										0, //MBAMTDP
										'', //MBAPVO
										req.body.POINTBURN_REFERENCE_NUM, //MBREFT
										'', //TERMINAL3
										'', //MBDEPE
										'', //MBPROC
										'', //MBPRON
										0, //MBSAMT
										0, //MBUAMT			
										'', //MBRATE,
										current_point_result[0].MBAGEN,//MBAGEN
										req.body.PARTNER_NBR, //PNNUM
										req.body.PARTNER_ID //PNID
										];
									}
									else if(req.body.POINTBURN_TYPE == 'SP'){
										var point_log_params_1p = [
										parseInt(current_point_result[0].MBAPP), //MBAPP
										current_point_result[0].MBCODE, //MBCODE
										parseInt(req.body.POINTBURN_BRANCH), //POINTBURN_BRANCH --> MBBRH
										parseInt(date_str), //MBDAT
										req.body.POINTBURN_ITEM_CODE, //POINTBURN_ITEM_CODE --> MBRDC
										req.body.POINTBURN_TYPE, //POINTBUTN_TYPE --> MBTYR
										mrec_n, //MBRECN
										1, //MBRUN
										parseInt(req.body.POINTBURN_MPOINT), // MBPOINT
										parseInt(req.body.POINTBURN_PIECE), //POINTBURN_PIECE --> MBPIE
										parseInt(time_str),  //MBHOR														
										'R', //POINTBURN_FLAG --> MBFLG							
										0, //POINTBURN_MILE --> MBMILE
										'',  //MBROP
										req.body.POINTBURN_ITEM_NAME,  //PDNAME
										req.body.POINTBURN_VENDER,  //VDCODE
										parseInt(req.body.POINTBURN_ITEM_ADD_AMT),  //MBAMT
										0,  //MBPOIND
										0, //MBAMTDP
										'', //MBAPVO
										req.body.POINTBURN_REFERENCE_NUM, //MBREFT
										'', //TERMINAL3
										'', //MBDEPE
										'', //MBPROC
										'', //MBPRON
										0, //MBSAMT
										0, //MBUAMT			
										'', //MBRATE,
										current_point_result[0].MBAGEN,//MBAGEN
										req.body.PARTNER_NBR, //PNNUM
										req.body.PARTNER_ID //PNID
										];
									}
									else if(req.body.POINTBURN_TYPE == 'CC'){
										var point_log_params_1p = [
										parseInt(current_point_result[0].MBAPP), //MBAPP
										current_point_result[0].MBCODE, //MBCODE
										parseInt(req.body.POINTBURN_BRANCH), //POINTBURN_BRANCH --> MBBRH
										parseInt(date_str), //MBDAT
										req.body.POINTBURN_ITEM_CODE, //POINTBURN_ITEM_CODE --> MBRDC
										req.body.POINTBURN_TYPE, //POINTBUTN_TYPE --> MBTYR
										mrec_n, //MBRECN
										1, //MBRUN
										parseInt(req.body.POINTBURN_MPOINT), // MBPOINT
										parseInt(req.body.POINTBURN_PIECE), //POINTBURN_PIECE --> MBPIE
										parseInt(time_str),  //MBHOR														
										'R', //POINTBURN_FLAG --> MBFLG							
										0, //POINTBURN_MILE --> MBMILE
										'',  //MBROP
										'',  //PDNAME
										'',  //VDCODE
										parseInt(req.body.POINTBURN_ITEM_AMT),  //MBAMT
										0,  //MBPOIND
										0, //MBAMTDP
										'', //MBAPVO
										req.body.POINTBURN_REFERENCE_NUM, //MBREFT
										'', //TERMINAL3
										'', //MBDEPE
										'', //MBPROC
										'', //MBPRON
										0, //MBSAMT
										0, //MBUAMT			
										'', //MBRATE,
										current_point_result[0].MBAGEN,//MBAGEN
										req.body.PARTNER_NBR, //PNNUM
										req.body.PARTNER_ID //PNID
										];
									}
									else{
										res.status(500);
										res.end();
										return;
									}
                                    
									var point_log_stmt_1p = "insert into MBRFLIB/MCRR1P";
									point_log_stmt_1p += "(MBAPP,MBCODE,MBBRH,MBDAT,MBRDC,MBTYR,MBRECN,MBRUN,MBPOINT,MBPIE,MBHOR,MBFLG,MBMILE,MBROP,PDNAME,VDCODE,MBAMT,MBPOIND,MBAMTDP,MBAPVO,MBREFT,TERMINAL3,MBDEPE,MBPROC,MBPRON,MBSAMT,MBUAMT,MBRATE,MBAGEN,PNNUM,PNID)";
									point_log_stmt_1p += " values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";												
									pool.insertAndGetId(point_log_stmt_1p, point_log_params_1p)
									.then(function(log_result) {
										console.log(log_result);
										var stmt = "select * from MBRFLIB/MCRR2P where MBDAT='"+ date_str +"' and MBCODE='"+ current_point_result[0].MBCODE +"'";
										pool.query(stmt)
											.then(function(result) {
												//console.log(result[0].HLDNAM);
												console.log(result);
												if(result.length > 0){
													console.log(result);
													res.json({
														"RESP_SYSCDE": "",
														"RESP_DATETIME": date_str,
														"RESP_CDE": 101,
														"RESP_MSG": "Success",
														"MCARD_NUM": current_point_result[0].MBCODE,
														"CARD_TYPE": current_point_result[0].MBMEMC,
														"CARD_EXPIRY_DATE": current_point_result[0].MBEXP,
														"CARD_POINT_BALANCE": cal_MBPOINT.toString(),
														"CARD_POINT_EXPIRY": current_point_result[0].MBCEXP,
														"CARD_POINT_EXP_DATE": current_point_result[0].MBDATT,
														"POINTBURN_MPOINT_SUCCESS": cal_POINTBURN
													});
												}
												else{
													var point_log_stmt_2p = "insert into MBRFLIB/MCRR2P";
													point_log_stmt_2p += "(MBDAT,MBCODE,MBFLG)";
													point_log_stmt_2p += " values(?,?,?)";
													var point_log_params_2p = [
														parseInt(date_str),
														current_point_result[0].MBCODE,
														''
													];												
													pool.insertAndGetId(point_log_stmt_2p, point_log_params_2p)
														.then(function(log_result) {
															console.log(log_result);
															res.json({
																"RESP_SYSCDE": "",
																"RESP_DATETIME": date_str,
																"RESP_CDE": 101,
																"RESP_MSG": "Success",
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
															console.log("ERROR LOG");
															console.log(log_error);
															res.status(500);
															return;
														});
												}
												
												
											})
											.fail(function(error) {
												console.log(error);
												res.status(500);
												res.end();
												return;
											});
										
									})
									.fail(function(log_error) {
										console.log("ERROR LOG");
										console.log(log_error);
										res.status(500);
										return;
									});
									

								})
								.fail(function(error) {
									console.log("ERROR LOG");
										console.log(log_error);
										res.status(500);
										return;
								});

                            
                        })
                        .fail(function(master_error) {
							console.log(master_error);
							console.log("ERROR UPDATE");
                            res.status(500);
							return;
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


            } else {
                //301 - no partner card
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": date_str,
                    "RESP_CDE": 301,
					"RESP_MSG": "Not success/ Not found Partner ID/Partner NBR",
                    "MCARD_NUM": "",
                    "CARD_TYPE": "",
                    "CARD_EXPIRY_DATE": "",
                    "CARD_POINT_BALANCE": "",
                    "CARD_POINT_EXPIRY": "",
                    "CARD_POINT_EXP_DATE": "",
                    "POINTBURN_MPOINT_SUCCESS": "0"
                });
				return;
            }
        })
        .fail(function(error) {
			console.log(error);
            res.status(500);
			return;
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
			"RESP_MSG": "Missing Required Field : " + check2 
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
						return;
					} else if (result.length >= 1) {
						//Success
						if(isNaN(result[0].MBID)){
							res.json({
								"fnme": result[0].MBENAM,
								"lnme": result[0].MBESUR,
								"lgnme": "EN",
								"mobile": result[0].MBPTEL
							});
							return;
						}
						else{
							res.json({
								"fnme": result[0].MBTNAM,
								"lnme": result[0].MBTSUR,
								"lgnme": "TH",
								"mobile": result[0].MBPTEL
							});
							return;
						}						
					}
				})
				.fail(function(error) {
					res.status(500);
					res.json({
						"message": error
					});
					return;
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
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": "",
                    "RESP_CDE": 301,
					"RESP_MSG": "Not success/ Not found Partner ID/Partner NBR",
                    "MCARD_NUM": "",
                    "CARD_TYPE": "",
                    "CARD_EXPIRY_DATE": "",
                });
				return;
            } else if (result.length == 1) {
                //101 - success
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": "",
                    "RESP_CDE": 101,
					"RESP_MSG": "Success",
                    "MCARD_NUM": result[0].MBCODE,
                    "CARD_TYPE": result[0].MBMEMC,
                    "CARD_EXPIRY_DATE": result[0].MBEXP,
                });
				return;
            } else if (result.length > 1) {
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": "",
                    "RESP_CDE": 102,
					"RESP_MSG": "Success, found many Mcard",
                    "MCARD_NUM": result[0].MBCODE,
                    "CARD_TYPE": result[0].MBMEMC,
                    "CARD_EXPIRY_DATE": result[0].MBEXP,
                });
				return;
            }
        })
        .fail(function(error) {
			console.log(error);
            res.status(500);
            res.json({
                "RESP_MSG": "Internal error"
            });
			return;
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
				date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();
				pool.query(stmt)
					.then(function(result) {
						//console.log(result[0].HLDNAM);
						console.log(result.length);
						//console.log(result);						
						res.json({
							"RESP_SYSCDE": "",
							"RESP_DATETIME": "",
							"RESP_CDE": 101,
							"RESP_MSG": "Success",
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
				date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();
				pool.query(stmt)
					.then(function(result) {
						//console.log(result[0].HLDNAM);
						console.log(result.length);
						//console.log(result);						
						res.json({
							"RESP_SYSCDE": "",
							"RESP_DATETIME": "",
							"RESP_CDE": 102,
							"RESP_MSG": "Success, found many Mcard",
							"MCARD_NUM": result[0].MBCODE,
							"CARD_TYPE": result[0].MBMEMC,
							"CARD_EXPIRY_DATE": result[0].MBEXP,
						});
						return;
					})
					.fail(function(error) {
						console.log(error);
						return;
					});
            } else { // no updated records
				console.log("no updated records");
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": "",
                    "RESP_CDE": 303,
					"RESP_MSG": "",
                    "MCARD_NUM": "",
                    "CARD_TYPE": "",
                    "CARD_EXPIRY_DATE": "",
                });
				return;
                // left over - 301, 302
            }
        })
        .fail(function(error) {
            res.status(500);
			return;
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
				date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();
				pool.query(stmt)
					.then(function(result) {
						//console.log(result[0].HLDNAM);
						console.log(result.length);
						//console.log(result);						
						res.json({
						"RESP_SYSCDE": "",
						"RESP_DATETIME": "",
						"RESP_CDE": 101,
						"RESP_MSG": "Success",
						"MCARD_NUM": result[0].MBCODE,
						"CARD_TYPE": result[0].MBMEMC,
						"CARD_EXPIRY_DATE": result[0].MBEXP,
						});
						return;
					})
					.fail(function(error) {
						console.log(error);
						return;
					});                
            } else if (master_result >= 1) {
				console.log("multiple records");
                var stmt = "select * from MBRFLIB/PM200MP where PM200MP.PNID = '" + req.body.PARTNER_ID + "' and PM200MP.MBID = '" + req.body.CUST_ID + "'";
				var today = new Date();
				var date_str = '';
				date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();
				pool.query(stmt)
					.then(function(result) {
						//console.log(result[0].HLDNAM);
						console.log(result.length);
						//console.log(result);						
						res.json({
						"RESP_SYSCDE": "",
						"RESP_DATETIME": "",
						"RESP_CDE": 102,
						"RESP_MSG": "Success, found many Mcard",
						"MCARD_NUM": result[0].MBCODE,
						"CARD_TYPE": result[0].MBMEMC,
						"CARD_EXPIRY_DATE": result[0].MBEXP,
						});
						return;
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
				return;
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
    current_point_stmt += " left join MBRFLIB/MCRS2P MCRS2P on MVM01P.MBCODE = MCRS2P.MBCODE";
    current_point_stmt += " where PM200MP.PNID = '" + req.body.PARTNER_ID + "' and PM200MP.PNNUM ='" + req.body.PARTNER_NBR + "'";
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
				return;
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
									"RESP_MSG": "Success",
                                    "MCARD_NUM": current_point_result[0].MBCODE,
                                    "CARD_TYPE": current_point_result[0].MBMEMC,
                                    "CARD_EXPIRY_DATE": current_point_result[0].MBEXP,
                                    "CARD_POINT_BALANCE": cal_MBPOINT.toString(),
                                    "CARD_POINT_EXPIRY": current_point_result[0].MBCEXP,
                                    "CARD_POINT_EXP_DATE": current_point_result[0].MBDATT,
                                    "POINTBURN_MPOINT_SUCCESS": req.body.POINTBURN_MPOINT
                                });
								return;
                            })
                            .fail(function(log_error) {
                                res.status(500);
                                res.end();
								return;
                            });
                    })
                    .fail(function(master_error) {
                        res.status(500);
                        res.end();
						return;
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
									"RESP_MSG": "Success, found many Mcard",
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
                                res.end();
								return;
                            });
                    })
                    .fail(function(master_error) {
                        res.status(500);
                        res.end();
						return;
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
            res.end();
			return;
        });

});

// Cobrand - registerMCard
app.post('/register_mcard', function(req, res) {
	var mb = '';
	var date_str = '';
    var today = new Date();
    date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();
	var datetime = new Date();
    datetime = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate() + (today.getHours() < 10 ? '0' : '') + today.getHours() + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes() + (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();
		
	
	/**************************** Check Required Field *********************************/
	
	if((typeof req.body.PARTNER_ID == 'undefined') || (typeof req.body.PARTNER_PROD == 'undefined') || (typeof req.body.PARTNER_NBR == 'undefined') || (typeof req.body.PARTNER_DETAILS == 'undefined') || (typeof req.body.CUST_ID == 'undefined') || (typeof req.body.DEMO_NTNL == 'undefined') || (typeof req.body.DEMO_GENDER == 'undefined') || (typeof req.body.DEMO_MRTLSTS == 'undefined') || (typeof req.body.DEMO_HAVE_KIDS == 'undefined') || (typeof req.body.DEMO_OCCUP == 'undefined') || (typeof req.body.ADD_HOUSE_NUM == 'undefined') || (typeof req.body.ADD_ROAD == 'undefined') || (typeof req.body.ADD_SUB_DISTRICT == 'undefined') || (typeof req.body.ADD_DISTRICT == 'undefined') || (typeof req.body.ADD_PROVINCE == 'undefined') || (typeof req.body.ADD_POSTAL_CODE == 'undefined') || (typeof req.body.CONTACT_MOBILE == 'undefined') || (typeof req.body.CONTACT_EMAIL == 'undefined')){
		console.log("Missing Required Field Register");
        res.json({
			"RESP_CDE": 401,
			"RESP_MSG": "Missing Required Field" 
		});		
		return;
	}
	
	/**************************** END Check Required Field *********************************/
	
	
	/**************************** Check Number Type *********************************/
	
	if(isNaN(req.body.DEMO_HAVE_KIDS) || isNaN(req.body.ADD_POSTAL_CODE) || (typeof req.body.DEMO_HAVE_KIDS == 'string') || (typeof req.body.ADD_POSTAL_CODE == 'string')){
			res.json({
				"RESP_CDE": 401,
				"RESP_MSG": "Missing Required Field" 
			});		
			return;
		}
	
	
	/**************************** END Check Number Type *********************************/
	
	/**************************** Check Optional Field *********************************/
	
	var village = '';
	var floor = '';
	var soi = '';
	var contacthome ='';
	
	
	/**************************** END Check Optional Field *********************************/
	
	/**************************** Check Cust ID *********************************/
	var citizen = '';
	var passport = '';
	
	if(req.body.DEMO_NTNL == 'TH'){
		if((typeof req.body.DEMO_TH_TITLE == 'undefined') || (typeof req.body.DEMO_TH_NAME == 'undefined') || (typeof req.body.DEMO_TH_SURNAME == 'undefined') || (typeof req.body.DEMO_EN_TITLE == 'undefined') || (typeof req.body.DEMO_EN_NAME == 'undefined') || (typeof req.body.DEMO_EN_SURNAME == 'undefined')){
			console.log("Missing Required Field Register");
			res.json({
				"RESP_CDE": 401,
				"RESP_MSG": "Missing Required Field" 
			});		
			return;
		}
		else if(checkID(req.body.CUST_ID)){
			citizen = req.body.CUST_ID;
		}
		else{
			res.json({
				"RESP_CDE": 402,
				"RESP_MSG": "Invalid format" 
			});
			return;
		}
	}
	else{
		if((typeof req.body.DEMO_EN_TITLE == 'undefined') || (typeof req.body.DEMO_EN_NAME == 'undefined') || (typeof req.body.DEMO_EN_SURNAME == 'undefined')){
			console.log("Missing Required Field Register");
			res.json({
				"RESP_CDE": 401,
				"RESP_MSG": "Missing Required Field" 
			});		
			return;
		}
		passport = req.body.CUST_ID;
	}
	/**************************** END Check Cust ID *********************************/
	console.log('AGE');
	console.log(parseInt(today.getFullYear().toString()));
	console.log(parseInt(req.body.DEMO_DOB.toString().substr(0, 4)));
	var age = parseInt(today.getFullYear().toString()) - parseInt(req.body.DEMO_DOB.toString().substr(0, 4));
	console.log(age);
	
	if(age < 0){
		res.json({
			"RESP_CDE": 402,
			"RESP_MSG": "Invalid format" 
		});
		return;
	}
	

	var stmt = "select * from MBRFLIB/MCRTA7P MCRTA7P where MCRTA7P.MBID='" + req.body.CUST_ID + "'"; //Check Citizen/Passport Existing
	console.log(stmt);
    pool.query(stmt)
        .then(function(result) {
            //console.log(result[0].HLDNAM);
			console.log('Checking CUST ID');
            console.log(result.length);
			console.log(result);
			if(result.length > 0){
				console.log('Citizen/Passport Existed');
				res.json({
					"RESP_CDE": 422,
					"RESP_MSG": "Citizen/Passport Existed" 
				});
				return;
			}
			else{
				console.log('Citizen/Passport not Existed');
				var stmt = "select max(tbl.RUNNING) as RUN from (select substr(MVM01P.MBCODE,1,6) as MTYPE,MVM01P.MBCODE,substr(MVM01P.MBCODE,8,6) as RUNNING from MBRFLIB/MVM01P MVM01P where substr(MVM01P.MBCODE,1,6) = '710570') as tbl";
				console.log(stmt);

				pool.query(stmt)
					.then(function(stmt_result) {
						console.log(stmt_result);		
						console.log(stmt_result.length);
						 if (stmt_result.length <= 0) {
							mb = '710570000000102';
							console.log(mb);                
						} else {
							//mb = parseInt(stmt_result[0].RUNNING) + 1;
							var s = (parseInt(stmt_result[0].RUN) + 1)+"";
							while (s.length < 6) s = "0" + s;
							mb = '7105700'+ s + '02';
							console.log(mb);				
						}		
						
						var a = 0;
						var b = 0;
						b = parseInt(mb.substr(1,1)) + parseInt(mb.substr(3,1)) + parseInt(mb.substr(5,1)) + parseInt(mb.substr(7,1)) + parseInt(mb.substr(9,1)) + parseInt(mb.substr(11,1)) + parseInt(mb.substr(13,1)) ;
						//console.log(b);
						for (i=0; i < 15; i++){
							//console.log('i = ' +i);
							a = parseInt(mb.substr(i,1)) * 2;
							if(a > 10){
								a = parseInt(a.toString().substr(0, 1)) + parseInt(a.toString().substr(1, 1));
								//console.log(a);
							}
							b = b + a ;
							//console.log(b);
							i++;
						}
						var c = 0;
						c = 10 - (b%10);
						if(c == 10){
							c = 0;
						}
						console.log(c);
						mb = mb + c.toString();
						console.log(mb);
						var insert_mcard = "insert into MBRFLIB/MVM01P";
						insert_mcard += " (MBAPP,MBCODE,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBPUR,MBEXP,MBID,MBBIRH,MBAGE,MBPASS,MBNAT,MBHSTS,MBSEX,MBCHIL,MBJOB,MBSINC,MBHNO,MBHVIL,MBFLR,MBHSOI,MBHRD,MBHPFT,MBHBOR,MBHPRV,MBHPOS,MBHTEL,MBPTEL,MBMEMC,MBDAT,MBEMAIL,MBBRH,MBAGEN)";
						//insert_mcard += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
						insert_mcard += " values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
						//insert_mcard += " values(?,?,?,?,?,?,?,?,?,?)";
							
						var insert_mcard_params = [
							02  //MBAPP
							,mb  //MBCODE                    
							,req.body.DEMO_TH_TITLE  //MBTTLE
							,req.body.DEMO_TH_NAME  //MBTNAM
							,req.body.DEMO_TH_SURNAME  //MBTSUR
							,req.body.DEMO_EN_TITLE  //MBETLE
							,req.body.DEMO_EN_NAME  //MBENAM
							,req.body.DEMO_EN_SURNAME  //MBESUR
							,11 //MBPUR
							,999912  //MBEXP
							,citizen  //MBID
							,req.body.DEMO_DOB  //MBBIRH
							,age //MBAGE
							,passport //MBPASS
							,req.body.DEMO_NTNL  //MBNAT					
							,req.body.DEMO_MRTLSTS  //MBHSTS
							,req.body.DEMO_GENDER  //MBSEX
							,req.body.DEMO_HAVE_KIDS  //MBCHIL
							,req.body.DEMO_OCCUP  //MBJOB
							,parseInt(today.getFullYear().toString()) //MBSINC
							,req.body.ADD_HOUSE_NUM  //MBHNO
							,village  //MBHVIL
							,floor  //MBFLR
							,soi  //MBHSOI
							,req.body.ADD_ROAD  //MBHRD
							,req.body.ADD_SUB_DISTRICT  //MBHPFT
							,req.body.ADD_DISTRICT  //MBHBOR
							,req.body.ADD_PROVINCE  //MBHPRV
							,req.body.ADD_POSTAL_CODE  //MBHPOS
							,contacthome  //MBHTEL
							,req.body.CONTACT_MOBILE  //MBPTEL	
							,'MC' //MBMEMC
							,parseInt(date_str)  //MBDAT
							,req.body.CONTACT_EMAIL  //MBEMAIL
							,02 //MBBRH
							,'SCB' //MBAGEN
					   ];

					   //MCRR2P - not implemented yet
					   //point_log2_stmt = "";
					   console.log('insert_mcard_stmt');
					   console.log(insert_mcard);
					   console.log('insert_mcard_params');
					   console.log(insert_mcard_params);

					   pool.insertAndGetId(insert_mcard, insert_mcard_params)
						.then(function(log_result) {
							console.log(log_result);
							var insert_mcard = "insert into MBRFLIB/MVM02P";
							insert_mcard += " (MBAPP,MBCODE,MBCRE9)";
							//insert_mcard += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
							insert_mcard += " values(?,?,?)";
							//insert_mcard += " values(?,?,?,?,?,?,?,?,?,?)";
								
							var insert_mcard_params = [
								02  //MBAPP
								,mb  //MBCODE                    
								,1  //MBCRE9				
						   ];

						   //MCRR2P - not implemented yet
						   //point_log2_stmt = "";
						   console.log('insert_mcard_stmt');
						   console.log(insert_mcard);
						   console.log('insert_mcard_params');
						   console.log(insert_mcard_params);

						   pool.insertAndGetId(insert_mcard, insert_mcard_params)
							.then(function(log_result) {
								console.log(log_result);
								var insert_mcard = "insert into MBRFLIB/PM200MP";
								insert_mcard += " (PNID,PNNUM,MBID,MBCODE,DATETIME)";
								//insert_mcard += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
								insert_mcard += " values(?,?,?,?,?)";
								//insert_mcard += " values(?,?,?,?,?,?,?,?,?,?)";
									
								var insert_mcard_params = [
									req.body.PARTNER_ID  //PNID
									,req.body.PARTNER_NBR  //PNNUM
									,req.body.CUST_ID  //MBID
									,mb  //MBCODE 
									,parseInt(datetime) //DATETIME
							   ];

							   //MCRR2P - not implemented yet
							   //point_log2_stmt = "";
							   console.log(parseInt(datetime));
							   console.log('insert_mcard_stmt');
							   console.log(insert_mcard);
							   console.log('insert_mcard_params');
							   console.log(insert_mcard_params);

							   pool.insertAndGetId(insert_mcard, insert_mcard_params)
								.then(function(log_result) {
									console.log(log_result);
									var insert_mcard = "insert into MBRFLIB/PM110MP";
									insert_mcard += " (PNID,PNPROD,PNNUM,PNDETAIL,MBID,TH_TITLE,TH_NAME,TH_SURNAM,EN_TITLE,EN_NAME,EN_SURNAM,MBBIRH,DE_NTNL,MBHSTS,MBSEX,MBCHIL,MBJOB,ADD_HOUSE,ADD_VILLA,MBFLR,ADD_SOI,ADD_ROAD,AD_SUBDIS,ADD_DISTR,ADD_PROVI,ADD_POST,CT_HOME,CT_MOBILE,MBMEMC,MBDAT,CT_EMAIL,MBBRH)";
									//insert_mcard += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
									insert_mcard += " values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
									//insert_mcard += " values(?,?,?,?,?,?,?,?,?,?)";
										
									var insert_mcard_params = [
										req.body.PARTNER_ID  //PNID
										,req.body.PARTNER_PROD  //PNPROD
										,req.body.PARTNER_NBR  //PNNUM
										,req.body.PARTNER_DETAILS //PNDETAIL
										,req.body.CUST_ID  //MBID
										//,02  //MBAPP
										//,mb  //MBCODE                    
										,req.body.DEMO_TH_TITLE  //TH_TITLE
										,req.body.DEMO_TH_NAME  //TH_NAME
										,req.body.DEMO_TH_SURNAME  //TH_SURNAM
										,req.body.DEMO_EN_TITLE  //EN_TITLE
										,req.body.DEMO_EN_NAME  //EN_NAME
										,req.body.DEMO_EN_SURNAME  //EN_SURNAM
										//,11 //MBPUR
										//,999912  //MBEXP				
										,req.body.DEMO_DOB  //MBBIRH
										//,parseInt(today.getFullYear().toString()) - parseInt(req.body.DEMO_DOB.substr(0, 4)) //MBAGE
										,req.body.DEMO_NTNL  //DE_NTNL					
										,req.body.DEMO_MRTLSTS  //MBHSTS
										,req.body.DEMO_GENDER  //MBSEX
										,req.body.DEMO_HAVE_KIDS  //MBCHIL
										,req.body.DEMO_OCCUP  //MBJOB
										//,parseInt(today.getFullYear().toString()) //MBSINC
										,req.body.ADD_HOUSE_NUM  //ADD_HOUSE
										,village  //ADD_VILLA
										,floor  //MBFLR
										,soi  //ADD_SOI
										,req.body.ADD_ROAD  //ADD_ROAD
										,req.body.ADD_SUB_DISTRICT  //AD_SUBDIS
										,req.body.ADD_DISTRICT  //ADD_DISTR
										,req.body.ADD_PROVINCE  //ADD_PROVI
										,req.body.ADD_POSTAL_CODE  //ADD_POST
										,contacthome  //CT_HOME
										,req.body.CONTACT_MOBILE  //CT_MOBILE	
										,'MC' //MBMEMC
										,parseInt(date_str)  //MBDAT
										,req.body.CONTACT_EMAIL  //CT_EMAIL
										,02 //MBBRH				
								   ];

								   //MCRR2P - not implemented yet
								   //point_log2_stmt = "";
								   console.log('insert_mcard_stmt');
								   console.log(insert_mcard);
								   console.log('insert_mcard_params');
								   console.log(insert_mcard_params);

								   pool.insertAndGetId(insert_mcard, insert_mcard_params)
									.then(function(log_result) {
										console.log(log_result);
										var insert_mcard = "insert into MBRFLIB/MCRTA7P";
										insert_mcard += " (MBID,MBTNAM,MBTSUR)";
										//insert_mcard += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
										insert_mcard += " values(?,?,?)";
										//insert_mcard += " values(?,?,?,?,?,?,?,?,?,?)";
											
										var insert_mcard_params = [
											req.body.CUST_ID  //MBID
											,req.body.DEMO_TH_NAME  //MBTNAM
											,req.body.DEMO_TH_SURNAME  //MBTSUR
											
									   ];

									   //MCRR2P - not implemented yet
									   //point_log2_stmt = "";
									   console.log('insert_mcard_stmt');
									   console.log(insert_mcard);
									   console.log('insert_mcard_params');
									   console.log(insert_mcard_params);

									   pool.insertAndGetId(insert_mcard, insert_mcard_params)
										.then(function(log_result) {
											console.log(log_result);
											var insert_mcard = "insert into MBRFLIB/MPOTF1P";
											insert_mcard += " (MBCODE,MBTNAM,MBTSUR,MBEXP,MBID,MBBIRH,MBHTEL,MBPTEL,MBDAT,MBDATS,MBSTS,MBPOINT,MBACT)";
											//insert_mcard += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
											insert_mcard += " values(?,?,?,?,?,?,?,?,?,?,?,?,?)";
											//insert_mcard += " values(?,?,?,?,?,?,?,?,?,?)";
												
											var insert_mcard_params = [
												mb  //MBCODE                    
												,req.body.DEMO_TH_NAME  //MBTNAM
												,req.body.DEMO_TH_SURNAME  //MBTSUR
												,999912  //MBEXP
												,req.body.CUST_ID  //MBID
												,req.body.DEMO_DOB  //MBBIRH
												,contacthome  //MBHTEL									
												,req.body.CONTACT_MOBILE  //MBPTEL									
												,parseInt(date_str)  //MBDAT
												,parseInt(date_str)  //MBDATS
												,'A' //MBSTS
												,0 //MBPOINT
												,'A' //MBACT
										   ];

										   //MCRR2P - not implemented yet
										   //point_log2_stmt = "";
										   console.log('insert_mcard_stmt');
										   console.log(insert_mcard);
										   console.log('insert_mcard_params');
										   console.log(insert_mcard_params);

										   pool.insertAndGetId(insert_mcard, insert_mcard_params)
											.then(function(log_result) {
												console.log(log_result);
												res.json({
													"RESP_SYSCDE": "",
													"RESP_DATETIME": date_str,
													"RESP_CDE": 101,
													 "RESP_MSG": "Success",
													"MCARD_NUM": mb,
													"CARD_TYPE": "GF",
													"CARD_EXPIRY_DATE": "999912",
													"CARD_POINT_BALANCE": "0",
													"CARD_POINT_EXPIRY": "999912",
													"CARD_POINT_EXP_DATE": "999912",
												});
												return;
											})
											.fail(function(log_error) {
											   console.log("ERROR INSERT MPOTF1P");
											   console.log(log_error);
											   res.status(500);
											   res.end();
											   return;

											});
						
										})
										.fail(function(log_error) {
										   console.log("ERROR INSERT MCRTA7P");
										   console.log(log_error);
										   res.status(500);
										   res.end();
										   return;
										});
						
									})
									.fail(function(log_error) {
									   console.log("ERROR INSERT PM110MP");
									   console.log(log_error);
									   res.status(500);
									   res.end();
									   return;

									});
							
								})
								.fail(function(log_error) {
								   console.log("ERROR INSERT PM200MP");
								   console.log(log_error);
								   res.status(500);
								   res.end();
								   return;

								});				
							})
							.fail(function(log_error) {
							   console.log("ERROR INSERT MVM02P");
							   console.log(log_error);
							   res.status(500);
							   res.end();
							   return;

							});
						
						})
						.fail(function(log_error) {
						   console.log("ERROR INSERT MVM01P");
						   console.log(log_error);
						   res.status(500);
						   res.end();
						   return;

						});
							
					})
					.fail(function(error) {
						console.log(log_error);
						res.status(500);
						res.end();
						return;
					});
			}
            
        })
        .fail(function(error) {
            console.log(error);
			res.status(500);
			res.end();
			return;
        });
	
	
	
	
	
	
	
	
	
});
// ========================== End register =======================================================


// ========================== Start Test =======================================================
app.post('/register_test', function(req, res) {	
	var mb = '';
	var date_str = '';
    var today = new Date();
	
	console.log('Start : ' + today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate() +' - '+ (today.getHours() < 10 ? '0' : '') + today.getHours() + ':' + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes() + ':' + (today.getSeconds() < 10 ? '0' : '') + today.getSeconds() + ':' + today.getMilliseconds());
	
    date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();
	var datetime = new Date();
    datetime = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate() + (today.getHours() < 10 ? '0' : '') + today.getHours() + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes() + (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();
		
	
	/**************************** Check Required Field *********************************/
	
	if((typeof req.body.PARTNER_ID == 'undefined') || (typeof req.body.PARTNER_PROD == 'undefined') || (typeof req.body.PARTNER_NBR == 'undefined') || (typeof req.body.PARTNER_DETAILS == 'undefined') || (typeof req.body.CUST_ID == 'undefined') || (typeof req.body.DEMO_NTNL == 'undefined') || (typeof req.body.DEMO_GENDER == 'undefined') || (typeof req.body.DEMO_MRTLSTS == 'undefined') || (typeof req.body.DEMO_HAVE_KIDS == 'undefined') || (typeof req.body.DEMO_OCCUP == 'undefined') || (typeof req.body.ADD_HOUSE_NUM == 'undefined') || (typeof req.body.ADD_ROAD == 'undefined') || (typeof req.body.ADD_SUB_DISTRICT == 'undefined') || (typeof req.body.ADD_DISTRICT == 'undefined') || (typeof req.body.ADD_PROVINCE == 'undefined') || (typeof req.body.ADD_POSTAL_CODE == 'undefined') || (typeof req.body.CONTACT_MOBILE == 'undefined') || (typeof req.body.CONTACT_EMAIL == 'undefined')){
		//console.log("Missing Required Field Register");
        res.json({
			"RESP_CDE": 401,
			"RESP_MSG": "Missing Required Field" 
		});		
		return;
	}
	
	/**************************** END Check Required Field *********************************/
	
	
	/**************************** Check Number Type *********************************/
	
	if(isNaN(req.body.DEMO_HAVE_KIDS) || isNaN(req.body.ADD_POSTAL_CODE) || (typeof req.body.DEMO_HAVE_KIDS == 'string') || (typeof req.body.ADD_POSTAL_CODE == 'string')){
			res.json({
				"RESP_CDE": 401,
				"RESP_MSG": "Missing Required Field" 
			});		
			return;
		}
	
	
	/**************************** END Check Number Type *********************************/
	
	/**************************** Check Optional Field *********************************/
	
	var village = '';
	var floor = '';
	var soi = '';
	var contacthome ='';
	
	
	/**************************** END Check Optional Field *********************************/
	
	/**************************** Check Cust ID *********************************/
	var citizen = '';
	var passport = '';
	
	if(req.body.DEMO_NTNL == 'TH'){
		if((typeof req.body.DEMO_TH_TITLE == 'undefined') || (typeof req.body.DEMO_TH_NAME == 'undefined') || (typeof req.body.DEMO_TH_SURNAME == 'undefined') || (typeof req.body.DEMO_EN_TITLE == 'undefined') || (typeof req.body.DEMO_EN_NAME == 'undefined') || (typeof req.body.DEMO_EN_SURNAME == 'undefined')){
			//console.log("Missing Required Field Register");
			res.json({
				"RESP_CDE": 401,
				"RESP_MSG": "Missing Required Field" 
			});		
			return;
		}
		else if(checkID(req.body.CUST_ID)){
			citizen = req.body.CUST_ID;
		}
		else{
			res.json({
				"RESP_CDE": 402,
				"RESP_MSG": "Invalid format" 
			});
			return;
		}
	}
	else{
		if((typeof req.body.DEMO_EN_TITLE == 'undefined') || (typeof req.body.DEMO_EN_NAME == 'undefined') || (typeof req.body.DEMO_EN_SURNAME == 'undefined')){
			//console.log("Missing Required Field Register");
			res.json({
				"RESP_CDE": 401,
				"RESP_MSG": "Missing Required Field" 
			});		
			return;
		}
		passport = req.body.CUST_ID;
	}
	/**************************** END Check Cust ID *********************************/
	//console.log('AGE');
	//console.log(parseInt(today.getFullYear().toString()));
	//console.log(parseInt(req.body.DEMO_DOB.toString().substr(0, 4)));
	var age = parseInt(today.getFullYear().toString()) - parseInt(req.body.DEMO_DOB.toString().substr(0, 4));
	//console.log(age);
	
	if(age < 0){
		res.json({
			"RESP_CDE": 402,
			"RESP_MSG": "Invalid format" 
		});
		return;
	}
	

	var stmt = "select * from MBRFLIB/MCRTA7P MCRTA7P where MCRTA7P.MBID='" + req.body.CUST_ID + "'"; //Check Citizen/Passport Existing
	//console.log(stmt);
    pool.query(stmt)
        .then(function(result) {
            ////console.log(result[0].HLDNAM);
			//console.log('Checking CUST ID');
            //console.log(result.length);
			//console.log(result);
			if(result.length > 0){
				//console.log('Citizen/Passport Existed');
				res.json({
					"RESP_CDE": 422,
					"RESP_MSG": "Citizen/Passport Existed" 
				});
				var endcall = new Date();	
												console.log('End : ' + endcall.getFullYear().toString() + ((endcall.getMonth() + 1) < 10 ? '0' : '').toString() + (endcall.getMonth() + 1).toString() + (endcall.getDate() < 10 ? '0' : '').toString() + endcall.getDate() +' - '+ (endcall.getHours() < 10 ? '0' : '') + endcall.getHours() + ':' + (endcall.getMinutes() < 10 ? '0' : '') + endcall.getMinutes() + ':' + (endcall.getSeconds() < 10 ? '0' : '') + endcall.getSeconds() + ':' + endcall.getMilliseconds());
				return;
			}
			else{
				//console.log('Citizen/Passport not Existed');
				var stmt = "select max(tbl.RUNNING) as RUN from (select substr(MVM01P.MBCODE,1,6) as MTYPE,MVM01P.MBCODE,substr(MVM01P.MBCODE,8,6) as RUNNING from MBRFLIB/MVM01P MVM01P where substr(MVM01P.MBCODE,1,6) = '710570') as tbl";
				//console.log(stmt);

				pool.query(stmt)
					.then(function(stmt_result) {
						//console.log(stmt_result);		
						//console.log(stmt_result.length);
						 if (stmt_result.length <= 0) {
							mb = '710570000000102';
							//console.log(mb);                
						} else {
							//mb = parseInt(stmt_result[0].RUNNING) + 1;
							var s = (parseInt(stmt_result[0].RUN) + 1)+"";
							while (s.length < 6) s = "0" + s;
							mb = '7105700'+ s + '02';
							//console.log(mb);				
						}		
						
						var a = 0;
						var b = 0;
						b = parseInt(mb.substr(1,1)) + parseInt(mb.substr(3,1)) + parseInt(mb.substr(5,1)) + parseInt(mb.substr(7,1)) + parseInt(mb.substr(9,1)) + parseInt(mb.substr(11,1)) + parseInt(mb.substr(13,1)) ;
						////console.log(b);
						for (i=0; i < 15; i++){
							////console.log('i = ' +i);
							a = parseInt(mb.substr(i,1)) * 2;
							if(a > 10){
								a = parseInt(a.toString().substr(0, 1)) + parseInt(a.toString().substr(1, 1));
								////console.log(a);
							}
							b = b + a ;
							////console.log(b);
							i++;
						}
						var c = 0;
						c = 10 - (b%10);
						if(c == 10){
							c = 0;
						}
						//console.log(c);
						mb = mb + c.toString();
						//console.log(mb);
						var insert_mcard = "insert into MBRFLIB/MVM01P";
						insert_mcard += " (MBAPP,MBCODE,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBPUR,MBEXP,MBID,MBBIRH,MBAGE,MBPASS,MBNAT,MBHSTS,MBSEX,MBCHIL,MBJOB,MBSINC,MBHNO,MBHVIL,MBFLR,MBHSOI,MBHRD,MBHPFT,MBHBOR,MBHPRV,MBHPOS,MBHTEL,MBPTEL,MBMEMC,MBDAT,MBEMAIL,MBBRH,MBAGEN)";
						//insert_mcard += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
						insert_mcard += " values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
						//insert_mcard += " values(?,?,?,?,?,?,?,?,?,?)";
							
						var insert_mcard_params = [
							02  //MBAPP
							,mb  //MBCODE                    
							,req.body.DEMO_TH_TITLE  //MBTTLE
							,req.body.DEMO_TH_NAME  //MBTNAM
							,req.body.DEMO_TH_SURNAME  //MBTSUR
							,req.body.DEMO_EN_TITLE  //MBETLE
							,req.body.DEMO_EN_NAME  //MBENAM
							,req.body.DEMO_EN_SURNAME  //MBESUR
							,11 //MBPUR
							,999912  //MBEXP
							,citizen  //MBID
							,req.body.DEMO_DOB  //MBBIRH
							,age //MBAGE
							,passport //MBPASS
							,req.body.DEMO_NTNL  //MBNAT					
							,req.body.DEMO_MRTLSTS  //MBHSTS
							,req.body.DEMO_GENDER  //MBSEX
							,req.body.DEMO_HAVE_KIDS  //MBCHIL
							,req.body.DEMO_OCCUP  //MBJOB
							,parseInt(today.getFullYear().toString()) //MBSINC
							,req.body.ADD_HOUSE_NUM  //MBHNO
							,village  //MBHVIL
							,floor  //MBFLR
							,soi  //MBHSOI
							,req.body.ADD_ROAD  //MBHRD
							,req.body.ADD_SUB_DISTRICT  //MBHPFT
							,req.body.ADD_DISTRICT  //MBHBOR
							,req.body.ADD_PROVINCE  //MBHPRV
							,req.body.ADD_POSTAL_CODE  //MBHPOS
							,contacthome  //MBHTEL
							,req.body.CONTACT_MOBILE  //MBPTEL	
							,'MC' //MBMEMC
							,parseInt(date_str)  //MBDAT
							,req.body.CONTACT_EMAIL  //MBEMAIL
							,02 //MBBRH
							,'SCB' //MBAGEN
					   ];

					   //MCRR2P - not implemented yet
					   //point_log2_stmt = "";
					   //console.log('insert_mcard_stmt');
					   //console.log(insert_mcard);
					   //console.log('insert_mcard_params');
					   //console.log(insert_mcard_params);

					   pool.insertAndGetId(insert_mcard, insert_mcard_params)
						.then(function(log_result) {
							//console.log(log_result);
							console.log('Insert MVM01P');
							var endcall = new Date();	
												console.log('End MVM01P : ' + endcall.getFullYear().toString() + ((endcall.getMonth() + 1) < 10 ? '0' : '').toString() + (endcall.getMonth() + 1).toString() + (endcall.getDate() < 10 ? '0' : '').toString() + endcall.getDate() +' - '+ (endcall.getHours() < 10 ? '0' : '') + endcall.getHours() + ':' + (endcall.getMinutes() < 10 ? '0' : '') + endcall.getMinutes() + ':' + (endcall.getSeconds() < 10 ? '0' : '') + endcall.getSeconds() + ':' + endcall.getMilliseconds());
							var insert_mcard = "insert into MBRFLIB/MVM02P";
							insert_mcard += " (MBAPP,MBCODE,MBCRE9)";
							//insert_mcard += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
							insert_mcard += " values(?,?,?)";
							//insert_mcard += " values(?,?,?,?,?,?,?,?,?,?)";
								
							var insert_mcard_params = [
								02  //MBAPP
								,mb  //MBCODE                    
								,1  //MBCRE9				
						   ];

						   //MCRR2P - not implemented yet
						   //point_log2_stmt = "";
						   //console.log('insert_mcard_stmt');
						   //console.log(insert_mcard);
						   //console.log('insert_mcard_params');
						   //console.log(insert_mcard_params);

						   pool.insertAndGetId(insert_mcard, insert_mcard_params)
							.then(function(log_result) {
								//console.log(log_result);
								var insert_mcard = "insert into MBRFLIB/PM200MP";
								insert_mcard += " (PNID,PNNUM,MBID,MBCODE,DATETIME)";
								//insert_mcard += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
								insert_mcard += " values(?,?,?,?,?)";
								//insert_mcard += " values(?,?,?,?,?,?,?,?,?,?)";
									
								var insert_mcard_params = [
									req.body.PARTNER_ID  //PNID
									,req.body.PARTNER_NBR  //PNNUM
									,req.body.CUST_ID  //MBID
									,mb  //MBCODE 
									,parseInt(datetime) //DATETIME
							   ];

							   //MCRR2P - not implemented yet
							   //point_log2_stmt = "";
							   //console.log(parseInt(datetime));
							   //console.log('insert_mcard_stmt');
							   //console.log(insert_mcard);
							   //console.log('insert_mcard_params');
							   //console.log(insert_mcard_params);

							   pool.insertAndGetId(insert_mcard, insert_mcard_params)
								.then(function(log_result) {
									//console.log(log_result);
									var insert_mcard = "insert into MBRFLIB/PM110MP";
									insert_mcard += " (PNID,PNPROD,PNNUM,PNDETAIL,MBID,TH_TITLE,TH_NAME,TH_SURNAM,EN_TITLE,EN_NAME,EN_SURNAM,MBBIRH,DE_NTNL,MBHSTS,MBSEX,MBCHIL,MBJOB,ADD_HOUSE,ADD_VILLA,MBFLR,ADD_SOI,ADD_ROAD,AD_SUBDIS,ADD_DISTR,ADD_PROVI,ADD_POST,CT_HOME,CT_MOBILE,MBMEMC,MBDAT,CT_EMAIL,MBBRH)";
									//insert_mcard += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
									insert_mcard += " values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
									//insert_mcard += " values(?,?,?,?,?,?,?,?,?,?)";
										
									var insert_mcard_params = [
										req.body.PARTNER_ID  //PNID
										,req.body.PARTNER_PROD  //PNPROD
										,req.body.PARTNER_NBR  //PNNUM
										,req.body.PARTNER_DETAILS //PNDETAIL
										,req.body.CUST_ID  //MBID
										//,02  //MBAPP
										//,mb  //MBCODE                    
										,req.body.DEMO_TH_TITLE  //TH_TITLE
										,req.body.DEMO_TH_NAME  //TH_NAME
										,req.body.DEMO_TH_SURNAME  //TH_SURNAM
										,req.body.DEMO_EN_TITLE  //EN_TITLE
										,req.body.DEMO_EN_NAME  //EN_NAME
										,req.body.DEMO_EN_SURNAME  //EN_SURNAM
										//,11 //MBPUR
										//,999912  //MBEXP				
										,req.body.DEMO_DOB  //MBBIRH
										//,parseInt(today.getFullYear().toString()) - parseInt(req.body.DEMO_DOB.substr(0, 4)) //MBAGE
										,req.body.DEMO_NTNL  //DE_NTNL					
										,req.body.DEMO_MRTLSTS  //MBHSTS
										,req.body.DEMO_GENDER  //MBSEX
										,req.body.DEMO_HAVE_KIDS  //MBCHIL
										,req.body.DEMO_OCCUP  //MBJOB
										//,parseInt(today.getFullYear().toString()) //MBSINC
										,req.body.ADD_HOUSE_NUM  //ADD_HOUSE
										,village  //ADD_VILLA
										,floor  //MBFLR
										,soi  //ADD_SOI
										,req.body.ADD_ROAD  //ADD_ROAD
										,req.body.ADD_SUB_DISTRICT  //AD_SUBDIS
										,req.body.ADD_DISTRICT  //ADD_DISTR
										,req.body.ADD_PROVINCE  //ADD_PROVI
										,req.body.ADD_POSTAL_CODE  //ADD_POST
										,contacthome  //CT_HOME
										,req.body.CONTACT_MOBILE  //CT_MOBILE	
										,'MC' //MBMEMC
										,parseInt(date_str)  //MBDAT
										,req.body.CONTACT_EMAIL  //CT_EMAIL
										,02 //MBBRH				
								   ];

								   //MCRR2P - not implemented yet
								   //point_log2_stmt = "";
								   //console.log('insert_mcard_stmt');
								   //console.log(insert_mcard);
								   //console.log('insert_mcard_params');
								   //console.log(insert_mcard_params);

								   pool.insertAndGetId(insert_mcard, insert_mcard_params)
									.then(function(log_result) {
										//console.log(log_result);
										var insert_mcard = "insert into MBRFLIB/MCRTA7P";
										insert_mcard += " (MBID,MBTNAM,MBTSUR)";
										//insert_mcard += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
										insert_mcard += " values(?,?,?)";
										//insert_mcard += " values(?,?,?,?,?,?,?,?,?,?)";
											
										var insert_mcard_params = [
											req.body.CUST_ID  //MBID
											,req.body.DEMO_TH_NAME  //MBTNAM
											,req.body.DEMO_TH_SURNAME  //MBTSUR
											
									   ];

									   //MCRR2P - not implemented yet
									   //point_log2_stmt = "";
									   //console.log('insert_mcard_stmt');
									   //console.log(insert_mcard);
									   //console.log('insert_mcard_params');
									   //console.log(insert_mcard_params);

									   pool.insertAndGetId(insert_mcard, insert_mcard_params)
										.then(function(log_result) {
											//console.log(log_result);
											var insert_mcard = "insert into MBRFLIB/MPOTF1P";
											insert_mcard += " (MBCODE,MBTNAM,MBTSUR,MBEXP,MBID,MBBIRH,MBHTEL,MBPTEL,MBDAT,MBDATS,MBSTS,MBPOINT,MBACT)";
											//insert_mcard += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
											insert_mcard += " values(?,?,?,?,?,?,?,?,?,?,?,?,?)";
											//insert_mcard += " values(?,?,?,?,?,?,?,?,?,?)";
												
											var insert_mcard_params = [
												mb  //MBCODE                    
												,req.body.DEMO_TH_NAME  //MBTNAM
												,req.body.DEMO_TH_SURNAME  //MBTSUR
												,999912  //MBEXP
												,req.body.CUST_ID  //MBID
												,req.body.DEMO_DOB  //MBBIRH
												,contacthome  //MBHTEL									
												,req.body.CONTACT_MOBILE  //MBPTEL									
												,parseInt(date_str)  //MBDAT
												,parseInt(date_str)  //MBDATS
												,'A' //MBSTS
												,0 //MBPOINT
												,'A' //MBACT
										   ];

										   //MCRR2P - not implemented yet
										   //point_log2_stmt = "";
										   //console.log('insert_mcard_stmt');
										   //console.log(insert_mcard);
										   //console.log('insert_mcard_params');
										   //console.log(insert_mcard_params);

										   pool.insertAndGetId(insert_mcard, insert_mcard_params)
											.then(function(log_result) {
												//console.log(log_result);
												res.json({
													"RESP_SYSCDE": "",
													"RESP_DATETIME": date_str,
													"RESP_CDE": 101,
													 "RESP_MSG": "Success",
													"MCARD_NUM": mb,
													"CARD_TYPE": "GF",
													"CARD_EXPIRY_DATE": "999912",
													"CARD_POINT_BALANCE": "0",
													"CARD_POINT_EXPIRY": "999912",
													"CARD_POINT_EXP_DATE": "999912",
												});
												var endcall = new Date();	
												console.log('End : ' + endcall.getFullYear().toString() + ((endcall.getMonth() + 1) < 10 ? '0' : '').toString() + (endcall.getMonth() + 1).toString() + (endcall.getDate() < 10 ? '0' : '').toString() + endcall.getDate() +' - '+ (endcall.getHours() < 10 ? '0' : '') + endcall.getHours() + ':' + (endcall.getMinutes() < 10 ? '0' : '') + endcall.getMinutes() + ':' + (endcall.getSeconds() < 10 ? '0' : '') + endcall.getSeconds() + ':' + endcall.getMilliseconds());
												return;
											})
											.fail(function(log_error) {
											   //console.log("ERROR INSERT MPOTF1P");
											   console.log(log_error);
											   res.status(500);
											   res.end();
											   return;

											});
						
										})
										.fail(function(log_error) {
										   //console.log("ERROR INSERT MCRTA7P");
										   console.log(log_error);
										   res.status(500);
										   res.end();
										   return;
										});
						
									})
									.fail(function(log_error) {
									   //console.log("ERROR INSERT PM110MP");
									   console.log(log_error);
									   res.status(500);
									   res.end();
									   return;

									});
							
								})
								.fail(function(log_error) {
								   //console.log("ERROR INSERT PM200MP");
								   console.log(log_error);
								   res.status(500);
								   res.end();
								   return;

								});				
							})
							.fail(function(log_error) {
							   //console.log("ERROR INSERT MVM02P");
							   console.log(log_error);
							   res.status(500);
							   res.end();
							   return;

							});
						
						})
						.fail(function(log_error) {
						   //console.log("ERROR INSERT MVM01P");
						   console.log(log_error);
						   res.status(500);
						   res.end();
						   return;

						});
							
					})
					.fail(function(error) {
						console.log(log_error);
						res.status(500);
						res.end();
						return;
					});
			}
            
        })
        .fail(function(error) {
            //console.log(error);
			res.status(500);
			res.end();
			return;
        });
	
	
	
	
	
	
	
	
	
});
// ========================== End Test =======================================================

// ========================== MApp =======================================================

app.post('/membercard_byid', function(req, res) {
    var date_str = '';
    var today = new Date();
    date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();
	
	var check1 = [];
	var check2 = [];

    if (typeof req.body.MBCODE == 'undefined') {

		check1 = ['MBCODE'];
		
		console.log(req.body);
		for(i=0;i < check1.length;i++){
			console.log(req.body[check1[i]]);
			if(typeof req.body[check1[i]] == 'undefined'){				
				check2.push(check1[i]);
			}
		}
		console.log("Missing Required Field : " + check2);
		res.status(400);
        res.end();
		
		return;
    } 
	/*else if(isNaN(req.body.SELRANGEDT.START) || isNaN(req.body.SELRANGEDT.LIMIT) || typeof req.body.SELRANGEDT.START == 'string' || typeof req.body.SELRANGEDT.LIMIT == 'string'){
		console.log('Invalid Format');
        res.json({
			"RESP_CDE": 402,
			"RESP_MSG": "Invalid Format"
		});
		return;
	} else if(req.body.PARTNER_ID.toString().length > 5 || req.body.CUST_ID.toString().length > 50 || req.body.CUST_COUNTRYCODE.toString().length > 2 || req.body.SELRANGEDT.LIMIT.toString().length > 4 || req.body.SELRANGEDT.START.toString().length > 4){
		console.log('Max length exceed');
        res.json({
			"RESP_CDE": 402,
			"RESP_MSG": "Invalid Format"
		});
		return;
	}*/
	else{
		check1 = ['MBCODE'];
		var x = length_validate(check1,req); 
		
		if(x.length > 0){
			res.status(400);
			res.end();
			return;
		}
		else{
			
		}		
	}
	
	
	var stmt = "select *";
        stmt += " from MBRFLIB/MVM01P MVM01P";
		stmt += " left join MBRFLIB/MCRS2P MCRS2P on MVM01P.MBCODE = MCRS2P.MBCODE";
        stmt += " where MVM01P.MBCODE = '" + req.body.MBCODE + "'";

    console.log(stmt);
    pool.query(stmt)
        .then(function(result) {
			if (result.length > 0) {
				console.log("Found MCard");
				M_CARD_TYPE = result[0].MBMEMC;
                M_CARD_EXPIRY_DATE = result[0].MBEXP;
                M_CARD_POINT_BALANCE = result[0].MBPOINT;
                M_CARD_POINT_EXPIRY = result[0].MBCEXP;
                M_CARD_POINT_EXP_DATE = result[0].MBDATT;
                M_DEMO_TH_TITLE = result[0].MBTTLE;
                M_DEMO_TH_NAME = result[0].MBTNAM;
                M_DEMO_TH_SURNAME = result[0].MBTSUR;
                M_DEMO_EN_TITLE = result[0].MBETLE;
                M_DEMO_EN_NAME = result[0].MBENAM;
                M_DEMO_EN_SURNAME = result[0].MBESUR;
			}
			else{
				res.status(400);
				res.end();
				return;
			}
			
		})
		.fail(function(result) {
			res.status(400);
			res.end();
			return;
		});


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
        stmt += " where PM200MP.MBCODE = '" + req.body.MBCODE + "') as tbl";

    console.log(stmt);
    pool.query(stmt)
        .then(function(result) {
            console.log(result.length);
            console.log(result);

            if (result.length <= 0) {
                //301M_CARD_TYPE = result[0].MBMEMC;
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": "",
                    "RESP_CDE": 201,
					"RESP_MSG": "Found MCard, Not Found Partner",
                    "MCARD_NUM": req.body.MBCODE,
                    "CARD_TYPE": M_CARD_TYPE,
                    "CARD_EXPIRY_DATE": M_CARD_EXPIRY_DATE,
                    "CARD_POINT_BALANCE": M_CARD_POINT_BALANCE,
                    "CARD_POINT_EXPIRY": M_CARD_POINT_EXPIRY,
                    "CARD_POINT_EXP_DATE": M_CARD_POINT_EXP_DATE,
                    "DEMO_TH_TITLE": M_DEMO_TH_TITLE,
                    "DEMO_TH_NAME": M_DEMO_TH_NAME,
                    "DEMO_TH_SURNAME": M_DEMO_TH_SURNAME,
                    "DEMO_EN_TITLE": M_DEMO_EN_TITLE,
                    "DEMO_EN_NAME": M_DEMO_EN_NAME,
                    "DEMO_EN_SURNAME": M_DEMO_EN_SURNAME,
                    "CARDS": [{
                        "PARTNER_PROD": "",
                        "PARTNER_NBR": "",
                        "PARTNER_DETAILS": "",
                        "PARTNER_STATUS": "",
                        "PARTNER_DATE": ""
                            //"PARTNER_DATE": date_str
                    }],
                    "RECORDCTRL": {
                        "SEQNO": 0,
                        "CARD_COUNT": 0
                    }
                });
				return;
            } else if (result.length == 1) {
                //101 - success
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": date_str,
                    "RESP_CDE": 101,
					"RESP_MSG": "Success",
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
                        "CARD_COUNT": 1
                    }
                });
				return;
            } else if (result.length > 1) {
                //102 - more than 1 card
                var cards = [];
                var max_ = 0;
                var limit_ = 0;
                var start_ = 0;
                max_ = start_;
                max_ = result.length;
                if (max_ > result.length) {
                    limit_ = result.length;
                } else if (max_ == 0) {
                    limit_ = result.length;
                } else {
                    limit_ = max_;
                }
                for (var i = 0; i < limit_; i++) {
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
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": date_str,
                    "RESP_CDE": 101,
					"RESP_MSG": "Success",
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
				return;
            } else {
                //301 - no partner card
                //301 - no partner card
                res.json({
                    "RESP_SYSCDE": "",
                    "RESP_DATETIME": date_str,
                    "RESP_CDE": 201,
					"RESP_MSG": "Found MCard, Not Found Partner",
                    "MCARD_NUM": req.body.MBCODE,
                    "CARD_TYPE": M_CARD_TYPE,
                    "CARD_EXPIRY_DATE": M_CARD_EXPIRY_DATE,
                    "CARD_POINT_BALANCE": M_CARD_POINT_BALANCE,
                    "CARD_POINT_EXPIRY": M_CARD_POINT_EXPIRY,
                    "CARD_POINT_EXP_DATE": M_CARD_POINT_EXP_DATE,
                    "DEMO_TH_TITLE": M_DEMO_TH_TITLE,
                    "DEMO_TH_NAME": M_DEMO_TH_NAME,
                    "DEMO_TH_SURNAME": M_DEMO_TH_SURNAME,
                    "DEMO_EN_TITLE": M_DEMO_EN_TITLE,
                    "DEMO_EN_NAME": M_DEMO_EN_NAME,
                    "DEMO_EN_SURNAME": M_DEMO_EN_SURNAME,
                    "CARDS": [{
                        "PARTNER_PROD": "",
                        "PARTNER_NBR": "",
                        "PARTNER_DETAILS": "",
                        "PARTNER_STATUS": "",
                        "PARTNER_DATE": ""
                            //"PARTNER_DATE": date_str
                    }],
                    "RECORDCTRL": {
                        "SEQNO": 0,
                        "CARD_COUNT": 0
                    }
                });
				return;
            }
        })
        .fail(function(error) {
            console.log(error);
			res.status(400);
			res.end();
			return;
        });
});

// ========================== End MApp =======================================================


function checkID(custid) {
	var ssn_ = custid;
	var sum = 0;
	console.log(ssn_);
	if(ssn_.length != 13){
		console.log("Invalid Citizen ID - Length");
		return false;
	}
	else{
		for(i=0, sum=0; i < 12; i++)
		sum += parseFloat(ssn_.charAt(i))*(13-i);
		if((11-sum%11)%10!=parseFloat(ssn_.charAt(12))){
			console.log("Invalid Citizen ID - Format");
			return false;
		}
		else{			
			console.log("Valid Citizen ID");
			return true;
		}
	}				
}

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