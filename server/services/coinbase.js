/* Importing & initializing Coinbase Client[Start] */
var CoinBaseClient = require('coinbase').Client;
var cbc = new CoinBaseClient({'apiKey': 'API KEY', 
                         'apiSecret': 'API SECRET'});
/* Impoting & initializing Coinbase Client[End] */                         

/* get Exchange rates from coinbase client[Start] */
var exchangeRates ={};
cbc.getExchangeRates({'currency': 'BTC'}, function(err, rates) {
  exchangeRates = rates;    
  console.log(rates);
});
/* get Exchange rates from coinbase client[End] */

/* Exporting the exchange rates[Start] */
module.exports={
  getCurrencyExchangeRates: function(req,res){
     res.status(200).json({
        result: exchangeRates
    });
  }
}
/* Exporting the exchange rates[End] */