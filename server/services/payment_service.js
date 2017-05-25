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

/* dwolla init[Start]  */
const dwolla = require('dwolla-v2');

// Authenticating with dwolla app credentials
const appKey = 'ndryydFyXtJmrcYjyom5zVaWzOhPzo0vgTr1lwuvdqxYKOEVyC';
const appSecret = 'CmjqeGkOoh5IQXnoRT8M5KiX2V9MVWdmUNzyKkBCfHMKvjbFOU';
const client = new dwolla.Client({
  key: appKey,
  secret: appSecret,
  environment: 'sandbox' // optional - defaults to production
});
/* dwolla init [end] */


var accountToken = {};
var iavToken = '';
var customerURL = '';
client.auth.client()
  .then(function (appToken) {
    accountToken = appToken
    return appToken.get('webhook-subscriptions');
  })
  .then(function (res) {
    console.log(JSON.stringify(res.body));
  });


module.exports = self = {
  /* Creating a customer and get send IAV token(Instant account verification token)[Start] */
  getIavToken: function (req, res) {
    // creating a customer
    var requestBody = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      ipAddress: '99.99.99.99'
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
        currency: 'GBP',
        value: req.body.amount
      },
      metadata: {
        foo: 'bar',
        baz: 'boo'
      }
    };

    accountToken
      .post('transfers', requestBody)
      .then(function (resp) {
        var amountOFEth = req.body.amount / exchangeRatesETH.USD;
        res.status(200).json({
          success: true,
          result: amountOFEth
        });
        //  res.headers.get('location');
        //gettrnsfrStatus(); // => 'https://api.dwolla.com/transfers/d76265cd-0951-e511-80da-0aa34a9b2388'
      });

  }

};


function load() {
  //  var requestBody = {
  //   firstName: 'Ravi',
  //   lastName: 'Accubits',
  //   email: 'raveedndran@accubits.com',
  //   ipAddress: '99.99.99.99'
  // };

  // accountToken
  //   .post('customers', requestBody)
  //   .then(function(res) {
  //     res.headers.get('location'); // => 'https://api-sandbox.dwolla.com/customers/247b1bd8-f5a0-4b71-a898-f62f67b8ae1c'
  //   });
  // Using dwolla-v2 - https://github.com/Dwolla/dwolla-v2-node
  //var customerUrl = 'https://api-sandbox.dwolla.com/customers/259c6a1b-c287-455b-95d6-4fc4e975bbcf';

  // accountToken
  //   .post(`${customerUrl}/iav-token`)
  //   .then(function(res) {
  //     res.body.token; 
  //     console.log(res.body.token)// => 'lr0Ax1zwIpeXXt8sJDiVXjPbwEeGO6QKFWBIaKvnFG0Sm2j7vL'
  //   });

  // accountToken
  //   .get('/')
  //   .then(function (res) {
  //     console.log( res.body._links.account.href);
  //  });



  var requestBody = {
    _links: {
      source: {
        href: 'https://api-sandbox.dwolla.com/funding-sources/f197eba4-3762-40e6-a896-452dee3bab4a'
      },
      destination: {
        href: 'https://api-sandbox.dwolla.com/accounts/bca27f25-c809-4f4f-83e7-bd403a8f173b'
      }
    },
    amount: {
      currency: 'GBP',
      value: '200.00'
    },
    metadata: {
      foo: 'bar',
      baz: 'boo'
    }
  };

  var transferUrl = ''
  accountToken
    .post('transfers', requestBody)
    .then(function (res) {
      transferUrl = res.headers.get('location');
      gettrnsfrStatus(); // => 'https://api.dwolla.com/transfers/d76265cd-0951-e511-80da-0aa34a9b2388'
    });

  function gettrnsfrStatus() {
    accountToken
      .get(transferUrl)
      .then(function (res) {
        res.body.status; // => 'pending'
      });

  }

};