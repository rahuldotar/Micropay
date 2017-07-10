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


micropayApp.controller('fillCtrl', function ($scope, $timeout,$filter, $http) {

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
         //   selRow:-1
            //clsMbl: true
        };
    };

    $scope.sumFilter  = $filter("sumByColumn");
    $scope.sumProductFilter  = $filter("sumProductColumn");
  
    var resetMobView = function(){
       $scope.mobView = {
           name:'',
           details:[]
       }
    };

    //  $scope.data.clsMbl = false;
    /* INIT scope valiables[End] */

    $scope.closeMobCards = function () {
         $('.mob_cards').removeClass('activate');
          resetMobView();
    };

    $scope.mobViewOpen = function(filter1,filter2,name,item) {
        $('.mob_cards').addClass('activate');
        $scope.mobView.name = name;
        $scope.mobView.details =  item;
    };


    $scope.tabViewFills = function () {
        reset();
        $scope.data.fill_view = true;
        $scope.data.position_view = false;
        $scope.data.transfer_view = false;
        getFills();
    };
    $scope.tabViewPosition = function () {
        reset();
        $scope.data.fill_view = false;
        $scope.data.position_view = true;
        $scope.data.transfer_view = false;
        getCurrentPosition();
    };

    $scope.tabViewTrnsfr = function () {
        reset();
        $scope.data.fill_view = false;
        $scope.data.position_view = false;
        $scope.data.transfer_view = true;
        getTransfers();

    };

    /* Using product Filter[Start] */
    $scope.productOnChange = function (pdt) {
        $scope.data.selProduct = pdt;
        $scope.data.fill_view ? searchFills() : getCurrentPosition();
    };
    /* Using product Filter[End] */

    /* Using side Filter[Start] */
    $scope.sideOnChange = function (side) {
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

        if ($scope.data.position_view) {
            filterPosition();
            return;
        }
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
            endDate: $scope.data.filterEndDateTime ? moment($scope.data.filterEndDateTime).unix() : '',
        }

        // var postData = $scope.reqData;
        var requestObj = {
            method: 'POST',
            url: '/api/gdaxSearchFillsFromDb',
            data: postData

        };

        $http(requestObj).success(function (data) {
            $scope.data.fills = data.result;
        }).error(function (data, err) {
            console.log(error)
        });
    }
    /* search fills[End] */

    /* Getting fills for calculating position[Start] */
    var getCurrentPosition = function () {
        if ($scope.data.filterStartDateTime) {
            filterPosition();
            return;
        }
        var postData = {
            userKey: 'd4fa46cb54128a56400886b9e9e2839a',
            prodId: $scope.data.selProduct,
        }

        // var postData = $scope.reqData;
        var requestObj = {
            method: 'POST',
            url: '/api/getCurrentPosition',
            data: postData
        };

        $http(requestObj).success(function (data) {
            $scope.data.positionDetails = data.result;

        }).error(function (data, err) {
            console.log(error)
        });

    };
    /* Getting fills for calculating position[End] */

    /* Getting fills for calculating position[Start] */
    var filterPosition = function () {
        var postData = {
            userKey: 'd4fa46cb54128a56400886b9e9e2839a',
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
            $scope.data.positionDetails = data.result;

        }).error(function (data, err) {
            console.log(error)
        });

    };
    /* Getting fills for calculating position[End] */




    /* AREA OF TRANSFER TAB[START] */

    /* Getting Transfers[Start] */
    /* Using side Filter[Start] */
    $scope.trnsfrTypeOnChange = function (type) {
        $scope.data.selTrnsfrtype = type;
        searchTransfers()

    };

    var getTransfers = function () {
        // var postData = $scope.reqData;
        var requestObj = {
            method: 'POST',
            url: '/api/getGdaxTransfersFromDB',
            data: {
                userKey: 'd4fa46cb54128a56400886b9e9e2839a',
                prodId: $scope.data.selProduct,
            }
        };

        $http(requestObj).success(function (data) {
            $scope.data.transfers = data.result;
        }).error(function (data, err) {
            console.log(error)
        });
    };
    /* Getting Transfers[END] */

    /* Getting Transfers[Start] */
    var searchTransfers = function () {
        var postData = {
            userKey: 'd4fa46cb54128a56400886b9e9e2839a',
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
            $scope.data.transfers = data.result;
        }).error(function (data, err) {
            console.log(error)
        });
    };
    /* Getting Transfers[END] */

    /*  AREA OF TRANSFER TAB[END] */


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
    reset();
    getFills();
    resetMobView();
});