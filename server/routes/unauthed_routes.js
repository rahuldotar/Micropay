var gdaxUserService = require('../services/gdax_user_service')

module.exports = function (app) {
 app.post("/api/gdaxUserSignUp", gdaxUserService.userSignUp)
}