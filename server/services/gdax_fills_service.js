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

// // Authenticating with gdax app credentials
// var apiURI = 'https://api.gdax.com';
// var gdaxKey = 'ffabb7b72d5b11b3bbe1a978ef011a55';
// var gdaxSecret = '0YvjBc4XqbI6f+vdnH7FyWRzuY7ms8co82K7ojf5m57oCcqiKFAGr9YcoTwoEIHCKW7Ka1m8LUd3o2rYbZC4Og==';
// var gdaxPhrase = 'qn2w4a5dw3f';
// /* Gdax init [end] */

var gdaxFillSVC = {};
var queryParamsFills = {};

/* Getting Fills from Gdax API[Start] */
gdaxFillSVC.getFillsFromGdax = function () {
    var authedClient = new Gdax.AuthenticatedClient(
        gdaxKey, gdaxSecret, gdaxPhrase, apiURI);

    queryParamsFills.limit = '100';

    authedClient.getFills(queryParamsFills, function (error, response, data) {
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

/* Getting latest Fills from Gdax API[Start] */
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


// /* Getting Gdax fills from database[Start] */
// gdaxFillSVC.getfillsFromDb = function (req, res) {
//     gdaxFillsDAL.getfillsFromDb(req.body, function (result) {
//         if (!result.success) {
//             res.status(512).json({
//                 success: false,
//                 result: result
//             });
//         } else {
//             var groupByOrderId = groupArray(result.data, 'order_id')
//             res.status(200).json({
//                 success: true,
//                 result: groupByOrderId
//             });
//         }

//     })
// }
// /* Getting Gdax Fills from database API[End] */

// /* search Gdax fills from database[Start] */
// gdaxFillSVC.searchFillsFromDb = function (req, res) {
//     gdaxFillsDAL.searchFillsFromDb(req.body, function (result) {
//         if (!result.success) {
//             res.status(512).json({
//                 success: false,
//                 result: result
//             });
//         } else {
//             var groupByOrderId = groupArray(result.data, 'order_id')
//             res.status(200).json({
//                 success: true,
//                 result: groupByOrderId
//             });
//         }

//     })
// }
// /* search Gdax Fills from database API[End] */

// /* Getting Gdax fills from database[Start] */
// gdaxFillSVC.getDataForTradePositions = function (req, res) {
//     gdaxFillsDAL.getDataForTradePositionsFromDb(req.body, function (result) {
//         if (!result.success) {
//             res.status(512).json({
//                 success: false,
//                 result: result
//             });
//         } else {
//             var groupByOrderIdPosBefore = groupArray(result.data.dataPosBefore, 'order_id')
//             var groupByOrderIdPosNow = groupArray(result.data.dataPosAfter, 'order_id')
//             var sumEffectiveBefore = 0;
//             var sumEffectiveNow = 0;
//             Object.keys(groupByOrderIdPosBefore).forEach(function (key) {
//                 var sumProduct = 0;
//                 var meanWeight = 0;
//                 var totalSize = 0;
//                 var totalFee = 0;

//                 groupByOrderIdPosBefore[key].forEach(function (item) {
//                     sumProduct += (parseFloat(item.size) * (parseFloat(item.price)));
//                 });

//                 groupByOrderIdPosBefore[key].forEach(function (item) {
//                     totalSize += parseFloat(item.size);
//                 });

//                 groupByOrderIdPosBefore[key].forEach(function (item) {
//                     totalFee += parseFloat(item.fee);
//                 });

//                 meanWeight = sumProduct / totalSize;

//                 var effectiveTotal = groupByOrderIdPosBefore[key][0].side === 'buy' ? (totalSize * meanWeight) + totalFee : (totalSize * meanWeight) - totalFee
//                 sumEffectiveBefore += effectiveTotal
//             })

//             Object.keys(groupByOrderIdPosNow).forEach(function (key) {
//                 var sumProduct = 0;
//                 var meanWeight = 0;
//                 var totalSize = 0;
//                 var totalFee = 0;

//                 groupByOrderIdPosNow[key].forEach(function (item) {
//                     sumProduct += (parseFloat(item.size) * (parseFloat(item.price)));
//                 });

//                 groupByOrderIdPosNow[key].forEach(function (item) {
//                     totalSize += parseFloat(item.size);
//                 });

//                 groupByOrderIdPosNow[key].forEach(function (item) {
//                     totalFee += parseFloat(item.fee);
//                 });

//                 meanWeight = sumProduct / totalSize;

//                 var effectiveTotal = groupByOrderIdPosNow[key][0].side === 'buy' ? (totalSize * meanWeight) + totalFee : (totalSize * meanWeight) - totalFee
//                 sumEffectiveNow += effectiveTotal
//             })

//             res.status(200).json({
//                 success: true,
//                 result: {
//                     dataBefore: sumEffectiveBefore,
//                     dataNow: sumEffectiveNow
//                 }
//             });
//         }

//     })
// }
// /* Getting Gdax Fills from database API[End] */


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
/* search Gdax Fills from database API[End] */

/* Getting Gdax fills from database[Start] */
gdaxFillSVC.getDataForTradePositions = function (req, res) {
    gdaxFillsDAL.getDataForTradePositionsFromDb(req.body, function (result) {
        if (!result.success) {
            res.status(512).json({
                success: false,
                result: result
            });
        } else {
            var groupByOrderIdPosBefore = groupArray(result.data.dataPosBefore, 'order_id')
            var groupByOrderIdPosNow = groupArray(result.data.dataPosAfter, 'order_id')
            var sumEffectiveBefore = 0;
            var sumEffectiveNow = 0;
            if (groupByOrderIdPosBefore) {
                Object.keys(groupByOrderIdPosBefore).forEach(function (key) {
                    var sumProduct = 0;
                    var meanWeight = 0;
                    var totalSize = 0;
                    var totalFee = 0;

                    groupByOrderIdPosBefore[key].forEach(function (item) {
                        sumProduct += (parseFloat(item.size) * (parseFloat(item.price)));
                    });

                    groupByOrderIdPosBefore[key].forEach(function (item) {
                        totalSize += parseFloat(item.size);
                    });

                    groupByOrderIdPosBefore[key].forEach(function (item) {
                        totalFee += parseFloat(item.fee);
                    });

                    meanWeight = sumProduct / totalSize;

                    var effectiveTotal = groupByOrderIdPosBefore[key][0].side === 'buy' ? (totalSize * meanWeight) + totalFee : (totalSize * meanWeight) - totalFee
                    sumEffectiveBefore += effectiveTotal
                })
            }
            var sumProduct = 0;
            var meanWeight = 0;
            var totalSize = 0;
            var totalFee = 0;
            if (groupByOrderIdPosNow) {
                Object.keys(groupByOrderIdPosNow).forEach(function (key) {

                    groupByOrderIdPosNow[key].forEach(function (item) {
                        sumProduct += (parseFloat(item.size) * (parseFloat(item.price)));
                    });

                    groupByOrderIdPosNow[key].forEach(function (item) {
                        totalSize += parseFloat(item.size);
                    });

                    groupByOrderIdPosNow[key].forEach(function (item) {
                        totalFee += parseFloat(item.fee);
                    });

                    meanWeight = sumProduct / totalSize;

                    var effectiveTotal = groupByOrderIdPosNow[key][0].side === 'buy' ? (totalSize * meanWeight) + totalFee : (totalSize * meanWeight) - totalFee
                    sumEffectiveNow += effectiveTotal
                })

            }


            res.status(200).json({
                success: true,
                result: {
                    dataBefore: sumEffectiveBefore,
                    dataNow: sumEffectiveNow
                }
            });
        }

    })
}
/* Getting Gdax Fills from database API[End] */

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