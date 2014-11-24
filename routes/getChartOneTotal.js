/**
 * Created by shern on 14-9-29.
 */
var express = require('express');
var router = express.Router();
var database = require('../models/database');

router.post('/', function(req, res) {


	var myDate = new Date();
	var nowDate={};
	nowDate.nowYear=myDate.getFullYear();
	nowDate.nowMonth=myDate.getMonth();
	nowDate.nowDay=myDate.getDate();

	var todayZeroTime = Date.UTC(nowDate.nowYear,nowDate.nowMonth,nowDate.nowDay,0)/1000-8*3600;

	var todayAll=0;
	var yesterdayAll=0;
	var table = 'calendar_analysis_info';
	var selectCol = ' time,new_add';
	var selectCondition = null;
	database.IweekDataMysql(table,selectCol,selectCondition,function(data){
		for(var i=0;i<data.length;i++){
			if(data[i].time<todayZeroTime){
				todayAll+=parseInt(data[i].new_add);
				yesterdayAll+=parseInt(data[i].new_add);
			}else {
				todayAll+=parseInt(data[i].new_add);
			}
		}
	res.send({"todayAll":todayAll,"yesterdayAll":yesterdayAll})
	})

});



module.exports = router;
