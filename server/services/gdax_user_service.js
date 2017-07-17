var gdaxUserDAL = require('../DAL/gdax_user_dal')

var gdaxUserSVC = {};

gdaxUserSVC.saveUser = function () {
    var userData = {
        gdaxKey: 'd4fa46cb54128a56400886b9e9e2839a',
        gdaxSecret: '8ZYj4x07zChiiOnIc5v1aFQ8IA29G05ZGLEtjPPjn4XN0y8v0bMmlWkYWq1VFtCSlOuzREaFY57sabryVzlP1A==',
        gdaxPhrase: '1768eswbz29',
        latestTrade: {},
    }

    gdaxUserDAL.saveUser(userData, function (result) {
        if (!result.success) {
            console.log('Saving user Error')
        } else {
            console.log('Saving user Success')
        }

    })
};


/* API handl;er for user signup[Start] */
gdaxUserSVC.userSignUp = function (req,res) {

    // Creating signup data object from  req body
    var signUpData = {
        apiKey: ''
        apiSecret: '8ZYj4x07zChiiOnIc5v1aFQ8IA29G05ZGLEtjPPjn4XN0y8v0bMmlWkYWq1VFtCSlOuzREaFY57sabryVzlP1A==',
        passPhrase: '1768eswbz29',
        latestTrade: {},
    }

    gdaxUserDAL.saveUser(userData, function (result) {
        if (!result.success) {
            console.log('Saving user Error')
        } else {
            console.log('Saving user Success')
        }

    })
};
/* API handl;er for user signup[End] */

module.exports = gdaxUserSVC;
