/**
 * Created by shern on 14-9-27.
 */
var express = require('express');
var router = express.Router();
var database = require('../models/database');

router.post('/', function(req, res) {
	database.IweekDataMysql('calendar_channel_table','channel,channel_id',null,function(data) {
		var channel={};
		for(var i=0;i<data.length;i++){
			channel[data[i].channel_id] = data[i].channel;
		}
		//console.log(channel);
		res.send({"channel":channel});
	});
});
module.exports = router;
