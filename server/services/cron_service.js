var gdaxUserDAl = require('../DAL/gdax_user_dal');
var gdaxFillsService = require('../services/gdax_fills_service')
var gdaxFillsDAL = require('../DAL/gdax_fills_dal')
var gdaxTransferDAL = require('../DAL/gdax_transfer_dal')
var Gdax = require('gdax');

/* Getting latest Fills from Gdax if there is any for each account API[Start] */
this.getLatestFillsFromGdax = function () {
    console.log('checking cron')
    //getting all users
    gdaxUserDAl.getAllUsers(function (result) {
        if(!result.data.length){
            return;
        }
        if (result.data.length === 0) {
            return;
        }
        var users = result.data;
        users.forEach(function (user) {
            var authedClient = new Gdax.AuthenticatedClient(
                user.apiKey, user.apiSecret, user.passphrase);

            authedClient.getFills({
                limit: '100'
            }, function (error, response, data) {
                if(error){
                    return;
                }
                if (!error && response.statusCode === 200) {
                    data.forEach(function (value) {
                        value.userId = user._id;
                    });
                    gdaxFillsDAL.saveLatestFills(data, user, function (result) {
                        if (!result.success) {
                            console.log('Saving fils Error')
                        } else {
                            console.log('Saving Fills Success')
                        }

                    })

                }
            });
        })
    })
}
/* Getting latest from Gdax API[End] */

/* Get latest account history[Start] */
this.getLatestaccountHistory = function () {
    console.log('checking cron')
    //getting all users
    gdaxUserDAl.getAllUsers(function (result) {
        if (result.data.length === 0) {
            return;
        }
        var users = result.data;
        users.forEach(function (user) {
            var authedClient = new Gdax.AuthenticatedClient(
                user.apiKey, user.apiSecret, user.passphrase);

            var queryParamsTrsansfers = {};
            queryParamsTrsansfers.limit = '100';
            
            user.crptoAccounts.forEach(function (account) {
                authedClient.getAccountHistory(account.id, queryParamsTrsansfers, function (error, response, data) {
                    if(error){
                        console.log(error);
                        return;
                    }
                    if (data.length === 0) {
                        return;
                    }
                    if (!error & response.statusCode === 200) {
                        data.forEach(function (value) {
                            value.userID = user_id;
                            value.created_at_unix = moment(value.created_at).unix();
                            value.account_id = accntID
                            value.account_currency = account.currency;
                        });

                        gdax_transfer_dal.saveLatestAccountHistory(data, account.id, function () {
                            if (!result.success) {
                                console.log('Saving account history Error')
                            } else {
                                console.log('Saving account history Success')
                            }

                        })
                    }
                })

            })

        })
    })
}
/* Get latest account history[End] */