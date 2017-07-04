// importing required modules
var moment = require('moment');
var Gdax = require('gdax');
var groupArray = require('group-array');
var gdaxAccountDAL = require('../DAL/gdax_accounts_dal')
var gdaxTransferDAL = require('../DAL/gdax_transfer_dal')
var CronJob = require('cron').CronJob;
/* Gdax init[Start]  */

// Authenticating with gdax app credentials
var apiURI = 'https://api.gdax.com';
var gdaxKey = 'd4fa46cb54128a56400886b9e9e2839a';
var gdaxSecret = '8ZYj4x07zChiiOnIc5v1aFQ8IA29G05ZGLEtjPPjn4XN0y8v0bMmlWkYWq1VFtCSlOuzREaFY57sabryVzlP1A==';
var gdaxPhrase = '1768eswbz29';
/* Gdax init [end] */

var gdaxTransferSVC = {};
var queryParamsTrsansfers = {};

/* Getting Fills from Gdax API[Start] */
gdaxTransferSVC.getTransferFromGdax = function (req,res) {
    var authedClient = new Gdax.AuthenticatedClient(
        gdaxKey, gdaxSecret, gdaxPhrase, apiURI);

    var currency = req.body.currency.split("-")[0];

    // getting account for the reqeusted currency    
    gdaxAccountDAL.getAnAccount(currency, function (result) {
        var accntID = result.data.id;
        authedClient.getAccountHistory(accntID, function (error, response, data) {
            if (!error & response.statusCode === 200) {
                data.forEach(function (value) {
                    value.userKey = gdaxKey;
                    value.created_at_unix = moment(value.created_at).unix();
                    if (!value.details.product_id) {
                        value.details.product_id = req.body.currency;
                    }
                });

                // saving Account history to the DB    
                gdaxTransferDAL.saveAccountHistory(data, function (result) {
                    if (!result.success) {
                        console.log('Saving Account history Error')
                    } else {
                        if (data.length === 100) {
                            queryParamsFills.after = response.headers['cb-after'];
                            gdaxFillSVC.getFillsFromGdax(req,res);
                        } else {
                          //  job.start();
                        }
                        console.log('Saving Account History Success')
                    }
                })
            }
        })
    });
}
/* Getting Fills from Gdax API[End] */

module.exports = gdaxTransferSVC;