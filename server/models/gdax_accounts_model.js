var mongoose = require('mongoose');

// Initiating schema
var Schema = mongoose.Schema;

var gdaxAccountsSchema = new Schema({
});

var gdaxAccountsDb = mongoose.model('gdaxAccounts', gdaxAccountsSchema);

module.exports = gdaxAccountsDb;