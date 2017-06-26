/**
 * Created by Dell on 25-07-2016.
 */
var micropayApp = angular.module('miropayApp', ['ngSanitize', 'ui.bootstrap'])

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

        meanWeight = sumProduct/total;
        

        return meanWeight;
    };
})


micropayApp.controller('fillCtrl', function ($scope, $timeout, $http) {
    $scope.data = {
        fills: {},
        fill_view:true
    };
    $scope.tabViewFills = function(){
        $scope.data.fill_view = true;
    };
    $scope.tabViewPosition = function(){
        $scope.data.fill_view = false;
    };

    /* Getting All Fills from DB[Start] */
    var getFills = function () {
        // var postData = $scope.reqData;
        var requestObj = {
            method: 'POST',
            url: '/api/gdaxFillsFromDb',
            data: {
                userKey: 'd4fa46cb54128a56400886b9e9e2839a'
            }
        };

        $http(requestObj).success(function (data) {
            $scope.data.fills = data.result;
                 
        }).error(function (data, err) {
            console.log(error)
        });
    };
    /* Getting All Fills from DB[End] */

    $scope.toogleDetails = function () {
        angular.element(document.querySelector('.accordion-group__accordion')).toggleClass('accordion-group__accordion_expanded');
    };

     $scope.name = 'World';
  $scope.group = {
    isOpen: true
  };
  
  $scope.sessions = {
    list: [
      {
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