var gdaxUserDAL = require('../DAL/gdax_user_dal')
var errorHandler = require('../utilities/error_handler')
var sessionHandler = require('../utilities/session_handler')
var Crypto = require('../utilities/cryptography')
var gdaxfillSvc = require('../services/gdax_fills_service')
var gdaxAccountSvc = require('../services/gdax_accounts_service')
var GdaxUserDB = require('../models/gdax_user_model')

var Gdax = require('gdax');

var config = require('../config/config.js')

var gdaxUserSVC = {};

/* API handl;er for user signup[Start] */
gdaxUserSVC.userSignUp = function (req, res) {

    // Creating signup data object from  req body
    var signUpData = Object.assign({}, req.body);

    //validating manadatory  fields
    var fieldstoValidate = [];
    Object.keys(signUpData).forEach(function (key) {
        fieldstoValidate.push(signUpData[key]);
    })

    errorHandler.validateMandatory(fieldstoValidate, function (validated) {
        if (!validated) {
            return res.status(400).json({
                success: false,
                error: 'Bad Reqest'
            });
        }
    })

    // validating API credentials[Start]
    var authedClient = new Gdax.AuthenticatedClient(
        signUpData.apiKey, signUpData.apiSecret, signUpData.passphrase, config.gdaxApiUrl);

    authedClient.getAccounts(function (error, response, data) {
        if (response.statusCode !== 200) {
            return res.status(response.statusCode).json({
                success: false,
                error: data.message
            });
        }
        // validating API credentials[End]


        // If validated saving the new user  
        gdaxUserDAL.saveNewUser(signUpData, function (result,userID) {
            if (!result.success) {
                return res.status(result.status).json({
                    success: false,
                    error: result.error
                });
            }

            gdaxfillSvc.getFillsFromGdax(signUpData,userID);
            gdaxAccountSvc.getAccounts(signUpData,userID);

            res.status(200).json({
                success: true,
                data: result.data
            });

        });
    });
};
/* API handler for user signup[End] */


/* API handl;er for user login[Start] */
gdaxUserSVC.userLogin = function (req, res) {
    // Creating signup data object from  req body
    var loginData = Object.assign({}, req.body);

    //validating manadatory  fields
    var fieldstoValidate = [];
    Object.keys(loginData).forEach(function (key) {
        fieldstoValidate.push(loginData[key]);
    })

    errorHandler.validateMandatory(fieldstoValidate, function (validated) {
        if (!validated) {
            return res.status(400).json({
                success: false,
                error: 'Bad Reqest'
            });
        }
    })

    // Preparing Db model instance
    var gdaxUserDB = new GdaxUserDB();

    // validating User ID
    errorHandler.validateIfExists(gdaxUserDB, loginData.userID, 'userId', function (err, isExisting, data) {
        if (isExisting) {
            // Validating password
            if (loginData.password === Crypto.decrypt(data.password)) {
                // Session handling
                sessionHandler.addSession(data._id, function (sessionresult) {

                    return res.status(200).json({
                        success: false,
                        data: {
                            token:sessionresult,
                            userID:data.userId
                        }
                    });

                })
            } else {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid User ID or Password'
                });
            }
        } else {
            return res.status(401).json({
                success: false,
                error: 'Invalid User ID or Password'
            });

        }
    });
};
/* API handler for user login[End] */

module.exports = gdaxUserSVC;