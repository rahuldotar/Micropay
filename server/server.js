
/* Importing required modules[Start] */
var express = require("express");
var expressValidator = require('express-validator');
var util = require('util');
var bodyParser = require('body-parser');
/* Importing required modules[End] */

/* Initial Setup[Start] */
var app = express();
app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json
/* Initial Setup[End] */

require("./routes/routes.js")(app);
app.listen(8888);
console.log("Server started at port 8888");


