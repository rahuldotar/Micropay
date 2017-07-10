var mongoose = require('mongoose');

// Initiating schema
var Schema = mongoose.Schema;

var gdaxUserSchema = new Schema({
    apiKey : String,
    apiSecret : String,
    passPhrase :String,
    latestTrade:{},
});

var gdaxUserDb = mongoose.model('gdaxUsers',gdaxUserSchema);

module.exports = gdaxUserDb;