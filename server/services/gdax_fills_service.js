// importing required modules
var moment = require('moment');
var Gdax = require('gdax');
var groupArray = require('group-array');
var gdaxFillsDAL = require('../DAL/gdax_fills_dal')
var CronJob = require('cron').CronJob;
var config = require('../config/config.js')

// initializing objects needed
var gdaxFillSVC = {};
var queryParamsFills = {};

/* Getting Fills from Gdax API[Start] */
gdaxFillSVC.getFillsFromGdax = function (apiData,userID) {

    // Init gdax authentication client
    var authedClient = new Gdax.AuthenticatedClient(
        apiData.apiKey, apiData.apiSecret, apiData.passphrase, config.gdaxApiUrl);
    // setting limit 
    queryParamsFills.limit = '100';

    authedClient.getFills(queryParamsFills, function (error, response, data) {
        if (!error & response.statusCode === 200) {
            data.forEach(function (value) {
                value.userId = userID;
            });
            gdaxFillsDAL.saveFills(apiData.apiKey,data, function (result) {
                if (!result.success) {
                    console.log('Saving fils Error')
                } else {
                    if (data.length === 100) {
                        queryParamsFills.after = response.headers['cb-after'];
                        gdaxFillSVC.getFillsFromGdax(apiData);
                    } 
                    console.log('Saving Fills Success')
                }

            })

        }
    });
}
/* Getting Fills from Gdax API[End] */

/* Getting latest Fills from Gdax if there is any for each account API[Start] */
gdaxFillSVC.getLatestFillsFromGdax = function () {
    var authedClient = new Gdax.AuthenticatedClient(
        gdaxKey, gdaxSecret, gdaxPhrase, apiURI);

    authedClient.getFills({
        limit: '100'
    }, function (error, response, data) {
        if (!error && response.statusCode === 200) {
            data.forEach(function (value) {
                value.userKey = gdaxKey;
            });
            gdaxFillsDAL.saveLatestFills(data, function (result) {
                if (!result.success) {
                    console.log('Saving fils Error')
                } else {
                    console.log('Saving Fills Success')
                }

            })

        }
    });
}
/* Getting latest from Gdax API[End] */


/* Getting Gdax fills from database[Start] */
gdaxFillSVC.getfillsFromDb = function (req, res) {

    gdaxFillsDAL.getfillsFromDb(req.body, function (result) {
        if (!result.success) {
            res.status(512).json({
                success: false,
                result: result
            });
        } else {
            var groupByOrderId = groupArray(result.data, 'order_id')
            res.status(200).json({
                success: true,
                result: groupByOrderId
            });
        }

    })
}
/* Getting Gdax Fills from database API[End] */

/* search Gdax fills from database[Start] */
gdaxFillSVC.searchFillsFromDb = function (req, res) {
    gdaxFillsDAL.searchFillsFromDb(req.body, function (result) {
        if (!result.success) {
            res.status(result.status).json({
                success: false,
                error: result.error
            });
        } else {
            var groupByOrderId = groupArray(result.data, 'order_id')
            res.status(200).json({
                success: true,
                result: groupByOrderId
            });
        }

    })
}
/* search Gdax Fills from database API[End] */


/* Implementing cron Job for getting new gdax trades[Start] */
var job = new CronJob({
    cronTime: '*/60 * * * * *',
    onTick: function () {
        // geminiExchangeService.saveCurrentExchangeRates();
        gdaxFillSVC.getLatestFillsFromGdax()
    },
    start: false,
    timeZone: 'America/Los_Angeles'
});
/* Implementing cron Job for getting new gdax trades[End] */

module.exports = gdaxFillSVC;