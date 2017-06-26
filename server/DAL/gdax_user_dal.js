var GdaxUserDB = require('../models/gdax_user_model')

var gdaxUserDAL = {};

gdaxUserDAL.saveUser = function (userData, callBack) {
    var gdaxUserDB = new GdaxUserDB({
        apiKey: userData.gdaxKey,
        apiSecret: userData.gdaxSecret,
        passPhrase: userData.gdaxPhrase,
        latestTrade: userData.latestTrade

    });


    gdaxUserDB.save(function (err, data) {
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
    });
}

module.exports = gdaxUserDAL;