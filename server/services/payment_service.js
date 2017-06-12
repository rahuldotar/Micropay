// importing required modules
const dwolla = require('dwolla-v2');
const CryptoJS = require("crypto-js");
var request = require('request');
var moment = require('moment');
/* dwolla init[Start]  */

// Authenticating with dwolla app credentials
const appKey = 'ndryydFyXtJmrcYjyom5zVaWzOhPzo0vgTr1lwuvdqxYKOEVyC';
const appSecret = 'CmjqeGkOoh5IQXnoRT8M5KiX2V9MVWdmUNzyKkBCfHMKvjbFOU';
const client = new dwolla.Client({
  key: appKey,
  secret: appSecret,
  environment: 'sandbox' // optional - defaults to ``production``
});
/* dwolla init [end] */


var accountToken = {};
var iavToken = '';
var customerURL = '';

module.exports = self = {
  /* get Acces token on app init[Start] */
  getAccessToken: function (req, res) {
    client.auth.client()
      .then(function (appToken) {
        accountToken = appToken
        console.log(accountToken);
        return appToken.get('webhook-subscriptions');
      })
      .then(function (resp) {
        console.log(JSON.stringify(resp.body));
      });
  },

  /* get Acces token on app init[End] */

  /* Creating a customer and get send IAV token(Instant account verification token)[Start] */
  getIavToken: function (req, res) {
    // creating a customer
    var requestBody = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      ipAddress: '99.99.99.99',
      merchant: ''
    };

    accountToken
      .post('customers', requestBody)
      .then(function (resp) {
        customerURL = resp.headers.get('location'); // => 'https://api-sandbox.dwolla.com/customers/247b1bd8-f5a0-4b71-a898-f62f67b8ae1c'
        accountToken
          .post(`${customerURL}/iav-token`)
          .then(function (resp) {
            iavToken = resp.body.token;
            console.log(resp.body.token); // => 'lr0Ax1zwIpeXXt8sJDiVXjPbwEeGO6QKFWBIaKvnFG0Sm2j7vL'
            res.status(200).json({
              success: true,
              result: iavToken
            });
          });
      })
  },
  /* Create and send IAV token[End] */

  /* Recieve payment[Start] */
  doPayment: function (req, res) {
    request({
      url: 'https://api.gemini.com/v1/pubticker/ethusd', //URL to hit
      method: 'GET', // specify the request type
    }, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        console.log(response.statusCode, body);
        var obj = JSON.parse(body);
        var askRate = parseFloat(obj.ask);
        // Preparing transfer object[Start]
        var requestBody = {
          _links: {
            source: {
              href: req.body.fundingResrcURL
            },
            destination: {
              href: 'https://api-sandbox.dwolla.com/accounts/bca27f25-c809-4f4f-83e7-bd403a8f173b'
            }
          },
          amount: {
            currency: 'USD',
            value: req.body.amount
          },
          metadata: {
            foo: 'bar',
            baz: 'boo'
          }
        };
        // Preparing transfer object[End]

        // transfer funding source and send ether
        accountToken
          .post('transfers', requestBody)
          .then(function (resp) {
            var tenPercOfAsk = (askRate * 10) / 100;
            var askRateWithProfit = askRate + tenPercOfAsk
            var amountOFEth = req.body.amount / askRateWithProfit
            res.status(200).json({
              success: true,
              result: amountOFEth
            });
            //  res.headers.get('location');
            //gettrnsfrStatus(); // => 'https://api.dwolla.com/transfers/d76265cd-0951-e511-80da-0aa34a9b2388'
          });
      }
    });
  },

  buyCrypto: function (req,res) {
    console.log("check"+ req.body.type )
    request({
      url: 'https://api.gemini.com/v1/pubticker/' +  req.body.type, //URL to hit
      method: 'GET', // specify the request type
    }, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        console.log(response.statusCode, body);
        var obj = JSON.parse(body);
        placeOrder( req.body.type,obj.ask, "buy")
      }
    });
  },


 sellCrypto: function (req,res) {
    console.log("check"+ req.body.type )
    request({
      url: 'https://api.gemini.com/v1/pubticker/' +  req.body.type, //URL to hit
      method: 'GET', // specify the request type
    }, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        console.log(response.statusCode, body);
        var obj = JSON.parse(body);
        placeOrder( req.body.type,obj.bid, "sell")
      }
    });
  },
};



function placeOrder(type,lastPrice,side) {
  var nonce = moment().unix();
  var reqJson = {
    "request": "/v1/order/new",
    "nonce": nonce,
    "symbol": type,
    "amount": "1.00",
    "price": lastPrice,
    "side": side,
    "type": "exchange limit",
    "options": ["immediate-or-cancel"]
  };

  var regJsonStr = JSON.stringify(reqJson);

  // creating base 64 payload
  var buffer = new Buffer(regJsonStr);
  var payload = buffer.toString('base64');
  console.log(" encoding to base 64 " + payload);

  // creating dig signature with key
  var signature = CryptoJS.HmacSHA384(payload, "LqvLpvL4G1FwAmfCfMXGBLT8brp");
  console.log(signature);


  //Lets configure and request
  request({
    url: 'https://api.sandbox.gemini.com//v1/order/new', //URL to hit
    method: 'POST', // specify the request type
    headers: { // speciyfy the headers
      'Content-Length': 0,
      'X-GEMINI-APIKEY': 'Dzmq7KXvo9v15sRU8HYN',
      'X-GEMINI-PAYLOAD': payload,
      'X-GEMINI-SIGNATURE': signature,
      'Content-Type': 'text/plain'
    },
  }, function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      console.log(response.statusCode, body);
    }
  });

}