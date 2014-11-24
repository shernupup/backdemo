var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

var getChartOneData = require('./routes/getChartOneData');
var getChartOneTotal = require('./routes/getChartOneTotal');


var getChartTwoChannelAndVersion = require('./routes/getChartTwoChannelAndVersion');
var getChartTwoTodayData= require('./routes/getChartTwoTodayData');
var getChartTwoYesterdayData= require('./routes/getChartTwoYesterdayData');
var getChartTwoSelectTimeData = require('./routes/getChartTwoSelectTimeData');
var getChannel = require('./routes/getChannel');
var getVersion = require('./routes/getVersion');
var getChartThreeBySelectData = require('./routes/getChartThreeBySelectData');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);


app.use('/getChartOneData', getChartOneData);
app.use('/getChartOneTotal', getChartOneTotal);
app.use('/getChartTwoChannelAndVersion', getChartTwoChannelAndVersion);
app.use('/getChartTwoTodayData', getChartTwoTodayData);
app.use('/getChartTwoYesterdayData', getChartTwoYesterdayData);
app.use('/getChartTwoSelectTimeData', getChartTwoSelectTimeData);
app.use('/getChartThreeBySelectData', getChartThreeBySelectData);
app.use('/getChannel', getChannel);
app.use('/getVersion', getVersion);



app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', 80);
var server = app.listen(app.get('port'),'', function() {
    console.log("manage app has start at 80");
});

module.exports = app;
