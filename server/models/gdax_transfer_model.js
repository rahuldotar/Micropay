var mongoose = require('mongoose');

// Initiating schema
var Schema = mongoose.Schema;

var gdaxTransferSchema = new Schema({
});

var gdaxTransferDb = mongoose.model('gdaxAccountHistory', gdaxTransferSchema);

module.exports = gdaxTransferDb;