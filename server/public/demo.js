/**
 * Created by Dell on 25-07-2016.
 */
var demo = angular.module('demoApp',[])

demo.controller('demoCtrl', function ($scope, $http) {
    $scope.data={
        amount:'',
        ether:''
    }
    /* Get location[start] */
    $scope.getEthConv = function () {
        var postData = $scope.data;
        var requestObj = {
            method: 'POST',
            url: 'api/convertToEther',
            data: postData
        };

        $http(requestObj).success(function (data) {
            $scope.data.ether = data.result;
        }).error(function (data, err) {
            console.error('Error: while getting data');
        });
    }
});