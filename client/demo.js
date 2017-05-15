/**
 * Created by Dell on 25-07-2016.
 */
var demo = angular.module('demoApp', [])

demo.controller('demoCtrl', function ($scope, $http) {
    $scope.reqData = {
        amount: '',
        currencyType:''
    }

    $scope.respData = {
        ether: ''
    }

    $scope.model={
        currencyLists:{}
    }

    $scope.getEthConv = function () {
        var postData = $scope.reqData;
        var requestObj = {
            method: 'POST',
            url: 'api/convertToEther ',
            data: postData
        };

        $http(requestObj).success(function (data) {
            $scope.respData.ether = data.result;
        }).error(function (data, err) {
            console.error('Error: while getting data');
        });
    }

    // get Currency list
   var getCurList= function () {
        var requestObj = {
            method: 'GET',
            url: 'https://openexchangerates.org/api/currencies.json',
        };

        $http(requestObj).success(function (data) {
            $scope.model.currencyLists = data;
        }).error(function (data, err) {
            console.error('Error: while getting data');
        });
    }

    getCurList()
});