/**
 * Created by shern on 14-9-25.
 */
var express = require('express');
var router = express.Router();
var database = require('../models/database');

router.post('/', function(req, res) {


	var todayAll=req.param('todayAll');//string类型
	var yesterdayAll=req.param('yesterdayAll');//string类型

	var myDate = new Date();
	var nowDate={};
	nowDate.nowYear=myDate.getFullYear();
	nowDate.nowMonth=myDate.getMonth();
	nowDate.nowDay=myDate.getDate();
	nowDate.nowTime=parseInt(myDate.getTime()/1000);

	var yesterdayDate={};
	yesterdayDate.Year=myDate.getFullYear();   //获取完整的年份(4位,1970-????)
	yesterdayDate.Month=myDate.getMonth();       //获取当前月份(0-11,0代表1月)
	yesterdayDate.Date=myDate.getDate()-1;        //获取当前日(1-31)
	var todayZeroTime = Date.UTC(nowDate.nowYear,nowDate.nowMonth,nowDate.nowDay,0)/1000-8*3600;
	var yesterdayZeroTime = todayZeroTime-86400;

	//console.log(todayZeroTime);
	//console.log(yesterdayZeroTime);

	var table = 'calendar_analysis_info';
	var selectCol = ' time,new_add,active,open_times,remain';
	var selectCondition = 'time>='+yesterdayZeroTime;

	database.IweekDataMysql(table,selectCol,selectCondition,function(data){
		var todayDate={};
		todayDate.newAdd=0;
		todayDate.active=0;
		todayDate.openTimes=0;
		todayDate.remain=0;

		var yesterdayDate={};
		yesterdayDate.newAdd=0;
		yesterdayDate.active=0;
		yesterdayDate.openTimes=0;
		yesterdayDate.remain=0;

		for(var i=0;i<data.length;i++){

			if(parseInt(data[i].time)<todayZeroTime){

				yesterdayDate.newAdd+=parseInt(data[i].new_add);
				yesterdayDate.active+=parseInt(data[i].active);
				yesterdayDate.openTimes+=parseInt(data[i].open_times);
				yesterdayDate.remain+=parseInt(data[i].remain);

			}else{

				todayDate.newAdd+=parseInt(data[i].new_add);
				todayDate.active+=parseInt(data[i].active);
				todayDate.openTimes+=parseInt(data[i].open_times);
				todayDate.remain+=parseInt(data[i].remain);
			}
		}
		todayDate.remain=Math.round(todayDate.remain/todayAll*10000)/100;
		yesterdayDate.remain=Math.round(yesterdayDate.remain/yesterdayAll*10000)/100;
		var todayRemainPercent=todayDate.remain.toString()+'%';
		var yesterdayRemainPercent=yesterdayDate.remain.toString()+'%'

	     res.send({"todayNewAdd":todayDate.newAdd,"todayActive":todayDate.active,"todayOpenTimes":todayDate.openTimes,"todayRemain":todayRemainPercent,
		"yesterdayNewAdd":yesterdayDate.newAdd,"yesterdayActive":yesterdayDate.active,"yesterdayOpenTimes":yesterdayDate.openTimes,"yesterdayRemain":yesterdayRemainPercent});
	});


});



module.exports = router;

