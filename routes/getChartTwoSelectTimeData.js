/**
 * Created by shern on 14-9-29.
 */
var express = require('express');
var router = express.Router();
var database = require('../models/database');

router.post('/', function(req, res) {

	var date=req.param('channelDate');
	var InputZeroTime = 0;
	var InputOverTime = 0;
	var transferData = function(selectCondition){
		var channelNumber=req.param('channelLength');
		var versionNumber=req.param('versionLength');
		var versionInfo=req.param('versionInfo');
		var newAddSelectTimeChannel=[];
		var newAddSelectTimeVersion=[];

		for(var i=0;i<channelNumber;i++){
			newAddSelectTimeChannel[i]=0;
		}

		for(var i=0;i<versionNumber;i++){
			newAddSelectTimeVersion[i]=0;
		}

		database.IweekDataMysqlChar('calendar_analysis_info','new_add,channel,soft_version',selectCondition,function(data) {
			if(data.length===0){
				res.send({"channel":newAddSelectTimeChannel,"version":newAddSelectTimeVersion});
				return;
			}
			for(var i=0;i<data.length;i++) {
				newAddSelectTimeChannel[parseInt(data[i].channel)-1]+=parseInt(data[i].new_add);
				newAddSelectTimeVersion[versionInfo.indexOf(data[i].soft_version)]+=parseInt(data[i].new_add);
			}
			res.send({"channel":newAddSelectTimeChannel,"version":newAddSelectTimeVersion});
		});

	}
	var dateTimeSql=function(cb){
		if(!date){
			var myDate = new Date();
			var nowDate={};
			nowDate.nowYear=myDate.getFullYear();
			nowDate.nowMonth=myDate.getMonth();
			nowDate.nowDay=myDate.getDate();
			nowDate.nowTime=parseInt(myDate.getTime()/1000);

			var todayZeroTime = Date.UTC(nowDate.nowYear,nowDate.nowMonth,nowDate.nowDay,0)/1000-8*3600;
			InputZeroTime=todayZeroTime;
			InputOverTime=nowDate.nowTime;
			cb('calendar_analysis_info.time>='+InputZeroTime+' and time<'+InputOverTime);
		}else{
			var DateYear=date.substring(0, 2);
			DateYear="20"+DateYear;
			var DateMonth=date.substring(2, 4);
			var DateDay=date.substring(4, 6);
			InputZeroTime = Date.UTC(DateYear,DateMonth-1,DateDay,0)/1000-8*3600;
			InputOverTime = InputZeroTime+3600*23;
			cb('calendar_analysis_info.time>='+InputZeroTime+' and time<'+InputOverTime);
		}
	}
	dateTimeSql(function(dateTimeSqlResult){
		transferData(dateTimeSqlResult);
	})
});
module.exports = router;