var coinBaseService = require('../services/coinbase.js')
module.exports=function(app){

// Registering API routes for getting currency exchange rates  
app.post("/getBTCCurrencyExchangeRates" , coinBaseService.getBTCCurrencyExchangeRates);
app.post("/getETHCurrencyExchangeRates" , coinBaseService.getETHCurrencyExchangeRates);

}
