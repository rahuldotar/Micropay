var exchangeService = require('../services/exchange_service')
module.exports=function(app){
app.post("/api/convertToEther",exchangeService.convertToEther)
}
