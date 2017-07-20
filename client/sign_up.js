/**
 * Created by Dell on 25-07-2016.
 */
var micropayApp = angular.module('miropayApp', ['toastr'])

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


micropayApp.controller('signUpCtrl', function ($scope, toastr, $timeout, $filter, $http) {

    /* INIT scope valiables[Start] */
    var reset = function () {
        $scope.data = {
            userID: '',
            password: '',
            apiKey: '',
            apiSecret: '',
            passphrase: '',
        };
        $scope.validate = {
            confirmPassword: ''
        };
    };
    /* INIT scope valiables[End] */

    /* Area of validation[Start] */
    var validate = function () {
        // Validating Email Format With Reg Exp
        var EMAIL_REGEXP = /^([A-Za-z0-9_\-\.]+)@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,3})$/;
        if (!EMAIL_REGEXP.test($scope.data.userID)) {
            toastr.error('Please enter a valid user ID', '');
            return false;
        }

        if ($scope.data.password !== $scope.validate.confirmPassword) {
            toastr.error('Password does not match', '');
            return false;
        }


        var PWD_REGEXP = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        if (!PWD_REGEXP.test($scope.data.password)) {
            toastr.error('Paswword must contain atleast 6 characters with a number and a special character', '');
            return false;
        }

        if (!$scope.data.apiKey) {
            toastr.error('Please enter API key', '');
            return false;
        }

        if (!$scope.data.apiSecret) {
            toastr.error('Please enter API secret', '');
            return false;
        }

        if (!$scope.data.passphrase) {
            toastr.error('Please enter passphrase', '');
            return false;
        }
        return true;
    };
    /* Area of validation[End] */

    /* Doing SignUp[Start] */
    $scope.doSignUp = function () {
        // validating the details
        var validated = validate();
        if (!validated) {
            return;
        }

        // Preparing post data and request object
        var postData = $scope.data;
        var requestObj = {
            method: 'POST',
            url: '/api/gdaxUserSignUp',
            data: postData
        };

        // sending request to server
        $http(requestObj).success(function (data) {
            toastr.success(data.data, '');
        }).error(function (data, err) {
            toastr.error(data.error, '');
        });

    };
    /* Doing SignUp[End] */
});