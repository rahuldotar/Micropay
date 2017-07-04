// importing required modules
var moment = require('moment');
var Gdax = require('gdax');
var groupArray = require('group-array');
var gdaxAccountsDAL = require('../DAL/gdax_accounts_dal')
var CronJob = require('cron').CronJob;

/* Gdax init[Start]  */
// Authenticating with gdax app credentials
var apiURI = 'https://api.gdax.com';
var gdaxKey = 'd4fa46cb54128a56400886b9e9e2839a';
var gdaxSecret = '8ZYj4x07zChiiOnIc5v1aFQ8IA29G05ZGLEtjPPjn4XN0y8v0bMmlWkYWq1VFtCSlOuzREaFY57sabryVzlP1A==';
var gdaxPhrase = '1768eswbz29';
/* Gdax init [end] */

var gdaxAccountSvc = {}

/* Getting gdax Accounts For a profile[Start] */
gdaxAccountSvc.getAccounts = function (req, res) {
    var authedClient = new Gdax.AuthenticatedClient(
        gdaxKey, gdaxSecret, gdaxPhrase, apiURI);

      authedClient.getAccounts(function (error, response, data) {
        if (!error & response.statusCode === 200) {
            data.forEach(function (value) {
                value.userKey = gdaxKey;
            });
            gdaxAccountsDAL.saveAccounts(data, function (result) {
                if (!result.success) {
                    console.log('Saving Accounts Error')
                } else {
                  console.log('Saving Accounts Success')
               }

            })

        }
    });
}
/* Getting gdax Accounts For a profile[End] */


module.exports = gdaxAccountSvc;
