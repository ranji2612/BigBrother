
var app = angular.module('mainApp', ['ngRoute','ngCookies']);

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
	.when('/', {
    templateUrl	:	'html/landing.html',
    controller	:	'landingCtrl'
	})
  .when('/login', {
    templateUrl: '/html/login.html'
    })
  .when('/about', {
    templateUrl	:	'html/about.html',
    controller	:	'aboutCtrl'
	})
  .otherwise({ redirectTo: '/' });

  // use the HTML5 History API
  $locationProvider.html5Mode(true);
});


app.controller('homeCtrl', function ($scope, $http, $location, $window, $rootScope) {
  console.log('Home control is under control :P ');
  $scope.isLoggedIn = false;
  $scope.loggedInUser = null;
  $window.fbAsyncInit = function() {
    FB.init({
      appId: '622776597883723',
      status: true,
      cookie: true,
      xfbml: true,
      version: 'v2.4'
    });
    FB.getLoginStatus(function(response) {
      console.log('======',response);
      if (response.status === 'connected') {
        $scope.isLoggedIn = true;
        $scope.loggedInUser = response;
        setCookie('fbVal',JSON.stringify(response),1,'');
        $scope.$apply();
        $location.path('/');
      } else {
        $location.path('/login');
      }
    });

    $scope.getPosts = function() {
      FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        document.getElementById('status').innerHTML =
          'Thanks for logging in, ' + response.name + '!';
      });
    };
  };


  // //If not login and not logged in
  // if($location.$$path != '/login' && readCookie('fbVal')==="") {
  //   console.log('Not logged in');
  //   $location.path('/login');
  // }
  // //If login and not loggedin
  // if($location.$$path == '/login' && readCookie('fbVal')!="") {
  //   $location.path('/');
  //   $scope.isLoggedIn = true;
  //
  // }


  // $rootScope.$on('fbLoginSuccess', function(name, response) {
  //   facebookUser.then(function(user) {
  //     //Values only if made public will be retured by FB
  //     user.api('/me?fields=id,name,email,birthday,cover').then(function(response) {
  //       $rootScope.loggedInUser = response;
  //       //Sending to backend to verify profile or create profile if non existant
  //       //set cookie
  //       $scope.isLoggedIn = true;
  //       console.log(JSON.parse(JSON.stringify(response)));
  //       setCookie('fbVal',JSON.stringify(response),1,'');
  //       if($location.$$path === '/login') {
  //         $location.path('/');
  //       }
  //     });
  //   });
  // });
  //
  // $rootScope.$on('fbLogoutSuccess', function() {
  //   $scope.$apply(function() {
  //   $rootScope.loggedInUser = undefined;
  //     deleteCookie('fbVal');
  //   });
  // });
  //
  // $scope.logout = function() {
  //   deleteCookie('fbVal');
  //   $scope.isLoggedIn = false;
  // };
});
