/* Importing & initializing Coinbase Client[Start] */
var request = require('request');
var CoinBaseClient = require('coinbase').Client;
var cbc = new CoinBaseClient({
  'apiKey': 'API KEY',
  'apiSecret': 'API SECRET'
});
/* Impoting & initializing Coinbase Client[End] */

/* get Exchange rates from coinbase client[Start] */
// For ETH
var exchangeRatesETH = {};
cbc.getExchangeRates({
  'currency': 'ETH'
}, function (err, rates) {
 //  console.log(rates)
   exchangeRatesETH = rates.data.rates;
});
/* get Exchange rates from coinbase client[End] */

/* Converting input currency to ether[Start] */
module.exports = {

  // Function to get base currency conveersion rate
  convertToEther: function (req, res) {
    // Calling 3rd party api to get exchange rates
    request.get({
      url: "http://apilayer.net/api/live?access_key=cc477401f6aeffcc0ceef97bc923441e&currencies=USD,"+req.body.currencyType+"&format=1"
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        // reading request(from client) paramters
        var amountToConvert = parseFloat(req.body.amount);
      //  console.log(req.body.amount);
     
       // reading response body from 3rd party API
        var obj = JSON.parse(body);
        console.log(obj.quotes)
        var baseRate = obj.quotes['USD' + req.body.currencyType];

        // converting to USD then to Ether
        var usdAmountAfterConversion = amountToConvert / baseRate;
        var amountOFEth = usdAmountAfterConversion / exchangeRatesETH.USD;

        // Prapare and send response to client 
        res.status(200).json({
          success: true,
          result: amountOFEth
        });
       }
    });
  }
}
/* Converting input currency to ether[End] */