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

module.exports = gdaxUserSVC;
