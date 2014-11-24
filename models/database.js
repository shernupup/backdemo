/**
 * Created by shern on 14-9-17.
 */
var database = require('database');
var longinConfig = require('../config/config').longinConfig;
var iweekDataConfig = require('../config/config').iweekDataConfig;
var databaseConfig=database.MysqlConnector;
var loginMysql =  new databaseConfig(longinConfig.host, longinConfig.user, longinConfig.password, longinConfig.database, 3);
var iweekDataMysql =  new databaseConfig(iweekDataConfig.host, iweekDataConfig.user, iweekDataConfig.password, iweekDataConfig.database, 3);

//find userData

var LoginMysql= function(table, selectCol, selectCondition , callback) {
	loginMysql.findDataFromDB(table, selectCol, selectCondition, function (err, rows) {
		if (err)
		{
			console.log(err);
			return;
		}
		callback(rows)
	});
};

exports.LoginMysql = LoginMysql;



var IweekDataMysql= function(table, selectCol, selectCondition , callback) {
	iweekDataMysql.findDataFromDB(table, selectCol, selectCondition, function (err, rows) {
		if (err)
		{
			console.log(err);
			return;
		}
		callback(rows)
	});
};

exports.IweekDataMysql = IweekDataMysql;



var IweekDataMysqlChar= function(table, selectCol, selectCondition , callback) {
	var sql = 'select '+ selectCol +' from ' + table;
	if (selectCondition) {
		sql += ' where ' + selectCondition;
	};
	console.log(sql);
	iweekDataMysql.query(sql, function (err, rows, fields) {
		if (err) {
			callback(err);
		}else{
			callback(rows);
		}
	});
};
exports.IweekDataMysqlChar = IweekDataMysqlChar;