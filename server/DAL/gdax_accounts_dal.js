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


/* API Handler to get an Account[Start]  */
gdaxAccountsDAL.getAnAccount = function (currType, callBack) {
    var gdaxAccountsDB = new GdaxAccountsDB();
    gdaxAccountsDB.collection.findOne({userKey: 'd4fa46cb54128a56400886b9e9e2839a',currency:currType}, function (err, data) {
        if (err) {
            var result = {
                'success': false,
                'error': err
            };
            callBack(result);
        } else {
                var result = {
                'success': true,
                'data':data
            };
            callBack(result);
        }
    })
}
/* API Handler to get an Account[End]  */

module.exports = gdaxAccountsDAL;
