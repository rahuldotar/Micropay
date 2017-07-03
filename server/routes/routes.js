var exchangeService = require('../services/exchange_service')
var paymentService = require('../services/payment_service')
var geminiExchngService = require('../services/gemini_exchange_service')
var gdaxUserService = require('../services/gdax_user_service')
var gdaxFillsService = require('../services/gdax_fills_service')

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
    app.post("/api/gdaxPosition", gdaxFillsService.getGdaxCurrentPosition)
}