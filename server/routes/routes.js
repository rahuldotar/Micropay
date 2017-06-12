var exchangeService = require('../services/exchange_service')
var paymentService = require('../services/payment_service')

module.exports = function (app) {
    app.post("/api/convertToEther", exchangeService.convertToEther)
    app.post("/api/getIavToken", paymentService.getIavToken)
    app.post("/api/doPayment", paymentService.doPayment)
    app.post("/api/buyCrypto", paymentService.buyCrypto)
    app.post("/api/sellCrypto", paymentService.sellCrypto)
    app.post("/api/genAccess", paymentService.getAccessToken)
}