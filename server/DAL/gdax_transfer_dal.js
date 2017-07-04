var GdaxTransferDB = require('../models/gdax_transfer_model')
var moment = require('moment');

var gdaxTransferDAL = {};

/* API Handler to save Fills[Start]  */
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
/* API Handler to save Fills[End]  */

module.exports = gdaxTransferDAL;