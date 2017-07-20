/**
 * Created by Dell on 25-07-2016.
 */
var micropayApp = angular.module('miropayApp', ['toastr', 'ngCookies'])

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


micropayApp.controller('loginCtrl', function ($scope, toastr, $timeout, $cookieStore, $filter, $http) {

    /* INIT scope valiables[Start] */
    var reset = function () {
        $scope.data = {
            userID: '',
            password: '',
        };


    };
    /* INIT scope valiables[End] */

    /* Area of validation[Start] */
    var validate = function () {
        if (!$scope.data.userID) {
            toastr.error('Please enter user ID', '');
            return false;
        }

        // Validating Email Format With Reg Exp
        var EMAIL_REGEXP = /^([A-Za-z0-9_\-\.]+)@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,3})$/;
        if (!EMAIL_REGEXP.test($scope.data.userID)) {
            toastr.error('Please enter a valid user ID', '');
            return false;
        }

        if (!$scope.data.password) {
            toastr.error('Password enter password', '');
            return false;
        }

        return true;
    };
    /* Area of validation[End] */

    /* Doing login[Start] */
    $scope.login = function () {
        // validating the details
        var validated = validate();
        if (!validated) {
            return;
        }

        // Preparing post data and request object
        var postData = $scope.data;
        var requestObj = {
            method: 'POST',
            url: '/api/gdaxUserLogin',
            data: postData
        };

        // sending request to server
        $http(requestObj).success(function (result) {
            $cookieStore.put('isLogedin', result.success);
            $cookieStore.put('userToken', result.data.token);
            location.assign("fill.html");
        }).error(function (result, err) {
            toastr.error(result.data.error, '');
        });

    };
    /* Doing login[End] */

    reset();
});