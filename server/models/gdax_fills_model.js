var mongoose = require('mongoose');

// Initiating schema
var Schema = mongoose.Schema;

var gdaxFillsSchema = new Schema({
    createdAt: String,
    tradeId: {type:Number,default:0},
    productId: String,
    orderId: String,
    userId: String,
    profileId: String,
    liquidity: String,
    price: {type:Number,default:0.0},
    size: {type:Number,default:0.0},
    fee: {type:Number,default:0.0},
    side: String,
    settled: Boolean
});

var gdaxFillsDb = mongoose.model('gdaxFills', gdaxFillsSchema);

module.exports = gdaxFillsDb;