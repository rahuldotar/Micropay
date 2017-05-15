
/* Importing required modules[Start] */
var express = require("express");
var expressValidator = require('express-validator');
var util = require('util');
var bodyParser = require('body-parser');
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

require("./routes/routes.js")(app);
app.listen(8888);
console.log("Server started at port 8888");


