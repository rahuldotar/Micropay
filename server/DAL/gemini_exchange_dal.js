var GeminiExchangeDB = require('../models/gemini_exchange_model')

var geminiExchangeDAL = {};

geminiExchangeDAL.saveExchangerates = function (userData, callBack) {
    var geminiExchangeDB = new GeminiExchangeDB({
        btcUsd: {
            ask: btcUsd.ask,
            bid: btcUsd.bid
        },
        ethUsd: {
            ask: ethUsd.ask,
            bid: ethUsd.bid
        },
        ethBtc: {
            ask: ethBtc.ask,
            bid: ethBtc.bid
        },
        investment:investment,
        returns:returns
    });

    geminiExchangeDB.save(function (err, data) {
        if (err) {
            var result = {
                'success': false,
                'error': err
            };
            callBack(result);
        } else {
            var result = {
                'success': true,
                'data': 'Rate successfully saved'
            };
            callBack(result);
        }
    });
}

module.exports = geminiExchangeDAL;