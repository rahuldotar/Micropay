// importing required modules
var moment = require('moment');
var Gdax = require('gdax');
var groupArray = require('group-array');
var gdaxFillsDAL = require('../DAL/gdax_fills_dal')
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
gdaxFillSVC.getTransferFromGdax = function () {
    var authedClient = new Gdax.AuthenticatedClient(
        gdaxKey, gdaxSecret, gdaxPhrase, apiURI);

    queryParamsTrsansfers.limit = '100';

    authedClient.getAccountHistory(queryParamsFills, function (error, response, data) {
        if (!error & response.statusCode === 200) {
            data.forEach(function (value) {
                value.userKey = gdaxKey;
            });
            gdaxFillsDAL.saveFills(data, function (result) {
                if (!result.success) {
                    console.log('Saving fils Error')
                } else {
                    if (data.length === 100) {
                        queryParamsFills.after = response.headers['cb-after'];
                        gdaxFillSVC.getFillsFromGdax();
                    } else {
                        job.start();
                    }

                    console.log('Saving Fills Success')
                }

            })

        }
    });
}
/* Getting Fills from Gdax API[End] */