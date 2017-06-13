var mongoose = require('mongoose');

// Initiating schema
var Schema = mongoose.Schema;

// var exchangRateSchema = new Schema({
//     symbol : String,
//     ask : {type:Number,default:0.0},
//     bid : {type:Number,default:0.0}
// });

var exchangRateSchema = new Schema({
    btcUsd : {ask: {type:Number,default:0.0},bid : {type:Number,default:0.0}},
    ethUsd : {ask: {type:Number,default:0.0},bid : {type:Number,default:0.0}},
    ethBtc : {ask: {type:Number,default:0.0},bid : {type:Number,default:0.0}},
    investment:{type:Number,default:0.0},
    returns:{type:Number,default:0.0},

});

var geminiExchangeDb = mongoose.model('geminiexchangerates',exchangRateSchema);

module.exports = geminiExchangeDb;