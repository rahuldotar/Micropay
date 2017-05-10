var CoinBaseClient = require('coinbase').Client;
var cbc = new CoinBaseClient({'apiKey': 'API KEY', 
                         'apiSecret': 'API SECRET'});

var exchangeRates ={};
cbc.getExchangeRates({'currency': 'BTC'}, function(err, rates) {
  exchangeRates = rates;    
  console.log(rates);
});

module.exports={
  getCurrencyExchangeRates: function(req,res){
     res.status(200).json({
        result: exchangeRates
    });
  }
}
