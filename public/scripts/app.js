
var app = angular.module('mainApp', ['ngRoute','ngCookies']);


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
        console.log('connected');
        $scope.isLoggedIn = true;
        $scope.loggedInUser = response;
        setCookie('fbVal',JSON.stringify(response),1,'');
        $scope.$apply();

      } else {
        $location.path('/login');
      }
    });

    $scope.getPosts = function() {
      var uri = '/'+$scope.loggedInUser.authResponse.userID+'/feed';
      console.log(uri);
      FB.api(
        uri,
        'GET',
        {},
        function(response) {
            // Insert your code here
            console.log(response);
        }
      );
      FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name);
        document.getElementById('status').innerHTML =
          'Thanks for logging in, ' + response.name + '!';
      });
      FB.api(
      '/me',
      'GET',
      {"fields":"posts.since(12){message}"},
      function(response) {
        console.log(response.posts.data);
        for(var i=0; i<response.posts.data.length; i++){
            text = getAjax(response.posts.data[i].message);
            text.done(function(data) {
                console.log(data);
                if(data.Terms==null)
                {
                    flag=0;
                }
                else{
                    flag=1;
                }
            })
            .fail(function() {
                alert("error");
            });
        }
          // Insert your code here
      }
      );
    };
  };
});
