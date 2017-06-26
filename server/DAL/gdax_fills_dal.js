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


    gdaxUserDB.collection.findOne({
        apiKey: 'd4fa46cb54128a56400886b9e9e2839a'
    }, function (err, data) {
        if (err) {
            console.log(err);
            return;
        }

        // Checking if there is any last trade
        if (!data.latestTrade) {
            saveToDb(gdaxFillsDB, gdaxUserDB, fillsData, function (result) {
                callBack(result)
            });
        } else {
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
        }
    })
}
/* API Handler to save Fills[End]  */

/* API handler to get fills from DB[Start] */
gdaxFillsDAL.getfillsFromDb = function (apiKey, callBack) {
    var gdaxFillsDB = new GdaxFillsDB();

    gdaxFillsDB.collection.find({
        userKey: apiKey
    }).toArray(function (err, data) {
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

    gdaxFillsDB.collection.find({
        userKey: apiKey
    }).toArray(function (err, data) {
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
/* API handler to search fills from DB[End] */

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
                    apiKey: doc.userKey
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