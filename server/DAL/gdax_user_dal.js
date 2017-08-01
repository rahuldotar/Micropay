var GdaxUserDB = require('../models/gdax_user_model')
var Crypto = require('../utilities/cryptography');
var errorHandler = require('../utilities/error_handler');

var gdaxUserDAL = {};

/* Data Acces Layesr for saving new User [Start] */
gdaxUserDAL.saveNewUser = function (userSignupData, accounts, callBack) {
    // Preparing model instance
    var gdaxUserDB = new GdaxUserDB({
        userId: userSignupData.userID,
        password: Crypto.encrypt(userSignupData.password),
        apiKey: userSignupData.apiKey,
        apiSecret: userSignupData.apiSecret,
        passPhrase: userSignupData.passphrase,
        crptoAccounts: accounts
    });


    errorHandler.validateIfExists(gdaxUserDB, userSignupData.userID, 'userId', function (err, isExisting, data) {
        if (err) {
            var result = {
                'success': false,
                'error': err,
                'status': 512
            };
            return callBack(result);
        }

        if (isExisting) {
            var result = {
                'success': false,
                'error': 'User ID already exists',
                'status': 409
            };
            return callBack(result);
        }

        gdaxUserDB.save(function (err, data) {
            if (err) {
                var result = {
                    'success': false,
                    'error': err,
                    'status': 512
                };
                callBack(result, null);
            } else {
                var result = {
                    'success': true,
                    'data': 'User successfully saved'
                };
                callBack(result, (data._doc._id).toString());
            }
        });
    });
}
/* Data Acces Layesr for saving new User [END] */

/* Data access layer to get all  users[Start] */
gdaxUserDAL.getAllUsers = function (callBack) {
    var gdaxUserDB = new GdaxUserDB()

    gdaxUserDB.collection.find().toArray(function (err, data) {
        if (err) {
            var result = {
                'success': false,
                'error': err,
            };
            callBack(result);
        } else {
            if(!data){
                return;
            }
            if (data.length === 0) {
                var result = {
                    'success': false,
                    'error': 'No user found'
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
/*Data access layer to get all  users[End] */

module.exports = gdaxUserDAL;