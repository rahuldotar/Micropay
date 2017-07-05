var exchangeService = require('../services/exchange_service')
var paymentService = require('../services/payment_service')
var geminiExchngService = require('../services/gemini_exchange_service')
var gdaxUserService = require('../services/gdax_user_service')
var gdaxFillsService = require('../services/gdax_fills_service')
var gdaxAccountService = require('../services/gdax_accounts_service')
var gdaxTransferService = require('../services/gdax_transfer_service')
var gdaxPositionService = require('../services/gdax_position_service')

module.exports = function (app) {
    // app.post("/api/convertToEther", exchangeService.convertToEther)
    app.post("/api/getIavToken", paymentService.getIavToken)
    app.post("/api/doPayment", paymentService.doPayment)
    app.post("/api/buyCrypto", geminiExchngService.buyCrypto)
    app.post("/api/sellCrypto", geminiExchngService.sellCrypto)
    app.post("/api/saveCrypto", geminiExchngService.saveCurrentExchangeRates)
    app.post("/api/genAccess", paymentService.getAccessToken)
    app.post("/api/gdaxUser", gdaxUserService.saveUser)
    app.post("/api/gdaxFills", gdaxFillsService.getFillsFromGdax)
    app.post("/api/gdaxFillsFromDb", gdaxFillsService.getfillsFromDb)
    app.post("/api/gdaxSearchFillsFromDb", gdaxFillsService.searchFillsFromDb)
    app.post("/api/gdaxTradePosition", gdaxFillsService.getDataForTradePositions)
    
    // API Routes for Gdax transfers
    app.post("/api/getGdaxAccounts", gdaxAccountService.getAccounts)
    app.post("/api/getGdaxTransfers", gdaxTransferService.getTransferFromGdax)
    app.post("/api/filterGdaxPosition", gdaxPositionService.getGdaxPosition)


}