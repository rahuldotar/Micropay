// importing required modules
var moment = require('moment');
var Gdax = require('gdax');
var groupArray = require('group-array');
var gdaxpositionDAL = require('../DAL/gdax_position_dal')
var gdaxTransferDAL = require('../DAL/gdax_transfer_dal')
var gdaxAccountDAL = require('../DAL/gdax_accounts_dal')
var CronJob = require('cron').CronJob;
/* Gdax init[Start]  */

// Authenticating with gdax app credentials
var apiURI = 'https://api.gdax.com';
var gdaxKey = 'd4fa46cb54128a56400886b9e9e2839a';
var gdaxSecret = '8ZYj4x07zChiiOnIc5v1aFQ8IA29G05ZGLEtjPPjn4XN0y8v0bMmlWkYWq1VFtCSlOuzREaFY57sabryVzlP1A==';
var gdaxPhrase = '1768eswbz29';
/* Gdax init [end] */

var gdaxPositionSVC = {};
var queryParamsTrsansfers = {};

/* Getting Position history from Gdax API[Start] */
gdaxPositionSVC.getGdaxPosition = function (req, res) {
     gdaxpositionDAL.getDataForTradePositionsFromDb(req.body, function (result) {
            if (!result.success) {
                res.status(512).json({
                    success: false,
                    result: result
                });
            } else {
                res.status(200).json({
                    success: true,
                    result: result.data
                });
            }
        })
}
/* Getting Position history Gdax API[End] */

/* Getting current position from Gdax API[Start] */
gdaxPositionSVC.getCurrentPosition = function (req, res) {
    gdaxpositionDAL.getCurrentPosFromDb(req.body, function (result) {
        if (!result.success) {
            res.status(512).json({
                success: false,
                result: result
            });
        } else {
            res.status(200).json({
                success: true,
                result: result.data
            });
        }

    })

}
/* Getting current position from Gdax API[End] */

module.exports = gdaxPositionSVC;