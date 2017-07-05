var GdaxTransferDB = require('../models/gdax_transfer_model')
var moment = require('moment');

var gdaxPositionDAL = {};

/* API handler to get data for trade positions from DB[Start] */
gdaxPositionDAL.getDataForTradePositionsFromDb = function (searchFilter, callBack) {
    var gdaxFillsDB = new GdaxFillsDB();
    var queryObj = {};
    Object.keys(searchFilter).forEach(function (key) {
        if (searchFilter[key] !== '') {
            switch (key) {
                case 'prodId':
                    queryObj.product_id = searchFilter[key];
                    break;
                case 'startDate':
                    queryObj.created_at_unix = {};
                    queryObj.created_at_unix.$gte = searchFilter[key];
                    break;
                case 'endDate':
                    if (queryObj.created_at_unix) {
                        queryObj.created_at_unix.$lte = searchFilter[key];
                    } else {
                        queryObj.created_at_unix = {};
                        queryObj.created_at_unix.$lte = searchFilter[key];
                    }

                    break;
            }
        }
    });

    gdaxFillsDB.collection.find(queryObj).toArray(function (err, data) {
        if (err) {
            var result = {
                'success': false,
                'error': err
            };
            callBack(result);
        } else {
            var dataOnTrade = data;
            delete queryObj.created_at_unix;
            queryObj.created_at_unix = {};
            queryObj.created_at_unix.$lt = searchFilter.startDate;
            gdaxFillsDB.collection.find(queryObj).toArray(function (err, data) {
                if (err) {
                    var result = {
                        'success': false,
                        'error': err
                    };
                    callBack(result);
                } else {
                    var dataBeforeTrade = data;
                    var result = {
                        'success': true,
                        'data': {
                            dataPosBefore: dataBeforeTrade,
                            dataPosAfter: dataOnTrade
                        }
                    };
                    callBack(result);
                }

            })

            // var result = {
            //     'success': true,
            //     'data': data
            // };
            // callBack(result);
        }
    })
};
/* API handler to get data for trade positions from DB[End] */
// Exporting module
module.exports = gdaxPositionDAL;