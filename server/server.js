
/* Importing required modules[Start] */
var express = require("express");
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var util = require('util');
var bodyParser = require('body-parser');
var CronJob = require('cron').CronJob;

// importing from app
var config = require('./config/config.js')
var geminiExchangeService = require('./services/gemini_exchange_service')
var gdaxFillsService = require('./services/gdax_fills_service')
var gdaxTransferService = require('./services/gdax_transfer_service')

/* Importing required modules[End] */

/* Initial Setup[Start] */
var app = express();

// Body Parser middleware
app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json
/* Initial Setup[End] */

// Serving static file to browser
app.use(express.static(__dirname + '/../client'));
app.get('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('demo.html', { root: __dirname + '/../client' });
});

/* Managing DB connection[Start] */
// Connecting to Database
mongoose.connect(config.dbConURL);

mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + config.dbConURL);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

/* Managing DB connection[End] */

/* Implementing cron Job for evaluating exchange rates[Start] */
var job = new CronJob({
  cronTime: '*/100 * * * * *',
  onTick: function() {
  // geminiExchangeService.saveCurrentExchangeRates();
//    gdaxFillsService.getLatestFillsFromGdax ();
//    gdaxTransferService.getLatestBTCTransferFromGdax();
//    gdaxTransferService.getLatestETHTransferFromGdax();
  },
  start: false,
  timeZone: 'America/Los_Angeles'
});

job.start();

/* Implementing cron Job for evaluating exchange rates[Start] */


require("./routes/routes")(app);
require("./routes/unauthed_routes")(app);
app.listen(8888);
console.log("Server started at port 8888");


