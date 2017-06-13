var request = require('request');
var moment = require('moment');
var geminiExchangeRatesDAL = require('../DAL/gemini_exchange_dal')

var geminiExchangeSVC = {};

geminiExchangeSVC.saveCurrentExchangeRates = function () {
    var investment = 10000;
    console.log('cron starts')
    request({
        url: 'https://api.gemini.com/v1/pubticker/btcusd', //URL to hit
        method: 'GET', // specify the request type
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);
            var btcUsdObj = JSON.parse(body);
            var btcPerInverstment = investment/btcUsdObj.ask;
            request({
                url: 'https://api.gemini.com/v1/pubticker/ethusd', //URL to hit
                method: 'GET', // specify the request type
            }, function (error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(response.statusCode, body);
                    var ethUsdObj = JSON.parse(body);
                    request({
                        url: 'https://api.gemini.com/v1/pubticker/ethbtc', //URL to hit
                        method: 'GET', // specify the request type
                    }, function (error, response, body) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(response.statusCode, body);
                            var ethBtcObj = JSON.parse(body);
                            var etherForBTC = 1/ethBtcObj.ask;
                            var etherForTotalBTC = etherForBTC * btcPerInverstment;
                            var returnForInvestment = etherForTotalBTC * ethUsdObj.bid;

                            geminiExchangeRatesDAL.saveExchangerates(btcUsdObj, ethUsdObj, ethBtcObj,investment,returnForInvestment, function (result) {
                                if (!result.success) {
                                    console.log('saving exchange rates error')
                                } else {
                                    console.log('saving exchange rates success')
                                }

                            })
                        }
                    });

                }
            });


        }
    });
}

// geminiExchangeSVC.saveCurrentExchangeRates = function () {
//     console.log('cron starts')
//     request({
//         url: 'https://api.gemini.com/v1/pubticker/btcusd', //URL to hit
//         method: 'GET', // specify the request type
//     }, function (error, response, body) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log(response.statusCode, body);
//             var btcUsdObj = JSON.parse(body);
//             request({
//                 url: 'https://api.gemini.com/v1/pubticker/ethusd', //URL to hit
//                 method: 'GET', // specify the request type
//             }, function (error, response, body) {
//                 if (error) {
//                     console.log(error);
//                 } else {
//                     console.log(response.statusCode, body);
//                     var ethUsdObj = JSON.parse(body);
//                     request({
//                         url: 'https://api.gemini.com/v1/pubticker/ethbtc', //URL to hit
//                         method: 'GET', // specify the request type
//                     }, function (error, response, body) {
//                         if (error) {
//                             console.log(error);
//                         } else {
//                             console.log(response.statusCode, body);
//                             var ethBtcObj = JSON.parse(body);

//                             geminiExchangeRatesDAL.saveExchangerates(btcUsdObj, ethUsdObj, ethBtcObj, function (result) {
//                                 if (!result.success) {
//                                     console.log('saving exchange rates error')
//                                 } else {
//                                     console.log('saving exchange rates success')
//                                 }

//                             })
//                         }
//                     });

//                 }
//             });


//         }
//     });
// }

geminiExchangeSVC.buyCrypto = function (req, res) {
    console.log("check" + req.body.type)
    request({
        url: 'https://api.sandbox.gemini.com/v1/pubticker/' + req.body.type, //URL to hit
        method: 'GET', // specify the request type
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);
            var obj = JSON.parse(body);
            placeOrder(req.body.type, obj.ask, "buy")
        }
    });
};


geminiExchangeSVC.sellCrypto = function (req, res) {
    console.log("check" + req.body.type)
    request({
        url: 'https://api.sandbox.gemini.com/v1/pubticker/' + req.body.type, //URL to hit
        method: 'GET', // specify the request type
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);
            var obj = JSON.parse(body);
            placeOrder(req.body.type, obj.bid, "sell")
        }
    });
};

module.exports = geminiExchangeSVC;


function placeOrder(type, lastPrice, side) {
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