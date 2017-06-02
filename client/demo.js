/**
 * Created by Dell on 25-07-2016.
 */
var demo = angular.module('demoApp', [])

demo.controller('demoCtrl', function ($scope,$timeout, $http) {
    $scope.reqData = {
        firstName: '',
        lastName: '',
        email: '',
        popularPartners:false,
        preloader:false
    }
    
    $scope.respData = {
        iavToken: ''
    }

    $scope.paymentData = {
        fundingResrcURL: '',
        amount:''
    }

    $scope.data={
        ether:'',
        isPay:false
    }
    
    /* create IAV token by sending customer details[Start] */
    $scope.getIavToken = function () {
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
        var postData = $scope.paymentData;
        var requestObj = {
            method: 'POST',
            url: '/api/doPayment',
            data:postData
        };

        $http(requestObj).success(function (data) {
            $scope.data.ether = data.result;
        }).error(function (data, err) {
            console.error('Error: while getting data');
        });
    }

    // getCurList();

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
