var async = require('async')
var GdaxFillsDB = require('../models/gdax_fills_model')
var GdaxUserDB = require('../models/gdax_user_model')
var moment = require('moment');
var mongoose = require('mongoose');

var gdaxFillsDAL = {};

/* API Handler to save Fills[Start]  */
gdaxFillsDAL.saveFills = function (userID, fillsData, callBack) {
    // Converting created at date to time stamp and store it new variable
    fillsData.forEach(function (value) {
        value.created_at_unix = moment(value.created_at).unix();
        value.price = parseFloat(value.price);
        value.size = parseFloat(value.size);
        value.fee = parseFloat(value.fee);
    });

    saveToDb(userID, fillsData, function (result) {
        callBack(result)
    });
}
/* API Handler to save Fills[End]  */

/* DAL Handler to save Latest Fills[Start]  */
gdaxFillsDAL.saveLatestFills = function (fillsData, userDet, callBack) {
    var gdaxFillsDB = new GdaxFillsDB();
    var gdaxUserDB = new GdaxUserDB();

    // Converting created at date to time stamp and store it new variable
    fillsData.forEach(function (value) {
        value.created_at_unix = moment(value.created_at).unix();
    });


    var newFillData = []

    // checking is there any new trade using created date
    fillsData.forEach(function (value) {
        if ((moment(value.created_at)).diff(moment(userDet.latestTrade.created_at)) > 0) {
            console.log('new trade found')
            newFillData.push(value)
        }
    });

    // Checking for new trade calling function accordingly
    newFillData.length > 0 ? saveToDb(newFillData, function (result) {
        callBack(result)
    }) : '';

}
/* DAL Handler to save Fills[End]  */


/* API handler to get fills from DB[Start] */
gdaxFillsDAL.getfillsFromDb = function (reqParams, callBack) {
    var gdaxFillsDB = new GdaxFillsDB();
    var queryObj = {
        userID: reqParams.sessionValue,
        product_id: reqParams.prodId
    }

    gdaxFillsDB.collection.find(queryObj).toArray(function (err, data) {
        if (err) {
            var result = {
                'success': false,
                'error': err
            };
            callBack(result);
        } else {
            var result = {
                'success': true,
                'data': data
            };
            callBack(result);
        }
    })
};

/* API handler to get fills from DB[End] */

/* API handler to search fills from DB[Start] */
gdaxFillsDAL.searchFillsFromDb = function (searchFilter, callBack) {

    var gdaxFillsDB = new GdaxFillsDB();
    var queryObj = {};

    Object.keys(searchFilter).forEach(function (key) {
        if (searchFilter[key] !== '') {
            switch (key) {
                case 'prodId':
                    queryObj.product_id = searchFilter[key];
                    break;
                case 'side':
                    queryObj.side = searchFilter[key];
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

    queryObj.userId = searchFilter.sessionValue;

    gdaxFillsDB.collection.find(queryObj).toArray(function (err, data) {
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
};
/* API handler to search fills from DB[End] */

/* API handler to get fills from DB[Start] */
gdaxFillsDAL.getfillsFromDb = function (reqParams, callBack) {
    var gdaxFillsDB = new GdaxFillsDB();
    var queryObj = {
        userKey: reqParams.userKey,
        product_id: reqParams.prodId
    }

    gdaxFillsDB.collection.find(queryObj).toArray(function (err, data) {
        if (err) {
            var result = {
                'success': false,
                'error': err
            };
            callBack(result);
        } else {
            var result = {
                'success': true,
                'data': data
            };
            callBack(result);
        }
    })
};

/* API handler to get data for trade positions from DB[Start] */
gdaxFillsDAL.getDataForTradePositionsFromDb = function (searchFilter, callBack) {
    var gdaxFillsDB = new GdaxFillsDB();
    var queryObj = {};
    Object.keys(searchFilter).forEach(function (key) {
        if (searchFilter[key] !== '') {
            switch (key) {
                case 'prodId':
                    queryObj.product_id = searchFilter[key];
                    break;
                case 'side':
                    queryObj.side = searchFilter[key];
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
module.exports = gdaxFillsDAL;

/* save to fills DB by preference[Start]  */
var saveToDb = function (userID, fillsData, callBack) {
    // Preparing Db instance
    var gdaxFillsDB = new GdaxFillsDB();
    var gdaxUserDB = new GdaxUserDB();

    // Inserting fills in to fill DB
    gdaxFillsDB.collection.insertMany(fillsData, function (err, data) {
        if (err) {
            var result = {
                'success': false,
                'error': err
            };
            return callBack(result);
        }

        // Finding the last inserted fill
        gdaxFillsDB.collection.findOne({
            userId: userID
        }, {
            sort: {
                'created_at': -1
            }
        }, function (err, doc) {
            // Updating in to gdax User
            gdaxUserDB.collection.findOneAndUpdate({
                _id: mongoose.Types.ObjectId(userID)
            }, {
                $set: {
                    latestTrade: doc
                }
            }, {
                new: true
            }, function (err, updateddoc) {
                if (err) {
                    console.log("Something wrong when updating data!");
                    return;
                }

                console.log(updateddoc);
                var result = {
                    'success': true,
                    'data': 'fills successfully saved'
                };
                callBack(result);

            });
        });

    });
};
/* save to fills DB by preference[Start]  */