var exchangeService = require('../services/exchange_service')
var paymentService = require('../services/payment_service')
var geminiExchngService = require('../services/gemini_exchange_service')

module.exports = function (app) {
   // app.post("/api/convertToEther", exchangeService.convertToEther)
    app.post("/api/getIavToken", paymentService.getIavToken)
    app.post("/api/doPayment", paymentService.doPayment)
    app.post("/api/buyCrypto", geminiExchngService.buyCrypto)
    app.post("/api/sellCrypto", geminiExchngService.sellCrypto)
    app.post("/api/saveCrypto", geminiExchngService.saveCurrentExchangeRates)
    app.post("/api/genAccess", paymentService.getAccessToken)
}