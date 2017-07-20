var gdaxUserService = require('../services/gdax_user_service')
var gdaxFillsService = require('../services/gdax_fills_service')
var gdaxAccountService = require('../services/gdax_accounts_service')
var gdaxTransferService = require('../services/gdax_transfer_service')

module.exports = function (app) {
    app.post("/api/gdaxUserSignUp", gdaxUserService.userSignUp)
    app.post("/api/gdaxUserLogin", gdaxUserService.userLogin)
    app.post("/api/gdaxFills", gdaxFillsService.getFillsFromGdax)

    app.post("/api/getGdaxAccounts", gdaxAccountService.getAccounts)
    app.post("/api/getGdaxTransfers", gdaxTransferService.getTransferFromGdax)
    
}