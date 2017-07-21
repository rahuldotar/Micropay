var GdaxTransferDB = require('../models/gdax_transfer_model')
var GdaxAccountDB = require('../models/gdax_accounts_model')
var Gdax = require('gdax');
var moment = require('moment');
var async = require("async");
var groupArray = require('group-array');

var gdaxPositionDAL = {};

/* API handler to get data for trade positions from DB[Start] */
gdaxPositionDAL.getDataForTradePositionsFromDb = function (searchFilter, callBack) {

    // Creating a schema instance  
    var gdaxTransferDB = new GdaxTransferDB();
    var positionHistory = [];

     // Finding records from DB using aggrgate
    gdaxTransferDB.collection.aggregate(
        [{
                $sort: {
                    created_at_unix: -1
                }
            },
            {
                $match: {
                    userID: searchFilter.sessionValue,
                    created_at_unix: {
                        $lte: searchFilter.startDate
                    }
                }
            },
            {
                $group: {
                    _id: "$account_id",
                    firstSalesDate: {
                        $first: "$created_at_unix"
                    },
                    balance: {
                        $first: "$balance"
                    },
                    createdDate: {
                        $first: "$created_at"
                    },
                    currency: {
                        $first: "$account_currency"
                    }
                }
            },

        ]
    ).toArray(function (err, data) {
        if (err) {
            var result = {
                'success': false,
                'error': err
            };
            callBack(result);
        } else {
            var reqCurrPosition = groupArray(data, 'currency');
            getApproximatePrice(searchFilter.startDate, function (data) {
                var currentPrices = data;
                var result = {
                    'success': true,
                    'data': {
                        currPos: reqCurrPosition,
                        currPrices: currentPrices
                    }
                }
                callBack(result)

            })
        }
    });
};
/* API handler to get data for trade positions from DB[End] */


/* API Handler to get current Positions of all Accounts[Start]  */
gdaxPositionDAL.getCurrentPosFromDb = function (request, callBack) {
    var gdaxAccountsDB = new GdaxAccountDB();
    gdaxAccountsDB.collection.find({
        userID: request.sessionValue
    }).toArray(function (err, data) {
        if (err) {
            var result = {
                'success': false,
                'error': err
            };
            callBack(result);
        } else {
            var reqCurrPosition = groupArray(data, 'currency');
            getCurrentPrices(function (data) {
                var currentPrices = data;
                var result = {
                    'success': true,
                    'data': {
                        currPos: reqCurrPosition,
                        currPrices: currentPrices
                    }
                }
                callBack(result)
            });
        }
    })
}
/* API Handler to get current positions of all Account[End]  */

module.exports = gdaxPositionDAL;

/* get current Prices[Start] */
var getCurrentPrices = function (callBack) {
    // Delcaring all the currencies
    var currencies = ['ETH-USD', 'BTC-USD', 'LTC-USD']
    var approximateValues = {};

    async.forEach(currencies, function (curr, callback) {
        var publicClient = new Gdax.PublicClient(curr);
        publicClient.getProductTicker(function (err, res, data) {
            approximateValues[curr] = data.price;
            callback();
        });
    }, function (err) {
        callBack(approximateValues);
    });
}


/* get current Prices[End] */

/* getting aprroximate price of required date[Start] */
var getApproximatePrice = function (date, callBack) {
    // Creatting iso start and and end using time stamp
    var dateString = moment.unix(date).format("MM-DD-YYYY");
    var startDate = new Date(dateString).setHours(0, 0, 0, 0);
    var endDate = new Date(dateString).setHours(23, 59, 59, 999);
    var startDateISO = new Date(startDate).toISOString();
    var endDateISO = new Date(endDate).toISOString();

    var currencies = ['ETH-USD', 'BTC-USD', 'LTC-USD']
    var approximateValues = {};

    async.forEach(currencies, function (curr, callback) {
            var publicClient = new Gdax.PublicClient(curr);
            publicClient.getProductHistoricRates({
                'start': startDateISO,
                'end': endDateISO,
                'granularity': 5000
            }, function (err, res, data) {
                if(err){
                    return;
                }
              
                console.log(err);
                console.log(res.statusCode);
                var totalRecords = data.length;
                var totalOfhighAndLow = 0;
                var avg = 0;
                data.forEach(function (valueHist, index) {
                    totalOfhighAndLow += valueHist[1] + valueHist[2];
                })
                var approximatePrice = totalOfhighAndLow / (totalRecords*2);
                approximateValues[curr] = approximatePrice;
                callback();
            });
        },
        function (err) {
            callBack(approximateValues);
        });
};
/* getting aprroximate price of required date[End] */