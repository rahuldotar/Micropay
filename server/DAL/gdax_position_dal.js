var GdaxTransferDB = require('../models/gdax_transfer_model')
var GdaxAccountDB = require('../models/gdax_accounts_model')
var moment = require('moment');

var gdaxPositionDAL = {};

/* API handler to get data for trade positions from DB[Start] */
gdaxPositionDAL.getDataForTradePositionsFromDb = function (searchFilter, accntID, profileID, callBack) {
    var gdaxTransferDB = new GdaxTransferDB();
    var queryObj = {};
    searchFilter.accntID = accntID;
    Object.keys(searchFilter).forEach(function (key) {
        if (searchFilter[key] !== '') {
            switch (key) {
                case 'accntID':
                    queryObj.account_id = searchFilter[key]

                    break;
                case 'startDate':
                    queryObj.created_at_unix = {};
                    queryObj.created_at_unix.$lte = searchFilter[key];
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

    gdaxTransferDB.collection.find(queryObj).toArray(function (err, data) {
        if (err) {
            var result = {
                'success': false,
                'error': err
            };
            callBack(result);
        } else {
            var reqCurrPosition = data[0];
            getUSDAccountDetails(queryObj, profileID, function (data) {
                var usdPosition = data;
                var result = {
                    'success': true,
                    'data': {
                        reqCurr: reqCurrPosition,
                        USD: usdPosition
                    }
                };
                callBack(result);

            })
        }
    });
};
/* API handler to get data for trade positions from DB[End] */
// Exporting module


/* API Handler to get an Account[Start]  */
gdaxPositionDAL.getCurrentPosFromDb = function (request, callBack) {
    var gdaxAccountsDB = new GdaxAccountDB();
    var currType = request.prodId.split("-")[0];
    gdaxAccountsDB.collection.findOne({
        userKey: request.userKey,
        currency: currType
    }, function (err, data) {
        if (err) {
            var result = {
                'success': false,
                'error': err
            };
            callBack(result);
        } else {
            var reqCurrPosition = data;
            getUSDCurrentDetails(request.userKey, function (result) {
                if (result.error) {
                    var result = {
                        'success': false,
                        'error': result.error
                    };
                } else {
                    var usdPosition = result.data;
                    console.log(usdPosition)
                    var result = {
                        'success': true,
                        'data': {
                            reqCurr: reqCurrPosition,
                            USD: usdPosition
                        }
                    };
                }
                callBack(result);
            })


        }
    })
}
/* API Handler to get an Account[End]  */

module.exports = gdaxPositionDAL;

/* Function to get current USD Account Details[Start] */
var getUSDCurrentDetails = function (userKey, callBack) {
    var gdaxAccountsDB = new GdaxAccountDB();
   
    gdaxAccountsDB.collection.findOne({
        userKey: userKey,
        currency: 'USD'
    }, function (err, data) {
        if (err) {
            var result = {
                'success': false,
                'error': err
            };
            callBack(result);
        } else {
            var result = {
                'success': false,
                'data': data
            };
            console.log(data)
            callBack(result);
        }
    })
}
/* Function to get current USD Account Details[End] */


var getUSDAccountDetails = function (query, profile_id, callBack) {
    var gdaxAccountsDB = new GdaxAccountDB();
    var gdaxTransferDB = new GdaxTransferDB();
    gdaxAccountsDB.collection.findOne({
        profile_id: profile_id,
        currency: 'USD'
    }, function (err, data) {
        if (err) {
            var result = {
                'success': false,
                'error': err
            };
            callBack(result);
        } else {
            query.account_id = data.id
            gdaxTransferDB.collection.find(query).toArray(function (err, data) {
                if (err) {
                    var result = {
                        'success': false,
                        'error': err
                    };
                    callBack(result);
                } else {
                    callBack(data[0]);

                }
            });

        }
    })
}