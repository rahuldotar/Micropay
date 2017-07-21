var GdaxTransferDB = require('../models/gdax_transfer_model')
var moment = require('moment');

var gdaxTransferDAL = {};

/* DAL to save Account History[Start]  */
gdaxTransferDAL.saveAccountHistory = function (fillsData, callBack) {
    var gdaxTransferDB = new GdaxTransferDB();

    gdaxTransferDB.collection.insertMany(fillsData, function (err, data) {
        if (err) {
            var result = {
                'success': false,
                'error': err
            };
            callBack(result);
        } else {
            var result = {
                'success': true,
                'data': 'Rate successfully saved'
            };
            callBack(result);
        }
    })
}
/* DAL Handler to save Account History[End]  */

/* DAL to save latest ETH Account History[Start]  */
gdaxTransferDAL.saveLatestAccountHistory = function (trnsfrData, accountid, callBack) {
    var gdaxTransferDB = new GdaxTransferDB();

    gdaxTransferDB.collection.findOne({
        account_id: accountid
    }).sort({
        created_at_unix: -1
    }).toArray(function (err, data) {
        if (err) {
            var result = {
                'success': false,
                'error': err
            };
            callBack(result);
        } else {
            var latestRecord = data;
            var newTrnsfrData = []

            // checking is there any new trade using created date
            trnsfrData.forEach(function (value) {
                if ((moment(value.created_at)).diff(moment(latestRecord.created_at)) > 0) {
                    newTrnsfrData.push(value)
                }
            });

            if (newTrnsfrData.length > 0) {
                gdaxTransferDB.collection.insertMany(trnsfrData, function (err, data) {
                    if (err) {
                        var result = {
                            'success': false,
                            'error': err
                        };
                        callBack(result);
                    } else {
                        var result = {
                            'success': true,
                            'data': 'Transfer successfully saved'
                        };
                        callBack(result);
                    }
                })

            }
        }

    });

}
/* DAL Handler to save latest ETH Account History[End]  */


/* DAL to get Account History[Start]  */
gdaxTransferDAL.getTransfers = function (accountId,userId, callBack) {
    var gdaxTransferDB = new GdaxTransferDB();
    var queryObj = {};
    queryObj.account_id = accountId;
    queryObj.userID = userId;
    queryObj.type = 'transfer';

    gdaxTransferDB.collection.find(queryObj).toArray(function (err, data) {
        if (err) {
            var result = {
                'success': false,
                'error': err,
                'status': 512
            };
            callBack(result);
        } else {
            if (data.length === 0) {
                var result = {
                    'success': false,
                    'error': 'No result found',
                    'status': 404
                };
                return callBack(result);
            }
            var result = {
                'success': true,
                'data': data
            };
            callBack(result);
        }
    })
}
/* DAL Handler to get Account History[End]  */

/* DAL to Filter Account History[Start]  */
gdaxTransferDAL.searchTransfers = function (accountId, searchFilter, callBack) {
    var gdaxTransferDB = new GdaxTransferDB();
    var queryObj = {};
    Object.keys(searchFilter).forEach(function (key) {
        if (searchFilter[key] !== '') {
            switch (key) {
                case 'type':
                    queryObj = {
                        'details.transfer_type': searchFilter[key]
                    }
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
    queryObj.account_id = accountId;
    queryObj.userID = searchFilter.sessionValue;
    queryObj.type = 'transfer';

    gdaxTransferDB.collection.find(queryObj).toArray(function (err, data) {
        if (err) {
            var result = {
                'success': false,
                'error': err,
                'status': 512
            };
            callBack(result);
        } else {
            if (data.length === 0) {
                var result = {
                    'success': false,
                    'error': 'No result found',
                    'status': 404
                };
                return callBack(result);
            }
            var result = {
                'success': true,
                'data': data
            };
            callBack(result);
        }
    })
}
/* DAL Handler to Filter Account History[End]  */


module.exports = gdaxTransferDAL;