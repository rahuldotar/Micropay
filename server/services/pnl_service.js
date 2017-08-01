var pnlDal = require('../DAL/pnl_dal')

// initializing objects needed
var profitAndLossSVC = {};
var queryParamsFills = {};

/* Getting Fills from Gdax API[Start] */
profitAndLossSVC.getProfitAndLoss = function (req,res) {

  pnlDal.calculateProfitAndLoss(req.body,function (result) {
        if (!result.success) {
            res.status(512).json({
                success: false,
                result: result
            });
        } else {
            var groupByOrderId = groupArray(result.data, 'order_id')
            res.status(200).json({
                success: true,
                result: groupByOrderId
            });
        }
    })
}
/* Getting Fills from Gdax API[End] */

module.exports = profitAndLossSVC;