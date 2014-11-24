
var express = require('express');
var router = express.Router();
var database = require('../models/database');



router.post('/', function(req, res) {

	var channelNumber=req.param('channelLength');
	var versionNumber=req.param('versionLength');
	var versionInfo=req.param('versionInfo');


	var newAddYesterdayChannel=[];
	var newAddYesterdayVersion=[];

	for(var i=0;i<channelNumber;i++){
		newAddYesterdayChannel[i]=0;
	}

	for(var i=0;i<versionNumber;i++){
		newAddYesterdayVersion[i]=0;
	}
	//console.log(newAddYesterdayChannel);
	//console.log(newAddYesterdayVersion);

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


	var channelData=function(callback){
		var table='calendar_analysis_info';
		var selectCol='new_add,channel';
		var selectCondition='calendar_analysis_info.time>='+yesterdayZeroTime+' and time<'+todayZeroTime;

		database.IweekDataMysqlChar(table,selectCol,selectCondition,function(data) {
			if(data.length===0){
				res.send({"channel":newAddYesterdayChannel,"version":newAddYesterdayVersion});
				return;
			}
			for(var i=0;i<data.length;i++) {
				newAddYesterdayChannel[parseInt(data[i].channel)-1]+=parseInt(data[i].new_add);
			}
			callback(newAddYesterdayChannel);
		});
	}

	channelData(function(channelArr){
		var table='calendar_analysis_info';
		var selectCol='new_add,soft_version';
		var selectCondition='calendar_analysis_info.time>='+yesterdayZeroTime+' and time<'+todayZeroTime;
		database.IweekDataMysqlChar(table,selectCol,selectCondition,function(data) {
			if(data.length===0){
				return;
			}
			for(var i=0;i<data.length;i++) {
				newAddYesterdayVersion[versionInfo.indexOf(data[i].soft_version)]+=parseInt(data[i].new_add);
			}
			res.send({"channel":channelArr,"version":newAddYesterdayVersion});

		});
	})
})



module.exports = router;