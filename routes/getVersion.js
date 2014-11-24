/**
 * Created by shern on 14-9-27.
 */
var express = require('express');
var router = express.Router();
var database = require('../models/database');

router.post('/', function(req, res) {

	var table = 'calendar_version_table';
	var selectCol = 'version';
	var selectCondition = null;
	var version=[];
		database.IweekDataMysqlChar(table,selectCol,selectCondition,function(data) {
			for(var i=0;i<data.length;i++){
				version.push(data[i].version);
			}
			res.send({"version":version});
	})

});



module.exports = router;
