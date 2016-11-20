
var app = angular.module('mainApp', ['ngRoute','ngCookies']);


app.controller('homeCtrl', function ($scope, $http, $location, $window, $rootScope) {


  console.log('Home control is under control :P ');
  $scope.isLoggedIn = false;
  $scope.loggedInUser = null;
  $scope.filteredPosts = [];
  $scope.posts= {};
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
        FB.api(
        '/me',
        'GET',
        {"fields":"email"},
        function(response) {
          $scope.loggedInUser.email = response.email;
        });

        setCookie('fbVal',JSON.stringify(response),1,'');
        $scope.$apply();

      } else {
        $location.path('/login');
      }
    });

    $scope.getPosts = function() {
      $scope.started = true;
      var uri = '/'+$scope.loggedInUser.authResponse.userID+'/feed';
      console.log(uri);

      FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name, response);
        document.getElementById('status').innerHTML =
          'Thanks for logging in, ' + response.name + '!';
      });
      FB.api(
      '/me',
      'GET',
      {"fields":"tagged{from,message}"},
      function(response) {
        console.log(response.tagged.data);
        for(var i=0; i<response.tagged.data.length; i++){
            text = getAjax(response.tagged.data[i].message);
            dataVal = response.tagged.data[i];
            text.done(function(data) {
                if(data.Terms==null)
                {
                  flag=0;
                }
                else{
                  id = '/' + dataVal.from.id;
                  console.log(id);
                      console.log($scope.loggedInUser.email);
                      $http.post('/email/'+$scope.loggedInUser.email, {data: data.OriginalText})
                      .success(function(data1){
                          console.log("Sent message");
                      })
                      .error(function(err){
                          console.log(err);
                      });
                  console.log(data, $scope.posts[data.OriginalText]);
                  $scope.filteredPosts.push($scope.posts[data.OriginalText]);
                  $scope.$apply();
                }
            })
            .fail(function() {
                //alert("error");
            });
        }
          // Insert your code here
      }
      );
      FB.api(
      '/me',
      'GET',
      {"fields":"photos"},
      function(response) {
        console.log("photos");
        console.log(response);
        for(var i=0; i<response.photos.data.length; i++){
            id = '/'+response.photos.data[i].id;
            FB.api(
              id,
              'GET',
              {"fields":"picture"},
              function(response) {
                console.log(response.picture);
                  // Insert your code here
              }
            );

        }
          // Insert your code here
      }
      );
    };
  };

  $scope.addReport = function(formdata) {
    console.log('adding a report');
    formdata['userID'] = $scope.loggedInUser.authResponse.userID;
    $http.post('/report/', formdata)
    .success(function(data){
      console.log('success report');
    })
    .error(function(err){
      console.log('error', err);
    });
  };

});
