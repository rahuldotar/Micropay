var async = require('async')
var GdaxFillsDB = require('../models/gdax_fills_model')
var GdaxUserDB = require('../models/gdax_user_model')
var moment = require('moment');

var gdaxFillsDAL = {};

/* API Handler to save Fills[Start]  */
gdaxFillsDAL.saveFills = function (fillsData, callBack) {
    var gdaxFillsDB = new GdaxFillsDB();
    var gdaxUserDB = new GdaxUserDB();

    // Converting created at date to time stamp and store it new variable
    fillsData.forEach(function (value) {
        value.created_at_unix = moment(value.created_at).unix();
    });

    saveToDb(gdaxFillsDB, gdaxUserDB, fillsData, function (result) {
        callBack(result)
    });
}
/* API Handler to save Fills[End]  */

/* API Handler to save Latest Fills[Start]  */
gdaxFillsDAL.saveLatestFills = function (fillsData, callBack) {
    var gdaxFillsDB = new GdaxFillsDB();
    var gdaxUserDB = new GdaxUserDB();

    // Converting created at date to time stamp and store it new variable
    fillsData.forEach(function (value) {
        value.created_at_unix = moment(value.created_at).unix();
    });


    gdaxUserDB.collection.findOne({
        apiKey: 'd4fa46cb54128a56400886b9e9e2839a'
    }, function (err, data) {
        if (err) {
            console.log(err);
            return;
        }

        var newFillData = []

        // checking is there any new trade using created date
        fillsData.forEach(function (value) {
            if ((moment(value.created_at)).diff(moment(data.latestTrade.created_at)) > 0) {
                newFillData.push(value)
            }
        });

        // Checking for new trade calling function accordingly
        newFillData.length > 0 ? saveToDb(gdaxFillsDB, gdaxUserDB, newFillData, function (result) {
            callBack(result)
        }) : '';
    })
}
/* API Handler to save Fills[End]  */


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

    gdaxFillsDB.collection.find(queryObj).toArray(function (err, data) {
        if (err) {
            var result = {
                'success': false,
                'error': err,
                'status':512
            };
            callBack(result);
        } else {
            if (data.length === 0) {
                var result = {
                    'success': false,
                    'error': 'No result found',
                    'status':404
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
var saveToDb = function (gdaxFillsDB, gdaxUserDB, fillsData, callBack) {
    gdaxFillsDB.collection.insertMany(fillsData, function (err, data) {
        if (err) {
            var result = {
                'success': false,
                'error': err
            };
            callBack(result);
        } else {
            gdaxFillsDB.collection.findOne({
                userKey: 'd4fa46cb54128a56400886b9e9e2839a'
            }, {
                sort: {
                    'created_at': -1
                }
            }, function (err, doc) {
                // Updating in to gdax User
                var gdaxUserDB = new GdaxUserDB();
                gdaxUserDB.collection.findOneAndUpdate({
                    apiKey: 'd4fa46cb54128a56400886b9e9e2839a'
                }, {
                    $set: {
                        latestTrade: doc
                    }
                }, {
                    new: true
                }, function (err, updateddoc) {
                    if (err) {
                        console.log("Something wrong when updating data!");
                    }

                    console.log(doc);
                });
            });
            var result = {
                'success': true,
                'data': 'Rate successfully saved'
            };
            callBack(result);
        }
    });
};
/* save to fills DB by preference[Start]  */