// importing required modules
var moment = require('moment');
var Gdax = require('gdax');
var groupArray = require('group-array');
var gdaxAccountsDAL = require('../DAL/gdax_accounts_dal')
var CronJob = require('cron').CronJob;
var config = require('../config/config.js')
var gdaxTrnsfrService = require('./gdax_transfer_service')

var gdaxAccountSvc = {}

/* Getting gdax Accounts For a profile[Start] */
gdaxAccountSvc.getAccounts = function (apiData,userID) {
    var authedClient = new Gdax.AuthenticatedClient(
         apiData.apiKey, apiData.apiSecret, apiData.passphrase, config.gdaxApiUrl);

      authedClient.getAccounts(function (error, response, data) {
        if (!error && response.statusCode === 200) {
            data.forEach(function (value) {
                value.userID = userID;
            });
            gdaxAccountsDAL.saveAccounts(data, function (result) {
                if (!result.success) {
                    console.log('Saving Accounts Error')
                } else {
                  gdaxTrnsfrService.getTransferFromGdax(apiData,'ETH',userID);
                  gdaxTrnsfrService.getTransferFromGdax(apiData,'LTC',userID)
                  gdaxTrnsfrService.getTransferFromGdax(apiData,'BTC',userID)
                  gdaxTrnsfrService.getTransferFromGdax(apiData,'USD',userID)

               }

            })

        }
    });
}
/* Getting gdax Accounts For a profile[End] */


module.exports = gdaxAccountSvc;
