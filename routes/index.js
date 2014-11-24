var express = require('express');
var router = express.Router();
var database = require('../models/database');
/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'shen'});
});

router.post('/', function(req, res){
	var table = 'user';
	var selectCol = ' * ';
	var selectCondition = null;
	var user={userName:req.body.username,userPassword:req.body.password};
	database.LoginMysql(table,selectCol,selectCondition,function(data){
		for(var i =0, len = data.length;i<len;i++) {
			//console.log(i);
			if(user.userName === data[i].userName && user.userPassword === data[i].userPassword ){
				res.redirect("/home");
				return;
			}
		}
	});

});


router.get('/home', function(req, res){

	res.render('homePage', { title: 'shen'});
});

module.exports = router;