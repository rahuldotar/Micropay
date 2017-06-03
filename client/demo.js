/**
 * Created by Dell on 25-07-2016.
 */
var demo = angular.module('demoApp', ['toastr'], function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

demo.config(function (toastrConfig) {
    angular.extend(toastrConfig, {
        //    maxOpened: 1,
        closeButton: true,
        //    preventOpenDuplicates: true,
        tapToDismiss: false,
        timeOut: 3000,
        extendedTimeOut: 6000

    });
});


demo.controller('demoCtrl', function ($scope, $timeout, $http,toastr) {
    $scope.reqData = {
        firstName: '',
        lastName: '',
        email: '',
        popularPartners: false,
        preloader: false,
        selectedMerchant:{}
    }

    $scope.respData = {
        iavToken: ''
    }

    $scope.paymentData = {
        fundingResrcURL: '',
        amount: ''
    }

    $scope.data = {
        ether: '',
        isPay: false,
        merchantAccounts : []

    }


    var validate = function () {
        if (!$scope.reqData.firstName) {
            toastr.error('Enter first name', '');
            return false;
        }

        if (!$scope.reqData.lastName) {
            toastr.error('Enter last name', '');
            return false;
        }

        if (!$scope.reqData.email) {
            toastr.error('Enter email', '');
            return false;
        }

        return true;
    };

    /* create IAV token by sending customer details[Start] */
    $scope.getIavToken = function () {
        var validated = validate();
        if (!validated) {
            return;
        }
        $scope.reqData.popularPartners = true;
        $scope.reqData.preloader = true;
        var postData = $scope.reqData;
        var requestObj = {
            method: 'POST',
            url: '/api/getIavToken',
            data: postData
        };

        $http(requestObj).success(function (data) {
            $scope.respData.iavToken = data.result;
            renderPaymentPage();
        }).error(function (data, err) {
            console.error('Error: while getting data');
        });
    };
    /* create IAV token by sending customer details[End] */

    var getCall = function () {
        // var postData = $scope.reqData;
        var requestObj = {
            method: 'GET',
            url: '/api/buyCrypto',
            //   data: postData
        };

        $http(requestObj).success(function (data) {
            //  $scope.respData.iavToken = data.result;
            //  renderPaymentPage();
        }).error(function (data, err) {
            // console.error('Error: while getting data');
        });
    };
    /* create IAV token by sending customer details[End] */



    /* render payment page[Start] */
    var renderPaymentPage = function () {
        $timeout($scope.reqData.preloader = false, 4000);

        dwolla.configure('sandbox');
        dwolla.iav.start($scope.respData.iavToken, {
            container: 'iavContainer',
            //   stylesheets: [
            //     'http://fonts.googleapis.com/css?family=Lato&subset=latin,latin-ext',
            //     'https://localhost:8080/iav/customStylesheet.css'
            //   ],
            microDeposits: 'false',
            fallbackToMicroDeposits: 'false'
        }, function (err, res) {
            $scope.reqData.preloader = false;
            $scope.paymentData.fundingResrcURL = res._links["funding-source"]["href"]
            $scope.data.isPay = true;
            $scope.$apply();
            console.log(res);
        });
    }
    /* render payment page[End] */

    // get Currency list
    $scope.submitTransaction = function () {
        if (!$scope.paymentData.amount) {
            toastr.error('Enter amount', '');
            return false;
        }
        var postData = $scope.paymentData;
        var requestObj = {
            method: 'POST',
            url: '/api/doPayment',
            data: postData
        };

        angular.element(document.querySelector('#status')).html('Loading....');
        angular.element(document.querySelector('#balancee')).hide();

        $http(requestObj).success(function (data) {
            $scope.data.ether = data.result;
            send( $scope.fromAccount ,$scope.reqData.selectedMerchant.accountNo,$scope.data.ether,function (result) {
               $scope.transationId = result;
               console.log("transaction id", $scope.transationId )
                $scope.refreshBalance();
               $scope.$apply();
                angular.element(document.querySelector('#status')).html('Transaction complete');
                angular.element(document.querySelector('#balancee')).show();
            });


        }).error(function (data, err) {
            console.error('Error: while getting data');
        });
    }
    getCall();
    // getCurList();

    getMerchantAccounts(function (result) { console.log("get merchant accounts",result);
        $scope.data.merchantAccounts = result;
        $scope.reqData.selectedMerchant =  $scope.data.merchantAccounts[0];
        $scope.$apply()
        getBalance($scope.reqData.selectedMerchant.accountNo,function (result) {
            $scope.balance= result;
            console.log(" $scope.balance", $scope.balance);
            angular.element(document.querySelector('#balance')).html('Current Balance : ' + result );
            angular.element(document.querySelector('#balance')).show();
            $scope.$apply()
        });

    });

    getAccounts(function (result) {
       $scope.accounts = result;
       $scope.fromAccount = $scope.accounts[3];
    });


    $scope.refreshBalance = function () {
        angular.element(document.querySelector('#balance')).show();
        getBalance($scope.reqData.selectedMerchant.accountNo,function (result) {
            $scope.balance= result;
            console.log(" $scope.balance", $scope.balance);
            angular.element(document.querySelector('#balance')).html('Current Balance : ' + result );
            angular.element(document.querySelector('#balance')).show();
            $scope.$apply()
        });
    }

  });



/*<script type="text/javascript">
$('#start').click(function() {

  var iavToken = 'S4Tfd193l0wydPTsHWevAmFG7x91XWD32kRikb0CKANXHtsLl4';
  dwolla.configure('sandbox');
  dwolla.iav.start(iavToken, {
          container: 'iavContainer',
        //   stylesheets: [
        //     'http://fonts.googleapis.com/css?family=Lato&subset=latin,latin-ext',
        //     'https://localhost:8080/iav/customStylesheet.css'
        //   ],
          microDeposits: 'false',
          fallbackToMicroDeposits: 'false'
        }, function(err, res) {
    console.log(res);
  });
});
</script>*/