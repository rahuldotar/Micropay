/**
 * Created by Dell on 25-07-2016.
 */
var micropayApp = angular.module('miropayApp', ['ngSanitize', 'toastr', 'ui.bootstrap', 'ngCookies'])

/* config for toastr[Start] */
micropayApp.config(function (toastrConfig) {
    angular.extend(toastrConfig, {
        maxOpened: 1,
        closeButton: true,
        preventOpenDuplicates: true,
        tapToDismiss: false,
        timeOut: 7000,
        extendedTimeOut: 7000,
        positionClass: 'toast-bottom-right',

    });
});
/* config for toastr[End] */

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
                },
                maxDate: new Date()
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


micropayApp.controller('fillCtrl', function ($scope, toastr, $timeout, $filter, $http, $cookieStore) {

    /* INIT scope valiables[Start] */
    var reset = function () {
        $scope.data = {
            fills: {},
            fill_view: true,
            transfer_view: false,
            position_view: false,
            selProduct: 'ETH-USD',
            selSide: 'all',
            filterStartDate: '',
            filterStartDateTime: '',
            filterEndDate: '',
            filterEndDateTime: '',
            positionDetails: '',
            transfers: [],
            selTrnsfrtype: 'all',
            currPosBTC: 0,
            currPosETH: 0,
            currPosLTC: 0,
            currPosUSD: 0,
            priceDetails: {}
            //   selRow:-1
            //clsMbl: true
        };
    };
    $scope.view = {};
    $scope.view.showLoader = false;

    /* AREA FOR MOBILE VIEW[START] */
    var resetTabview = function () {
        angular.element('#chkSize').addClass('act');
        angular.element('#chkPrice').addClass('act');
        angular.element('#chkFee').addClass('act');
        angular.element('#chkTotal').addClass('act');
        angular.element('#chkEffcprice').addClass('act');
    };

    var mq = window.matchMedia("(min-width: 639px)");
    if (!mq.matches) {
        resetTabview();
    }

    $scope.diplayColumn = function (clmId) {
        if (mq.media = "(min-width: 639px)") {
            // if(angular.element('#' + clmId).hasClass('act')){
            //     angular.element('#' + clmId).removeClass('act')
            //     return;
            // }
            if (angular.element('#' + clmId).hasClass('act')) {
                if (angular.element('.filt_chck.act').length > 5) {
                    angular.element('#' + clmId).removeClass('act')
                    toastr.error('Only 5 fields are allowed in display', '');
                }
            }


        }

    };
    /* AREA FOR MOBILE VIEW[END] */

    $scope.sumFilter = $filter("sumByColumn");
    $scope.sumProductFilter = $filter("sumProductColumn");

    //  $scope.data.clsMbl = false;
    /* INIT scope valiables[End] */

    $scope.closeMobCards = function () {
        $('.mob_cards').removeClass('activate');
        resetMobView();
    };

    $scope.mobViewOpen = function (filter1, filter2, name, item) {
        $('.mob_cards').addClass('activate');
        $scope.mobView.name = name;
        $scope.mobView.details = item;
    };


    $scope.tabViewFills = function () {
        //show Loader
        $scope.view.showLoader = true;
        reset();
    //    $scope.productOnChange();
        $scope.data.fill_view = true;
        $scope.data.position_view = false;
        $scope.data.transfer_view = false;
        angular.element(document.querySelector('#selPrdt')).html("ETH-USD")
        angular.element(document.querySelector('#selSide')).html('All')
        getFills();
    };
    $scope.tabViewPosition = function () {
        //    reset();
        //show Loader
        $scope.view.showLoader = true;
        $scope.data.fill_view = false;
        $scope.data.position_view = true;
        $scope.data.transfer_view = false;
        filterPosition();
    };

    $scope.tabViewTrnsfr = function () {
        reset();
        //show Loader
        $scope.view.showLoader = true;
        $scope.data.fill_view = false;
        $scope.data.position_view = false;
        $scope.data.transfer_view = true;
       // $scope.productOnChange();
        angular.element(document.querySelector('#selSide')).html('All')
        angular.element(document.querySelector('#selPrdt')).html("ETH-USD")
        getTransfers();

    };

    /* Using product Filter[Start] */
    $scope.productOnChange = function (pdt) {
        $scope.data.selProduct = pdt;
        if ($scope.data.fill_view) {
            searchFills();
            return;
        }

        if ($scope.data.transfer_view) {
            searchTransfers();
            return;
        }
    };
    /* Using product Filter[End] */

    /* Using side Filter[Start] */
    $scope.sideOnChange = function (side) {
        angular.element(document.querySelector('#selSide')).html(side)
        $scope.data.selSide = side;
        if ($scope.data.fill_view) {
            searchFills();
            return;
        }

        if ($scope.data.transfer_view) {
            searchTransfers();
            return;
        }

        if ($scope.data.position_view) {
            filterPosition();
        }

    };
    /* Using side Filter[End] */

    /* DATE MANAGEMENT AREA[START] */
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
        $scope.data.filterStartDateTime.setHours(0, 0, 0, 0);
        // $scope.data.filterStartDateTime = toUTCDate($scope.data.filterStartDateTime)
        if ($scope.data.fill_view) {
            searchFills();
            return;
        }

        if ($scope.data.transfer_view) {
            searchTransfers();
            return;
        }

        if ($scope.data.position_view) {
            filterPosition();
            return;
        }
    }

    $scope.filterByEndDate = function () {
        $scope.data.filterEndDateTime = toDate($scope.data.filterEndDate);
        $scope.data.filterEndDateTime.setHours(23, 59, 59, 999);

        if ($scope.data.fill_view) {
            searchFills();
            return;
        }

        if ($scope.data.transfer_view) {
            searchTransfers();
            return;
        }
    }
    /* Using date Filter[End] */
    /* DATE MANAGEMENT AREA[END   ] */

    /* AREA FOR FILLS TAB[START] */

    /* Getting All Fills from DB[Start] */
    var getFills = function () {
        //show Loader
        $scope.view.showLoader = true;

        var requestObj = {
            method: 'POST',
            url: '/api/gdaxFillsFromDb',
            data: {
                token: $cookieStore.get('userToken'),
                prodId: (angular.element('#selPrdt')[0].innerText).trim()
            }
        };

        $http(requestObj).success(function (data) {
            //hide Loader
            $scope.view.showLoader = false;
            $scope.data.fills = data.result;
        }).error(function (data, err) {
            //hide Loader
            $scope.view.showLoader = false;
            $scope.data.fills = data.result;
            console.log(error)
        });
    };
    /* Getting All Fills from DB[End] */

    /* search fills[Start] */
    var searchFills = function () {
        //show Loader
        $scope.view.showLoader = true;
        var postData = {
            token: $cookieStore.get('userToken'),
            prodId: $scope.data.selProduct,
            side: $scope.data.selSide === 'all' ? '' : $scope.data.selSide,
            startDate: $scope.data.filterStartDateTime ? moment($scope.data.filterStartDateTime).unix() : '',
            endDate: $scope.data.filterEndDateTime ? moment($scope.data.filterEndDateTime).unix() : '',
        }

        // var postData = $scope.reqData;
        var requestObj = {
            method: 'POST',
            url: '/api/gdaxSearchFillsFromDb',
            data: postData

        };

        $http(requestObj).success(function (data) {
            //hide Loader
            $scope.view.showLoader = false;
            $scope.data.fills = data.result;
        }).error(function (data, err) {
            //hide Loader
            $scope.view.showLoader = false;
            if (err === 404) {
                $scope.data.fills = [];
            }
            toastr.error(data.error, '');
        });
    }
    /* search fills[End] */

    /* AREA FOR FILLS TAB[END] */

    /* AREA FOR POSITION TAB[START] */

    /* Getting current Position position[Start] */
    var getCurrentPosition = function () {
        //show Loader
        $scope.view.showLoader = true;
        if ($scope.data.filterStartDateTime && (moment($scope.data.filterStartDateTime).format("DD/MM/YYYY") !== moment(new Date()).format("DD/MM/YYYY"))) {
            filterPosition();
            return;
        }
        var postData = {
            token: $cookieStore.get('userToken'),
        }

        // var postData = $scope.reqData;
        var requestObj = {
            method: 'POST',
            url: '/api/getCurrentPosition',
            data: postData
        };

        $http(requestObj).success(function (data) {
            var posDetails = data.result.currPos;
            $scope.data.currPosBTC = posDetails.BTC[0].balance;
            $scope.data.currPosETH = posDetails.ETH[0].balance;
            $scope.data.currPosLTC = posDetails.LTC[0].balance;
            $scope.data.currPosUSD = posDetails.USD[0].balance;
            $scope.data.priceDetails = data.result.currPrices;
            //hide Loader
            $scope.view.showLoader = false;
        }).error(function (data, err) {
            //hide Loader
            $scope.view.showLoader = false;
            console.log(error)
        });

    };
    /* Getting current  position[End] */

    /* Filter position[Start] */
    var filterPosition = function () {
        //show Loader
        $scope.view.showLoader = true;
        if (!$scope.data.filterStartDateTime || (moment($scope.data.filterStartDateTime).format("DD/MM/YYYY") === moment(new Date()).format("DD/MM/YYYY"))) {
            getCurrentPosition()
            return;
        }

        var postData = {
            token: $cookieStore.get('userToken'),
            prodId: $scope.data.selProduct,
            side: $scope.data.selSide === 'all' ? '' : $scope.data.selSide,
            startDate: $scope.data.filterStartDateTime ? moment($scope.data.filterStartDateTime.setHours(23, 59, 59, 999)).unix() : '',
            //  endDate: $scope.data.filterEndDateTime ? moment($scope.data.filterEndDateTime).unix() : moment($scope.data.filterStartDateTime.setHours(23, 59, 59, 999)).unix()
        }

        // var postData = $scope.reqData;
        var requestObj = {
            method: 'POST',
            url: '/api/filterGdaxPosition',
            data: postData
        };

        $http(requestObj).success(function (data) {
            var posDetails = data.result.currPos;
            $scope.data.currPosBTC = posDetails.BTC ? posDetails.BTC[0].balance : 0;
            $scope.data.currPosETH = posDetails.ETH ? posDetails.ETH[0].balance : 0;
            $scope.data.currPosLTC = posDetails.LTC ? posDetails.LTC[0].balance : 0;
            $scope.data.currPosUSD = posDetails.USD ? posDetails.USD[0].balance : 0;
            $scope.data.priceDetails = data.result.currPrices;
            //hide Loader
            $scope.view.showLoader = false;
        }).error(function (data, err) {
            //hide Loader
            $scope.view.showLoader = false;
            console.log(error)
        });

    };
    /* Filter position[End] */

    /* AREA FOR POSITION TAB[END] */


    /* AREA OF TRANSFER TAB[START] */

    /* Getting Transfers[Start] */
    /* Using side Filter[Start] */
    $scope.trnsfrTypeOnChange = function (type) {
        angular.element(document.querySelector('#selSide')).html(type)
        $scope.data.selTrnsfrtype = type.toLowerCase();
        searchTransfers()

    };

    var getTransfers = function () {
        //show Loader
        $scope.view.showLoader = true;
        var requestObj = {
            method: 'POST',
            url: '/api/getGdaxTransfersFromDB',
            data: {
                token: $cookieStore.get('userToken'),
                prodId: $scope.data.selProduct,
            }
        };

        $http(requestObj).success(function (data) {
            //hide Loader
            $scope.view.showLoader = false;
            $scope.data.transfers = data.result;
        }).error(function (data, err) {
            //hide Loader
            $scope.view.showLoader = false;
            console.log(error)
        });
    };
    /* Getting Transfers[END] */

    /* Getting Transfers[Start] */
    var searchTransfers = function () {
        //show Loader
        $scope.view.showLoader = true;
        var postData = {
            token: $cookieStore.get('userToken'),
            prodId: $scope.data.selProduct,
            type: $scope.data.selTrnsfrtype === 'all' ? '' : $scope.data.selTrnsfrtype,
            startDate: $scope.data.filterStartDateTime ? moment($scope.data.filterStartDateTime).unix() : '',
            endDate: $scope.data.filterEndDateTime ? moment($scope.data.filterEndDateTime).unix() : '',
        }
        // var postData = $scope.reqData;
        var requestObj = {
            method: 'POST',
            url: '/api/searchGdaxTransfersFromDB',
            data: postData
        };

        $http(requestObj).success(function (data) {
            //hide Loader
            $scope.view.showLoader = false;
            $scope.data.transfers = data.result;
        }).error(function (data, err) {
            //hide Loader
            $scope.view.showLoader = false;
            if (err === 404) {
                $scope.data.transfers = [];
            }
            toastr.error(data.error, '');
        });
    };
    /* Getting Transfers[END] */

    /*  AREA OF TRANSFER TAB[END] */

    /* Initial Execution [Start] */
    reset();
    getFills();
    //    resetMobView();
    /* Initial Execution [End] */
});