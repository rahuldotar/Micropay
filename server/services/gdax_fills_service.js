// importing required modules
const crypto = require("crypto");
var request = require('request');
var moment = require('moment');
var Gdax = require('gdax');
var groupArray = require('group-array');
var gdaxFillsDAL = require('../DAL/gdax_fills_dal')

/* Gdax init[Start]  */
// Authenticating with gdax app credentials
var apiURI = 'https://api.gdax.com';
var gdaxKey = 'd4fa46cb54128a56400886b9e9e2839a';
var gdaxSecret = '8ZYj4x07zChiiOnIc5v1aFQ8IA29G05ZGLEtjPPjn4XN0y8v0bMmlWkYWq1VFtCSlOuzREaFY57sabryVzlP1A==';
var gdaxPhrase = '1768eswbz29';
/* Gdax init [end] */

var gdaxFillSVC = {};

/* Getting Fills from Gdax API[Start] */
gdaxFillSVC.getFillsFromGdax = function (req, res) {
    var authedClient = new Gdax.AuthenticatedClient(
        gdaxKey, gdaxSecret, gdaxPhrase, apiURI);

    authedClient.getFills({
        limit: '100'
    }, function (error, response, data) {
        if (!error & response.statusCode === 200) {
            data.forEach(function (value) {
                value.userKey = gdaxKey;
            });
            gdaxFillsDAL.saveFills(data, function (result) {
                if (!result.success) {
                    console.log('Saving fils Error')
                } else {
                    console.log('Saving Fills Success')
                }

            })

        }
    });
}
/* Getting Fills from Gdax API[End] */


/* Getting Gdax fills from database[Start] */
gdaxFillSVC.getfillsFromDb = function (req, res) {
    gdaxFillsDAL.getfillsFromDb(req.body.userKey, function (result) {
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
             res.status(512).json({
                success: false,
                result: result
            });
        } else {
            res.status(200).json({
                success: true,
                result: result
            });
        }

    })
}
/* search Gdax Fills from database API[End] */

module.exports = gdaxFillSVC;