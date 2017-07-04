var GdaxAccountsDB = require('../models/gdax_accounts_model')
var moment = require('moment');

var gdaxAccountsDAL = {};

/* API Handler to save Accounts[Start]  */
gdaxAccountsDAL.saveAccounts = function (fillsData, callBack) {
    var gdaxAccountsDB = new GdaxAccountsDB();
    gdaxAccountsDB.collection.insertMany(fillsData, function (err, data) {
        if (err) {
            var result = {
                'success': false,
                'error': err
            };
            callBack(result);
        } else {
                var result = {
                'success': true,
                'data': 'Rate successfully saved'
            };
            callBack(result);
        }
    })
}
/* API Handler to save Accounts  [End]  */


module.exports = gdaxAccountsDAL;


