// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var mainApp = angular.module('starter', ['ionic','chart.js']);
mainApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // if (cordova.platformId === "ios" && window.cordova && window.cordova.plugins.Keyboard) {
      // // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // // for form inputs)
      // cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // // Don't remove this line unless you know what you are doing. It stops the viewport
      // // from snapping when text inputs are focused. Ionic handles this internally for
      // // a much nicer keyboard experience.
      // cordova.plugins.Keyboard.disableScroll(true);
    // }
    // if(window.StatusBar) {
      // StatusBar.styleDefault();
    // }
  });  
})
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('index', {
                url: '/index',
                templateUrl: 'index.html',
                controller: 'indexCtrl'
            })
			.state('account', {
                url: '/account',
                templateUrl: 'account.html',
                controller: 'homeCtrl'
            })
			.state('homepage', {
                url: '/homepage',
                templateUrl: 'homepage.html',
                //controller: 'accountCtrl'
            });				
      // $urlRouterProvider.otherwise('/users');
    });
mainApp.controller('accountCtrl', function($scope, $location, $window) {

$scope.redirectAccuntpage = function () {
        console.log("Inside redirect Function");
		var link = 'account.html';
		$window.location.href= link;
		//$location.path("/account");
		
    };
})
mainApp.controller('homeCtrl', function($scope, $location, $window) {
console.log("Inside Main page Function");
$scope.redirctMainpage = function () {
        console.log("Inside Main page Function");
		var home_link = 'homepage.html';
		$window.location.href= home_link ;
		//$location.path("/account");
		
    };
})

mainApp.controller("graphCtrl", function($scope) {
	console.log("Inside Main page Function");
    $scope.labels = ["12am", "6am", "12pms"];
    //$scope.series = ['Series A', 'Series B'];
    $scope.data = [
        [0, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
	$scope.type = 'point';
 
});