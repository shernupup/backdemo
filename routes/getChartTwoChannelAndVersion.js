/**
 * Created by shern on 14-10-15.
 */
var express = require('express');
var router = express.Router();
var database = require('../models/database');

router.post('/', function(req, res) {

	var channel=[];
	var version=[];

	var getChannel=function(callback){
		var tableChannel = 'calendar_channel_table';
		var selectColChannel = 'channel';
		var selectConditionChannel = null;
		database.IweekDataMysqlChar(tableChannel,selectColChannel,selectConditionChannel,function(channelData) {
			//console.log(channelData);
			for(var i=0;i<channelData.length;i++){
				channel.push(channelData[i].channel);
			};
			callback(channel);
		});
	};

	getChannel(function(Channel){
		var tableVersion='calendar_version_table';
		var selectColVersion = 'version';
		var selectConditionVersion = null;

		database.IweekDataMysqlChar(tableVersion,selectColVersion,selectConditionVersion ,function(Version) {
			for(var i=0;i<Version.length;i++){
				version.push(Version[i].version);
			};
			res.send({"channel":Channel,"version":version});
		});
	});
});


module.exports = router;