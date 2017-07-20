// importing required modules
var moment = require('moment');
var Gdax = require('gdax');
var groupArray = require('group-array');
var gdaxAccountDAL = require('../DAL/gdax_accounts_dal')
var gdaxTransferDAL = require('../DAL/gdax_transfer_dal')
var CronJob = require('cron').CronJob;
var config = require('../config/config.js')

var gdaxTransferSVC = {};
var queryParamsTrsansfers = {};
queryParamsTrsansfers.limit = '100';

/* Getting Account History from Gdax API[Start] */
gdaxTransferSVC.getTransferFromGdax = function (apiData,currency,userID) {

    // Init gdax client
    var authedClient = new Gdax.AuthenticatedClient(
         apiData.apiKey, apiData.apiSecret, apiData.passphrase, config.gdaxApiUrl);

    var currency = currency;

    // getting account for the reqeusted currency    
    gdaxAccountDAL.getAnAccount(currency,userID, function (result) {
        var accntID = result.data.id;
        authedClient.getAccountHistory(accntID, queryParamsTrsansfers, function (error, response, data) {
            if (data.length === 0) {
                return;
            }
            if (!error & response.statusCode === 200) {
                data.forEach(function (value) {
                    value.userID = userID;
                    value.created_at_unix = moment(value.created_at).unix();
                    value.account_id = accntID
                    value.account_currency = result.data.currency;
                });

                // saving Account history to the DB    
                gdaxTransferDAL.saveAccountHistory(data, function (result) {
                    if (!result.success) {
                        console.log('Saving Account history Error')
                    } else {
                        if (data.length === 100) {
                            queryParamsTrsansfers.after = response.headers['cb-after'];
                            gdaxTransferSVC.getTransferFromGdax(apiData,currency,userID);
                        } else {
                            
                        }
                        console.log('Saving Account History Success')
                    }
                })
            }
        })
    });
}
/* Getting Account History from Gdax API[End] */

/* API Handler Getting Latest ETH Account History from Gdax API[Start] */
gdaxTransferSVC.getLatestETHTransferFromGdax = function () {
    var authedClient = new Gdax.AuthenticatedClient(
        gdaxKey, gdaxSecret, gdaxPhrase, apiURI);

    var currency = 'ETH';

    // getting account for the reqeusted currency    
    gdaxAccountDAL.getAnAccount(currency, function (result) {
        var accntID = result.data.id;
        authedClient.getAccountHistory(accntID, queryParamsTrsansfers, function (error, response, data) {
            if (!error) {
                data.forEach(function (value) {
                    value.userKey = gdaxKey;
                    value.created_at_unix = moment(value.created_at).unix();
                    value.account_id = accntID
                    if (!value.details.product_id) {
                        value.details.product_id = 'ETH-USD';
                    }
                });

                // saving Account history to the DB    
                gdaxTransferDAL.saveLatestETHAccountHistory(data, accntID, function (result) {
                    if (!result.success) {
                        console.log('Saving Account history Error')
                    } else {
                        console.log(result.data)
                    }
                })
            }
        })
    });
}
/* API HANDLER Getting Latest ETHG Account History from Gdax API[End] */

/* API Handler Getting Latest BTC Account History from Gdax API[Start] */
gdaxTransferSVC.getLatestBTCTransferFromGdax = function () {
    var authedClient = new Gdax.AuthenticatedClient(
        gdaxKey, gdaxSecret, gdaxPhrase, apiURI);

    var currency = 'BTC';

    // getting account for the reqeusted currency    
    gdaxAccountDAL.getAnAccount(currency, function (result) {
        var accntID = result.data.id;
        authedClient.getAccountHistory(accntID, queryParamsTrsansfers, function (error, response, data) {
            if (!error) {
                data.forEach(function (value) {
                    value.userKey = gdaxKey;
                    value.created_at_unix = moment(value.created_at).unix();
                    value.account_id = accntID
                    if (!value.details.product_id) {
                        value.details.product_id = 'BTC-USD';
                    }
                });

                // saving Account history to the DB    
                gdaxTransferDAL.saveLatestBTCAccountHistory(data, accntID, function (result) {
                    if (!result.success) {
                        console.log('Saving Account history Error')
                    } else {
                        console.log(result.data)
                    }
                })
            }
        })
    });
}
/* API HANDLER Getting Latest BTC Account History from Gdax API[End] */

/* API Handler to  Getting transfers from DB[Start] */
gdaxTransferSVC.getTransferFromDB = function (req, res) {
    var currency = req.body.prodId.split("-")[0];

    // getting account for the reqeusted currency    
    gdaxAccountDAL.getAnAccount(currency, req.body.sessionValue, function (result) {
        var accntID = result.data.id;

        // Getting trnsfers for respective currency     
        gdaxTransferDAL.getTransfers(accntID,req.body.sessionValue, function (result) {
            if (!result.success) {
                res.status(result.status).json({
                    success: false,
                    error: result.error
                });
            } else {
                res.status(200).json({
                    success: true,
                    result: result.data
                });
            }

        });
    });
}
/*  API Handler to Getting transfers from DB[END] */

/* API Handler to  Filter transfers from DB[Start] */
gdaxTransferSVC.searchTransferFromDB = function (req, res) {
    var currency = req.body.prodId.split("-")[0];

    // getting account for the reqeusted currency    
    gdaxAccountDAL.getAnAccount(currency, req.body.sessionValue,function (result) {
        var accntID = result.data.id;

        // Getting trnsfers for respective currency     
        gdaxTransferDAL.searchTransfers(accntID, req.body, function (result) {
            if (!result.success) {
                res.status(result.status).json({
                    success: false,
                    error: result.error
                });
            } else {
                res.status(200).json({
                    success: true,
                    result: result.data
                });
            }

        });
    });
}
/*  API Handler to Filter transfers from DB[END] */

module.exports = gdaxTransferSVC;