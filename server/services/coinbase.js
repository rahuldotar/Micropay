/* Importing & initializing Coinbase Client[Start] */
var CoinBaseClient = require('coinbase').Client;
var cbc = new CoinBaseClient({'apiKey': 'API KEY', 
                         'apiSecret': 'API SECRET'});
/* Impoting & initializing Coinbase Client[End] */                         

/* get Exchange rates from coinbase client[Start] */
// For BTC
var exchangeRatesBTC ={};
cbc.getExchangeRates({'currency': 'BTC'}, function(err, rates) {
  exchangeRates = rates;    
  console.log(rates);
});

// For ETH
var exchangeRatesETH ={};
cbc.getExchangeRates({'currency': 'ETH'}, function(err, rates) {
  exchangeRates = rates;    
  console.log(rates);
});
/* get Exchange rates from coinbase client[End] */

/* Exporting the exchange rates[Start] */
module.exports={

  // Function to export BTC exchange rates
  getBTCCurrencyExchangeRates: function(req,res){
     res.status(200).json({
        result: exchangeRates
    });
  },

  // Function to export ETH exchange rates
  getETHCurrencyExchangeRates: function(req,res){
     res.status(200).json({
        result: exchangeRates
    });
  }
}
/* Exporting the exchange rates[End] */