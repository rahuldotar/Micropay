var GdaxFillsDB = require('../models/gdax_fills_model')
var profitAndLossDal = {};
var queryParamsFills = {};

/* Getting Fills from Gdax API[Start] */
profitAndLossDal.calculateProfitAndLoss = function (searchFilter, callBack) {

    // Creating a schema instance  
    var gdaxFillsDB = new GdaxFillsDB();

    // Finding records from DB using aggrgate
    gdaxFillsDB.collection.aggregate(
        [{
                $match: {
                    userId: searchFilter.sessionValue,
                    product_id: searchFilter.prodId
                }
            },
            {
                $group: {
                    _id: "$side",
                    totalPrice: {
                        $sum: "$price"
                    },
                    totalSize: {
                        $sum: "$size"
                    },
                    totalFee: {
                        $sum: "$fee"
                    },

                }
            },

        ],
        function (err, data) {
            if (err) {
                var result = {
                    'success': false,
                    'error': err
                };
                callBack(result);
            } else {
                //  var reqCurrPosition = groupArray(data, 'currency');
                calculatePnL(data, searchFilter.prodId, function (result) {
                    var currentPrices = data;
                    var result = {
                        'success': true,
                        'data': {
                            currPos: reqCurrPosition,
                            currPrices: currentPrices
                        }
                    }
                    callBack(result)

                })
            }
        });

};

/*  Function to calculate profit and loss[Start] */
var calculatePnL = function (data, prod, callBack) {
    var buyDetails = data[0];
    var sellDeatils = data[1];

    var effetiveTotalBuy = buyDetails.totalPrice + buyDetails.totalFee
    var effectiveTotalSell = sellDeatils.totalPrice + sellDeatils.totalSize;

    var effectivePricePerUnitBuy = effetiveTotalBuy / buyDetails.totalSize;
    var effectivePricePerUnitSell = effectiveTotalSell / sellDeatils.totalSize;

    var effetiveTotalBuy = effectivePricePerUnitBuy * buyDetails.totalSize;
    var effectiveTotalSell = effectivePricePerUnitSell * sellDeatils.totalSize;

    var temp = sellDeatils.totalSize * effectivePricePerUnitBuy;

    var result  ={};

     result.recPnL = effectiveTotalSell - temp


    // searchFilter.prodId
    // var publicClient = new Gdax.PublicClient(prod);
    // publicClient.getProductTicker(function (err, res, data) {
    //     result.unRecPnL  = (data.price * (sellDeatils.totalSize - buyDetails.totalSize)) 
    // });
}
/* Function to calculate profit and loss[End] */
module.exports = profitAndLossDal;