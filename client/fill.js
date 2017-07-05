/**
 * Created by Dell on 25-07-2016.
 */
var micropayApp = angular.module('miropayApp', ['ngSanitize', 'ui.bootstrap'])

/* Area For Directives[Start] */
micropayApp.directive("airdatepicker", function () {

    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "yyyy-mm-dd",
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }

    }
});
/* Area For Directives[End] */

/* Area For Filters[Start] */
micropayApp.filter('sumByColumn', function () {
    return function (collection, column) {
        var total = 0;

        collection.forEach(function (item) {
            total += parseFloat(item[column]);
        });

        return total;
    };
})

micropayApp.filter('sumProductColumn', function () {
    return function (collection, column1, column2) {
        var sumProduct = 0;
        var meanWeight = 0;
        var total = 0;

        collection.forEach(function (item) {
            sumProduct += (parseFloat(item[column1]) * (parseFloat(item[column2])));
        });

        collection.forEach(function (item) {
            total += parseFloat(item[column1]);
        });

        meanWeight = sumProduct / total;


        return meanWeight;
    };
})
/* Area For Filters[End] */


micropayApp.controller('fillCtrl', function ($scope, $timeout, $http) {
    $scope.data = {
        fills: {},
        fill_view: true,
        selProduct: 'ETH-USD',
        selSide: 'all',
        filterStartDate: '',
        filterStartDateTime: '',
        filterEndDate: '',
        filterEndDateTime: ''
    };

    $scope.tabViewFills = function () {
        $scope.data.fill_view = true;
    };
    $scope.tabViewPosition = function () {
        $scope.data.fill_view = false;
    };

    /* Using product Filter[Start] */
    $scope.productOnChange = function (pdt) {
        $scope.data.selProduct = pdt;
        searchFills();

    };
    /* Using product Filter[End] */

    /* Using side Filter[Start] */
    $scope.sideOnChange = function (side) {
        $scope.data.selSide = side;
        searchFills();

    };
    /* Using side Filter[End] */

    /* UTC Conversion [Start] */
    var toUTCDate = function (date) {
        var _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        return _utc;
    };
    /* UTC Conversion [End] */

    function toDate(dateStr) {
        var dt = dateStr.split("-")
        var year = dt[0];
        var month = dt[1];
        var day = dt[2];
        return new Date(year, parseInt(month) - 1, day)
    }

    var toUTCDate = function (date) {
        var _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        return _utc;
    };


    /* Using date Filter[Start] */
    $scope.filterByStrtDate = function () {
        $scope.data.filterStartDateTime = toDate($scope.data.filterStartDate);
        $scope.data.fill_view?$scope.data.filterStartDateTime.setHours(0, 0, 0, 0):$scope.data.filterStartDateTime.setHours(23, 59, 59, 999);
       // $scope.data.filterStartDateTime = toUTCDate($scope.data.filterStartDateTime)
        $scope.data.fill_view?searchFills() : getFillsForPosition();
    }

    $scope.filterByEndDate = function () {
        $scope.data.filterEndDateTime = toDate($scope.data.filterEndDate);
        $scope.data.fill_view?$scope.data.filterEndDateTime.setHours(23, 59, 59, 999):$scope.data.filterEndDateTime.setHours(0, 0, 0, 0);
       // $scope.data.filterEndDateTime = toUTCDate($scope.data.filterEndDateTime)
        $scope.data.fill_view?searchFills() : getFillsForPosition();
    }
    /* Using date Filter[End] */

    /* Getting All Fills from DB[Start] */
    var getFills = function () {
        // var postData = $scope.reqData;
        var requestObj = {
            method: 'POST',
            url: '/api/gdaxFillsFromDb',
            data: {
                userKey: 'd4fa46cb54128a56400886b9e9e2839a',
                prodId: $scope.data.selProduct,
            }
        };

        $http(requestObj).success(function (data) {

            $scope.data.fills = data.result;
        }).error(function (data, err) {
data={"success":true,"result":{"9a2ce87e-366a-42c1-8294-b3e8a815f443":[{"_id":"595206ed0025db42d42a9e44","created_at":"2017-06-23T17:18:42.61Z","trade_id":6413476,"product_id":"ETH-USD","order_id":"9a2ce87e-366a-42c1-8294-b3e8a815f443","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"M","price":"324.49000000","size":"6.16792700","fee":"0.0000000000000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1498238322},{"_id":"595206ed0025db42d42a9e45","created_at":"2017-06-23T17:16:42.371Z","trade_id":6413471,"product_id":"ETH-USD","order_id":"9a2ce87e-366a-42c1-8294-b3e8a815f443","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"M","price":"324.49000000","size":"2.13207300","fee":"0.0000000000000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1498238202}],"ba46cbaa-b016-4cbb-94f2-1f7d4b052bc9":[{"_id":"595206ed0025db42d42a9e46","created_at":"2017-06-21T03:00:22.764Z","trade_id":6260694,"product_id":"ETH-USD","order_id":"ba46cbaa-b016-4cbb-94f2-1f7d4b052bc9","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"M","price":"342.00000000","size":"0.31792185","fee":"0.0000000000000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1498014022},{"_id":"595206ed0025db42d42a9e47","created_at":"2017-06-20T20:47:50.059Z","trade_id":6246831,"product_id":"ETH-USD","order_id":"ba46cbaa-b016-4cbb-94f2-1f7d4b052bc9","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"M","price":"342.00000000","size":"0.46201700","fee":"0.0000000000000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497991670},{"_id":"595206ed0025db42d42a9e48","created_at":"2017-06-20T20:47:26.964Z","trade_id":6246810,"product_id":"ETH-USD","order_id":"ba46cbaa-b016-4cbb-94f2-1f7d4b052bc9","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"M","price":"342.00000000","size":"1.55006115","fee":"0.0000000000000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497991646}],"d82be0b8-539d-4ccf-bd58-4769cbef7f9a":[{"_id":"595206ed0025db42d42a9e49","created_at":"2017-06-20T02:41:31.185Z","trade_id":6199979,"product_id":"ETH-USD","order_id":"d82be0b8-539d-4ccf-bd58-4769cbef7f9a","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"M","price":"359.99000000","size":"1.23000000","fee":"0.0000000000000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497926491}],"58bba0af-6957-46ca-a559-6216ef08ad11":[{"_id":"595206ed0025db42d42a9e4a","created_at":"2017-06-19T23:04:52.927Z","trade_id":6194412,"product_id":"ETH-USD","order_id":"58bba0af-6957-46ca-a559-6216ef08ad11","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"M","price":"357.03000000","size":"1.00000000","fee":"0.0000000000000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497913492}],"4317a28b-c781-4f14-8ff8-61e4c9f6bdbc":[{"_id":"595206ed0025db42d42a9e4b","created_at":"2017-06-18T14:51:41.211Z","trade_id":6124665,"product_id":"ETH-USD","order_id":"4317a28b-c781-4f14-8ff8-61e4c9f6bdbc","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"355.99000000","size":"3.09459507","fee":"3.3049346969079000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497797501},{"_id":"595206ed0025db42d42a9e4c","created_at":"2017-06-18T14:51:41.211Z","trade_id":6124664,"product_id":"ETH-USD","order_id":"4317a28b-c781-4f14-8ff8-61e4c9f6bdbc","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"355.98000000","size":"0.20000000","fee":"0.2135880000000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497797501},{"_id":"595206ed0025db42d42a9e4d","created_at":"2017-06-18T14:51:41.211Z","trade_id":6124663,"product_id":"ETH-USD","order_id":"4317a28b-c781-4f14-8ff8-61e4c9f6bdbc","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"355.98000000","size":"0.01525000","fee":"0.0162860850000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497797501},{"_id":"595206ed0025db42d42a9e4e","created_at":"2017-06-18T14:51:41.211Z","trade_id":6124662,"product_id":"ETH-USD","order_id":"4317a28b-c781-4f14-8ff8-61e4c9f6bdbc","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"355.96000000","size":"10.00000000","fee":"10.6788000000000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497797501},{"_id":"595206ed0025db42d42a9e4f","created_at":"2017-06-18T14:51:41.211Z","trade_id":6124661,"product_id":"ETH-USD","order_id":"4317a28b-c781-4f14-8ff8-61e4c9f6bdbc","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"355.91000000","size":"4.27297142","fee":"4.5623797742766000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497797501},{"_id":"595206ed0025db42d42a9e50","created_at":"2017-06-18T14:51:41.211Z","trade_id":6124660,"product_id":"ETH-USD","order_id":"4317a28b-c781-4f14-8ff8-61e4c9f6bdbc","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"355.90000000","size":"1.60000000","fee":"1.7083200000000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497797501},{"_id":"595206ed0025db42d42a9e51","created_at":"2017-06-18T14:51:41.211Z","trade_id":6124659,"product_id":"ETH-USD","order_id":"4317a28b-c781-4f14-8ff8-61e4c9f6bdbc","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"355.90000000","size":"13.70236813","fee":"14.6300184524010000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497797501}],"b6f3eb6a-1bd6-4bb1-bf34-cb1b435d9253":[{"_id":"595206ed0025db42d42a9e52","created_at":"2017-06-16T12:12:06.241Z","trade_id":6029878,"product_id":"ETH-USD","order_id":"b6f3eb6a-1bd6-4bb1-bf34-cb1b435d9253","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"353.01000000","size":"12.50596857","fee":"13.2441958946871000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497615126},{"_id":"595206ed0025db42d42a9e53","created_at":"2017-06-16T12:12:06.241Z","trade_id":6029877,"product_id":"ETH-USD","order_id":"b6f3eb6a-1bd6-4bb1-bf34-cb1b435d9253","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"353.01000000","size":"0.25000000","fee":"0.2647575000000000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497615126},{"_id":"595206ed0025db42d42a9e54","created_at":"2017-06-16T12:12:06.241Z","trade_id":6029876,"product_id":"ETH-USD","order_id":"b6f3eb6a-1bd6-4bb1-bf34-cb1b435d9253","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"353.01000000","size":"2.54446411","fee":"2.6946638264133000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497615126},{"_id":"595206ed0025db42d42a9e55","created_at":"2017-06-16T12:12:06.241Z","trade_id":6029875,"product_id":"ETH-USD","order_id":"b6f3eb6a-1bd6-4bb1-bf34-cb1b435d9253","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"353.01000000","size":"11.90208526","fee":"12.6046653528978000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497615126}],"3c39e6a7-97ba-41ad-825c-29ab842151c7":[{"_id":"595206ed0025db42d42a9e56","created_at":"2017-06-16T06:27:32.967Z","trade_id":6016849,"product_id":"ETH-USD","order_id":"3c39e6a7-97ba-41ad-825c-29ab842151c7","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"342.99000000","size":"6.78596299","fee":"6.9825523378203000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497594452}],"fd973b09-5503-4009-bc23-1bd5cadaac11":[{"_id":"595206ed0025db42d42a9e57","created_at":"2017-06-16T06:27:11.236Z","trade_id":6016829,"product_id":"ETH-USD","order_id":"fd973b09-5503-4009-bc23-1bd5cadaac11","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"342.99000000","size":"5.81363289","fee":"5.9820538348233000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497594431}],"2716b981-1806-4c0f-84f4-6236cc0398ec":[{"_id":"595206ed0025db42d42a9e58","created_at":"2017-06-16T06:26:57.301Z","trade_id":6016828,"product_id":"ETH-USD","order_id":"2716b981-1806-4c0f-84f4-6236cc0398ec","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"342.99000000","size":"0.66665636","fee":"0.6859693947492000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497594417},{"_id":"595206ed0025db42d42a9e59","created_at":"2017-06-16T06:26:57.301Z","trade_id":6016827,"product_id":"ETH-USD","order_id":"2716b981-1806-4c0f-84f4-6236cc0398ec","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"342.99000000","size":"5.00000000","fee":"5.1448500000000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497594417},{"_id":"595206ed0025db42d42a9e5a","created_at":"2017-06-16T06:26:57.301Z","trade_id":6016826,"product_id":"ETH-USD","order_id":"2716b981-1806-4c0f-84f4-6236cc0398ec","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"342.99000000","size":"0.14697653","fee":"0.1512344400741000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497594417}],"afa1ced0-78cb-4a38-b857-ff25696957e9":[{"_id":"595206ed0025db42d42a9e5b","created_at":"2017-06-16T06:20:48.429Z","trade_id":6016632,"product_id":"ETH-USD","order_id":"afa1ced0-78cb-4a38-b857-ff25696957e9","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"341.00000000","size":"2.92377997","fee":"2.9910269093100000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497594048}],"be38349d-3f2e-4d12-84c0-b70169ed2bfe":[{"_id":"595206ed0025db42d42a9e5c","created_at":"2017-06-16T06:20:29.737Z","trade_id":6016616,"product_id":"ETH-USD","order_id":"be38349d-3f2e-4d12-84c0-b70169ed2bfe","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"340.92000000","size":"2.76850527","fee":"2.8315164499452000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497594029},{"_id":"595206ed0025db42d42a9e5d","created_at":"2017-06-16T06:20:29.737Z","trade_id":6016615,"product_id":"ETH-USD","order_id":"be38349d-3f2e-4d12-84c0-b70169ed2bfe","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"340.89000000","size":"0.05000000","fee":"0.0511335000000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497594029},{"_id":"595206ed0025db42d42a9e5e","created_at":"2017-06-16T06:20:29.737Z","trade_id":6016614,"product_id":"ETH-USD","order_id":"be38349d-3f2e-4d12-84c0-b70169ed2bfe","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"340.89000000","size":"0.10597452","fee":"0.1083769623684000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497594029}],"b8312e31-07ce-4cb6-8411-9a7dd4e3599c":[{"_id":"595206ed0025db42d42a9e5f","created_at":"2017-06-16T06:13:29.307Z","trade_id":6016409,"product_id":"ETH-USD","order_id":"b8312e31-07ce-4cb6-8411-9a7dd4e3599c","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"339.00000000","size":"2.94102941","fee":"2.9910269099700000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497593609}],"dc6329da-7820-4a59-9fdb-11b676b5e5e2":[{"_id":"595206ed0025db42d42a9e60","created_at":"2017-06-15T13:47:32.545Z","trade_id":5938280,"product_id":"ETH-USD","order_id":"dc6329da-7820-4a59-9fdb-11b676b5e5e2","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"265.60000000","size":"11.60765194","fee":"9.2489770657920000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497534452},{"_id":"595206ed0025db42d42a9e61","created_at":"2017-06-15T13:47:32.545Z","trade_id":5938279,"product_id":"ETH-USD","order_id":"dc6329da-7820-4a59-9fdb-11b676b5e5e2","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"265.65000000","size":"23.91445398","fee":"19.0586240993610000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497534452},{"_id":"595206ed0025db42d42a9e62","created_at":"2017-06-15T13:47:32.545Z","trade_id":5938278,"product_id":"ETH-USD","order_id":"dc6329da-7820-4a59-9fdb-11b676b5e5e2","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"266.22000000","size":"0.01732700","fee":"0.0138383818200000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497534452},{"_id":"595206ed0025db42d42a9e63","created_at":"2017-06-15T13:47:32.545Z","trade_id":5938277,"product_id":"ETH-USD","order_id":"dc6329da-7820-4a59-9fdb-11b676b5e5e2","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"266.48000000","size":"0.21674181","fee":"0.1732720725864000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497534452},{"_id":"595206ed0025db42d42a9e64","created_at":"2017-06-15T13:47:32.545Z","trade_id":5938276,"product_id":"ETH-USD","order_id":"dc6329da-7820-4a59-9fdb-11b676b5e5e2","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"266.49000000","size":"1.60378000","fee":"1.2821739966000000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497534452},{"_id":"595206ed0025db42d42a9e65","created_at":"2017-06-15T13:47:32.545Z","trade_id":5938275,"product_id":"ETH-USD","order_id":"dc6329da-7820-4a59-9fdb-11b676b5e5e2","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"266.80000000","size":"0.50000000","fee":"0.4002000000000000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497534452}],"2c7fb35b-9c4d-44af-ada4-7a4e29926f07":[{"_id":"595206ed0025db42d42a9e66","created_at":"2017-06-14T18:11:00.611Z","trade_id":5853733,"product_id":"ETH-USD","order_id":"2c7fb35b-9c4d-44af-ada4-7a4e29926f07","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"365.95000000","size":"1.63466425","fee":"1.7946161468625000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497463860}],"bc1a5ebb-a718-46be-a59c-47f3f50c2c94":[{"_id":"595206ed0025db42d42a9e67","created_at":"2017-06-13T15:24:11.656Z","trade_id":5793690,"product_id":"ETH-USD","order_id":"bc1a5ebb-a718-46be-a59c-47f3f50c2c94","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"387.14000000","size":"2.06025514","fee":"2.3928215246988000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497367451}],"4f369179-82c4-4124-8deb-f7c83389fa12":[{"_id":"595206ed0025db42d42a9e68","created_at":"2017-06-12T11:09:04.072Z","trade_id":5689214,"product_id":"ETH-USD","order_id":"4f369179-82c4-4124-8deb-f7c83389fa12","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"387.82000000","size":"12.78004944","fee":"14.8690763214624000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497265744},{"_id":"595206ed0025db42d42a9e69","created_at":"2017-06-12T11:09:04.072Z","trade_id":5689213,"product_id":"ETH-USD","order_id":"4f369179-82c4-4124-8deb-f7c83389fa12","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"387.82000000","size":"0.10360000","fee":"0.1205344560000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497265744},{"_id":"595206ed0025db42d42a9e6a","created_at":"2017-06-12T11:09:04.072Z","trade_id":5689212,"product_id":"ETH-USD","order_id":"4f369179-82c4-4124-8deb-f7c83389fa12","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"387.81000000","size":"1.64436000","fee":"1.9130977548000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497265744},{"_id":"595206ed0025db42d42a9e6b","created_at":"2017-06-12T11:09:04.072Z","trade_id":5689211,"product_id":"ETH-USD","order_id":"4f369179-82c4-4124-8deb-f7c83389fa12","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"387.75000000","size":"2.35000000","fee":"2.7336375000000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497265744},{"_id":"595206ed0025db42d42a9e6c","created_at":"2017-06-12T11:09:04.072Z","trade_id":5689210,"product_id":"ETH-USD","order_id":"4f369179-82c4-4124-8deb-f7c83389fa12","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"387.75000000","size":"0.09954000","fee":"0.1157899050000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497265744},{"_id":"595206ed0025db42d42a9e6d","created_at":"2017-06-12T11:09:04.072Z","trade_id":5689209,"product_id":"ETH-USD","order_id":"4f369179-82c4-4124-8deb-f7c83389fa12","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"387.74000000","size":"1.99985169","fee":"2.3262674828418000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497265744},{"_id":"595206ed0025db42d42a9e6e","created_at":"2017-06-12T11:09:04.072Z","trade_id":5689208,"product_id":"ETH-USD","order_id":"4f369179-82c4-4124-8deb-f7c83389fa12","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"387.00000000","size":"5.00000000","fee":"5.8050000000000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497265744},{"_id":"595206ed0025db42d42a9e6f","created_at":"2017-06-12T11:09:04.072Z","trade_id":5689207,"product_id":"ETH-USD","order_id":"4f369179-82c4-4124-8deb-f7c83389fa12","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"386.80000000","size":"7.00000000","fee":"8.1228000000000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497265744},{"_id":"595206ed0025db42d42a9e70","created_at":"2017-06-12T11:09:04.072Z","trade_id":5689206,"product_id":"ETH-USD","order_id":"4f369179-82c4-4124-8deb-f7c83389fa12","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"386.78000000","size":"1.99967421","fee":"2.3203019728314000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497265744},{"_id":"595206ed0025db42d42a9e71","created_at":"2017-06-12T11:09:04.072Z","trade_id":5689205,"product_id":"ETH-USD","order_id":"4f369179-82c4-4124-8deb-f7c83389fa12","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"386.76000000","size":"0.09796000","fee":"0.1136610288000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497265744},{"_id":"595206ed0025db42d42a9e72","created_at":"2017-06-12T11:09:04.072Z","trade_id":5689204,"product_id":"ETH-USD","order_id":"4f369179-82c4-4124-8deb-f7c83389fa12","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"386.75000000","size":"0.10000000","fee":"0.1160250000000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497265744}],"35619544-6a52-4d84-88e3-44b523673076":[{"_id":"595206ed0025db42d42a9e73","created_at":"2017-06-11T15:35:33.502Z","trade_id":5643272,"product_id":"ETH-USD","order_id":"35619544-6a52-4d84-88e3-44b523673076","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"338.15000000","size":"24.26117335","fee":"24.6117473049075000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497195333},{"_id":"595206ed0025db42d42a9e74","created_at":"2017-06-11T15:35:33.502Z","trade_id":5643271,"product_id":"ETH-USD","order_id":"35619544-6a52-4d84-88e3-44b523673076","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"338.16000000","size":"1.10000000","fee":"1.1159280000000000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497195333},{"_id":"595206ed0025db42d42a9e75","created_at":"2017-06-11T15:35:33.502Z","trade_id":5643270,"product_id":"ETH-USD","order_id":"35619544-6a52-4d84-88e3-44b523673076","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"338.21000000","size":"0.10000000","fee":"0.1014630000000000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497195333},{"_id":"595206ed0025db42d42a9e76","created_at":"2017-06-11T15:35:33.502Z","trade_id":5643269,"product_id":"ETH-USD","order_id":"35619544-6a52-4d84-88e3-44b523673076","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"338.58000000","size":"7.37993000","fee":"7.4960900982000000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497195333},{"_id":"595206f90025db42d42a9e7a","created_at":"2017-06-11T15:35:33.502Z","trade_id":5643268,"product_id":"ETH-USD","order_id":"35619544-6a52-4d84-88e3-44b523673076","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"338.60000000","size":"6.35334561","fee":"6.4537284706380000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497195333}],"211d49cf-82a5-40cd-b2c7-67bc25ef823d":[{"_id":"595206f90025db42d42a9e7b","created_at":"2017-06-11T06:27:35.186Z","trade_id":5624778,"product_id":"ETH-USD","order_id":"211d49cf-82a5-40cd-b2c7-67bc25ef823d","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"344.19000000","size":"0.83380000","fee":"0.8609568660000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497162455},{"_id":"595206f90025db42d42a9e7c","created_at":"2017-06-11T06:27:35.186Z","trade_id":5624777,"product_id":"ETH-USD","order_id":"211d49cf-82a5-40cd-b2c7-67bc25ef823d","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"344.18000000","size":"1.14854872","fee":"1.1859224953488000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497162455}],"b7d3de3d-b8f0-4576-8d3b-d6af4b7e446e":[{"_id":"595206f90025db42d42a9e7d","created_at":"2017-06-11T06:19:27.411Z","trade_id":5624556,"product_id":"ETH-USD","order_id":"b7d3de3d-b8f0-4576-8d3b-d6af4b7e446e","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"343.97000000","size":"1.00000000","fee":"1.0319100000000000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497161967}],"34e2fb6d-4d5d-4ce3-89d1-7ba59840ba6b":[{"_id":"595206f90025db42d42a9e7e","created_at":"2017-06-10T18:14:07.963Z","trade_id":5576778,"product_id":"ETH-USD","order_id":"34e2fb6d-4d5d-4ce3-89d1-7ba59840ba6b","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"309.89000000","size":"8.51761201","fee":"7.9185683573367000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497118447},{"_id":"595206f90025db42d42a9e7f","created_at":"2017-06-10T18:14:07.963Z","trade_id":5576777,"product_id":"ETH-USD","order_id":"34e2fb6d-4d5d-4ce3-89d1-7ba59840ba6b","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"309.88000000","size":"3.00000000","fee":"2.7889200000000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497118447},{"_id":"595206f90025db42d42a9e80","created_at":"2017-06-10T18:14:07.963Z","trade_id":5576776,"product_id":"ETH-USD","order_id":"34e2fb6d-4d5d-4ce3-89d1-7ba59840ba6b","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"308.65000000","size":"0.17800049","fee":"0.1648195537155000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497118447},{"_id":"595206f90025db42d42a9e81","created_at":"2017-06-10T18:14:07.963Z","trade_id":5576775,"product_id":"ETH-USD","order_id":"34e2fb6d-4d5d-4ce3-89d1-7ba59840ba6b","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"308.63000000","size":"21.53455000","fee":"19.9386244995000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497118447},{"_id":"595206f90025db42d42a9e82","created_at":"2017-06-10T18:14:07.963Z","trade_id":5576774,"product_id":"ETH-USD","order_id":"34e2fb6d-4d5d-4ce3-89d1-7ba59840ba6b","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"308.63000000","size":"2.00000000","fee":"1.8517800000000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497118447},{"_id":"595206f90025db42d42a9e83","created_at":"2017-06-10T18:14:07.963Z","trade_id":5576773,"product_id":"ETH-USD","order_id":"34e2fb6d-4d5d-4ce3-89d1-7ba59840ba6b","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"308.62000000","size":"2.98193774","fee":"2.7608568759564000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497118447}],"75525b92-363f-4ef9-af08-33673ee7ad1c":[{"_id":"595206f90025db42d42a9e84","created_at":"2017-06-10T17:52:08.004Z","trade_id":5573087,"product_id":"ETH-USD","order_id":"75525b92-363f-4ef9-af08-33673ee7ad1c","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"323.41000000","size":"27.01437396","fee":"26.2101560472108000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497117128},{"_id":"595206f90025db42d42a9e85","created_at":"2017-06-10T17:52:08.004Z","trade_id":5573086,"product_id":"ETH-USD","order_id":"75525b92-363f-4ef9-af08-33673ee7ad1c","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"323.42000000","size":"4.58757980","fee":"4.4511451767480000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497117128},{"_id":"595206f90025db42d42a9e86","created_at":"2017-06-10T17:52:08.004Z","trade_id":5573085,"product_id":"ETH-USD","order_id":"75525b92-363f-4ef9-af08-33673ee7ad1c","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"323.45000000","size":"1.00000000","fee":"0.9703500000000000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497117128},{"_id":"595206f90025db42d42a9e87","created_at":"2017-06-10T17:52:08.004Z","trade_id":5573084,"product_id":"ETH-USD","order_id":"75525b92-363f-4ef9-af08-33673ee7ad1c","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"323.45000000","size":"1.00000000","fee":"0.9703500000000000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497117128},{"_id":"595206f90025db42d42a9e88","created_at":"2017-06-10T17:52:08.004Z","trade_id":5573083,"product_id":"ETH-USD","order_id":"75525b92-363f-4ef9-af08-33673ee7ad1c","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"323.49000000","size":"2.02823846","fee":"1.9683445782762000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497117128},{"_id":"595206f90025db42d42a9e89","created_at":"2017-06-10T17:52:08.004Z","trade_id":5573082,"product_id":"ETH-USD","order_id":"75525b92-363f-4ef9-af08-33673ee7ad1c","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"323.49000000","size":"1.09885000","fee":"1.0664009595000000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497117128}],"0b7ede0a-a9c6-479c-a03c-043b6622469a":[{"_id":"595206f90025db42d42a9e8a","created_at":"2017-06-09T10:55:08.678Z","trade_id":5512814,"product_id":"ETH-USD","order_id":"0b7ede0a-a9c6-479c-a03c-043b6622469a","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"263.66000000","size":"7.56283829","fee":"5.9820538306242000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1497005708}],"e24aa40a-627e-41e5-8e94-091c8b8edc9d":[{"_id":"595206f90025db42d42a9e8b","created_at":"2017-06-06T18:28:11.673Z","trade_id":5417754,"product_id":"ETH-USD","order_id":"e24aa40a-627e-41e5-8e94-091c8b8edc9d","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"260.87000000","size":"1.00000000","fee":"0.7826100000000000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1496773691}],"fa13925d-0fe1-4780-bc8b-99123c4654c7":[{"_id":"595206f90025db42d42a9e8c","created_at":"2017-06-04T13:04:24.538Z","trade_id":5313406,"product_id":"ETH-USD","order_id":"fa13925d-0fe1-4780-bc8b-99123c4654c7","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"240.00000000","size":"12.66101694","fee":"9.1159321968000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1496581464}],"63211c90-2fc0-4e68-976e-775e7af64248":[{"_id":"595206f90025db42d42a9e8d","created_at":"2017-06-01T01:45:58.857Z","trade_id":5115338,"product_id":"ETH-USD","order_id":"63211c90-2fc0-4e68-976e-775e7af64248","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"225.51000000","size":"4.93881656","fee":"3.3412575673368000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1496281558},{"_id":"595206f90025db42d42a9e8e","created_at":"2017-06-01T01:45:58.857Z","trade_id":5115337,"product_id":"ETH-USD","order_id":"63211c90-2fc0-4e68-976e-775e7af64248","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"225.50000000","size":"1.50000000","fee":"1.0147500000000000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1496281558},{"_id":"595206f90025db42d42a9e8f","created_at":"2017-06-01T01:45:58.857Z","trade_id":5115336,"product_id":"ETH-USD","order_id":"63211c90-2fc0-4e68-976e-775e7af64248","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"225.49000000","size":"0.02389800","fee":"0.0161662800600000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1496281558},{"_id":"595206f90025db42d42a9e90","created_at":"2017-06-01T01:45:58.857Z","trade_id":5115335,"product_id":"ETH-USD","order_id":"63211c90-2fc0-4e68-976e-775e7af64248","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"225.48000000","size":"0.03749600","fee":"0.0253637942400000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1496281558},{"_id":"595206f90025db42d42a9e91","created_at":"2017-06-01T01:45:58.857Z","trade_id":5115334,"product_id":"ETH-USD","order_id":"63211c90-2fc0-4e68-976e-775e7af64248","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"225.39000000","size":"0.04168600","fee":"0.0281868226200000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1496281558},{"_id":"595206f90025db42d42a9e92","created_at":"2017-06-01T01:45:58.857Z","trade_id":5115333,"product_id":"ETH-USD","order_id":"63211c90-2fc0-4e68-976e-775e7af64248","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"225.37000000","size":"0.03285900","fee":"0.0222162984900000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1496281558},{"_id":"595206f90025db42d42a9e93","created_at":"2017-06-01T01:45:58.857Z","trade_id":5115332,"product_id":"ETH-USD","order_id":"63211c90-2fc0-4e68-976e-775e7af64248","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"225.36000000","size":"0.03725600","fee":"0.0251880364800000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1496281558},{"_id":"595206f90025db42d42a9e94","created_at":"2017-06-01T01:45:58.857Z","trade_id":5115331,"product_id":"ETH-USD","order_id":"63211c90-2fc0-4e68-976e-775e7af64248","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"225.36000000","size":"3.11668800","fee":"2.1071304230400000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1496281558}],"0d010b74-9ce7-4b4f-8aa0-618e41aec166":[{"_id":"595206f90025db42d42a9e95","created_at":"2017-05-31T21:24:22.782Z","trade_id":5104977,"product_id":"ETH-USD","order_id":"0d010b74-9ce7-4b4f-8aa0-618e41aec166","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"T","price":"227.20000000","size":"8.77648743","fee":"5.9820538322880000","side":"buy","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1496265862}],"12c4d9ad-5e77-4e43-bf35-8705e2f9fa54":[{"_id":"595206f90025db42d42a9e96","created_at":"2017-05-30T15:43:28.996Z","trade_id":4993516,"product_id":"ETH-USD","order_id":"12c4d9ad-5e77-4e43-bf35-8705e2f9fa54","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"M","price":"200.00000000","size":"3.48736681","fee":"0.0000000000000000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1496159008},{"_id":"595206f90025db42d42a9e97","created_at":"2017-05-30T15:43:27.42Z","trade_id":4993514,"product_id":"ETH-USD","order_id":"12c4d9ad-5e77-4e43-bf35-8705e2f9fa54","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"M","price":"200.00000000","size":"17.36170050","fee":"0.0000000000000000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1496159007},{"_id":"595206f90025db42d42a9e98","created_at":"2017-05-30T15:43:27.419Z","trade_id":4993513,"product_id":"ETH-USD","order_id":"12c4d9ad-5e77-4e43-bf35-8705e2f9fa54","user_id":"518a85711cb9efc7bc00003a","profile_id":"f601dda7-db36-44b2-975c-68e3fd27986b","liquidity":"M","price":"200.00000000","size":"1.13039144","fee":"0.0000000000000000","side":"sell","settled":true,"userKey":"d4fa46cb54128a56400886b9e9e2839a","created_at_unix":1496159007}]}}
               $scope.data.fills = data.result;
            console.log(error)
        });
    };
    /* Getting All Fills from DB[End] */

    /* search fills[Start] */
    var searchFills = function () {
        var postData = {
            userKey: 'd4fa46cb54128a56400886b9e9e2839a',
            prodId: $scope.data.selProduct,
            side: $scope.data.selSide === 'all' ? '' : $scope.data.selSide,
            startDate: $scope.data.filterStartDateTime ? moment($scope.data.filterStartDateTime).unix() : '',
            endDate: $scope.data.filterEndDateTime ? moment($scope.data.filterEndDateTime).unix() : ''
        }

        // var postData = $scope.reqData;
        var requestObj = {
            method: 'POST',
            url: '/api/gdaxSearchFillsFromDb',
            data:postData

        };

        $http(requestObj).success(function (data) {
             $scope.data.fills = data.result;
        }).error(function (data, err) {
            console.log(error)
        });
    }
    /* search fills[End] */

    /* Getting fills for calculating position[Start] */
    var getFillsForPosition = function(){
        var postData = {
            userKey: 'd4fa46cb54128a56400886b9e9e2839a',
            prodId: $scope.data.selProduct,
            side: $scope.data.selSide === 'all' ? '' : $scope.data.selSide,
            startDate: $scope.data.filterStartDateTime ? moment($scope.data.filterStartDateTime).unix() : '',
            endDate: $scope.data.filterEndDateTime ? moment($scope.data.filterEndDateTime).unix() : ''
        }

        // var postData = $scope.reqData;
        var requestObj = {
            method: 'POST',
            url: '/api/gdaxTradePosition',
            data:postData
        };

        $http(requestObj).success(function (data) {
            //$scope.data.fills = data.result;

        }).error(function (data, err) {
            console.log(error)
        });

    };
    /* Getting fills for calculating position[End] */


    $scope.alertclick = function(){
        $('.mob_cards').addClass('act');
    }

   
    $scope.name = 'World';
    $scope.group = {
        isOpen: true
    };

    $scope.sessions = {
        list: [{
                title: 'foo',
                description: 'fooooo',
                time_from: new Date(),
                time_to: new Date(),
                isOpen: false,
            },
            {
                title: 'bar',
                description: 'barrrr',
                time_from: new Date(),
                time_to: new Date(),
                isOpen: true,
            },
            {
                title: 'baz',
                description: 'bazzzz',
                time_from: new Date(),
                time_to: new Date(),
                isOpen: false,
            },
        ]
    };

    getFills();
});