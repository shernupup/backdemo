/**
 * Created by shern on 14-9-28.
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
	nowDate.nowTime=parseInt(myDate.getTime()/1000);
    console.log('!!!!!!!!!!!!!!!!!!!!!!');
    console.log(nowDate.nowDay);
    console.log('!!!!!!!!!!!!!!!!!!!!1!');
	var todayZeroTime = Date.UTC(nowDate.nowYear,nowDate.nowMonth,nowDate.nowDay,0)/1000-8*3600;
	var thirtyDaysAgoZeroTime = todayZeroTime-29*86400;

	var channel=req.param('channel');//string
	var version=req.param('version');//string

	var transferData=function (tableChannelAll,selectColChannelAll,selectConditionChannelAll){
		database.IweekDataMysqlChar(tableChannelAll,selectColChannelAll,selectConditionChannelAll,function(data){
		var chartKindsArr=["new_add","active","active_7","open_times","remain","remain_7","remain_30","update"];
        var time = [];
		var chartKinds={};
		var thirtyDaysZeroTime =[];
		for(var j in chartKindsArr) {
			var  initialise = [];
			for(var i=0;i<30;i++){
				initialise[i] = 0;
				thirtyDaysZeroTime[i]=0;
			}
			chartKinds[chartKindsArr[j]] =  initialise;
		}


		for(var i=0;i<31;i++){
            var dateDisplay ='';
			thirtyDaysZeroTime[i]=thirtyDaysAgoZeroTime+i*86400;
            if(i<=29){
                var monthDisplay = new Date(thirtyDaysZeroTime[i]*1000).getMonth()+1;
                var dayDisplay = new Date(thirtyDaysZeroTime[i]*1000).getDate();
                dateDisplay = monthDisplay +'月'+ dayDisplay + '日';
                time.push(dateDisplay);
            }
        }



		for(var i=0;i<data.length;i++){
			for(var j= 0;j<30;j++){
				if(parseInt(data[i].time)>=thirtyDaysZeroTime[j] && parseInt(data[i].time)<thirtyDaysZeroTime[j+1]){
					for(var k in chartKinds){
						chartKinds[k][j]+=parseInt(data[i][k]);
					}
				}
			}
		}

//        console.log(chartKinds);
		res.send({"newAdd":chartKinds["new_add"],"active":chartKinds["active"],"active7":chartKinds["active_7"],"openTimes":chartKinds["open_times"]
			,"remain":chartKinds["remain"],"remain7":chartKinds["remain_7"],"remain30":chartKinds["remain_30"],"upgrade":chartKinds["update"],"time":time});
		});
	};

	var getChannelWhere = function(cb){
		var getChannelIndex = function(tableChannelIndex,selectColChannelIndex,selectConditionChannelIndex,callback) {
			database.IweekDataMysqlChar(tableChannelIndex, selectColChannelIndex, selectConditionChannelIndex, function (indexArray) {
				var channelIndex=[];
				for(var i=0;i<indexArray.length;i++){
					channelIndex.push(indexArray[i]['channel_id']);
				};
				callback(channelIndex);
			});
		};

		var getPlatSql= function(plat,callback){

			getChannelIndex('calendar_channel_table','channel_id',"plat="+plat,function(platIndex){
				if(platIndex.length===0){
					callback("没有此平台的索引");
					return;
				};
				var selectCondition = " and channel in (";
				for(var i=0;i<platIndex.length;i++) {
					if (i != 0)
						selectCondition += ",";
					selectCondition += platIndex[i];
				};
				selectCondition += ")";
				callback(selectCondition);
			});
		};

		if(!channel||channel==='ALL'){
			cb('');
		}else if(channel==='ios'||channel==='android'){
			getPlatSql(channel==='ios'?1:2,function(platSql){
				if(platSql!='没有此平台索引'){
					cb(platSql);
				};
			});
		}else if(!isNaN(channel)){

			cb(' and channel=' + channel);
		};
	};

	var getVersionWhere = function(cb){
		if(!version || version==='ALL'){

			cb('')
		}else{
			cb(" and soft_version='"+version+"'");
		};
	};


	getChannelWhere(function(whichChannel){
		getVersionWhere(function(versionSql){
			transferData('calendar_analysis_info','*','time >= '+thirtyDaysAgoZeroTime + whichChannel + versionSql);
		});
	});
});

module.exports = router;
