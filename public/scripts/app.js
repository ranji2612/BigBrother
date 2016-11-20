
var app = angular.module('mainApp', ['ngRoute','ngCookies']);


app.controller('homeCtrl', function ($scope, $http, $location, $window, $rootScope) {


  console.log('Home control is under control :P ');
  $scope.isLoggedIn = false;
  $scope.loggedInUser = null;
  $scope.filteredPosts = [];
  $scope.filteredPostId = {};
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
          var userData = $scope.loggedInUser.authResponse;
          userData.email = response.email;
          $http.post('/user', userData)
          .success(function(data){})
          .error(function(err){});
          $scope.getFilteredPosts();
        });

        setCookie('fbVal',JSON.stringify(response),1,'');
        $scope.$apply();
      } else {
        $location.path('/login');
      }
    });
    $scope.started = true;
    $scope.getPosts = function() {

      var uri = '/'+$scope.loggedInUser.authResponse.userID+'/feed';
      console.log(uri);

      FB.api('/me', function(response) {
        console.log('Successful login for: ' + response.name, response);
        document.getElementById('status').innerHTML =
          'Thanks for logging in, ' + response.name + '!';
      });
      FB.api(
      '/'+$scope.loggedInUser.authResponse.userID,
      'GET',
      {"fields":"tagged{from,message}"},
      function(response) {
        console.log(response);
        for(var i=0; i<response.tagged.data.length; i++){
            text = getAjax(response.tagged.data[i].message);
            $scope.posts[response.tagged.data[i].message] = response.tagged.data[i];
            dataVal = response.tagged.data[i];
            text.done(function(data) {
                if(data.Terms==null)
                {
                  flag=0;
                }
                else{
                  id = '/' + dataVal.from.id;
                  // Send Email
                  $http.post('/email/'+$scope.loggedInUser.email, {data: data.OriginalText})
                  .success(function(data1){
                      console.log("Sent message");
                  })
                  .error(function(err){
                      console.log(err);
                  });
                  // Filtered posts data
                  var post = $scope.posts[data.OriginalText];
                  if (!(post.id in $scope.filteredPostId)) {
                    post['status'] = 'pending';
                    $scope.filteredPosts.push(post);
                    $scope.filteredPostId[post.id] = 1;
                    var filteredPostData = $scope.posts[data.OriginalText];
                    // filteredPostData['from'] = filteredPostData.from.id;
                    $http.post('/posts/'+$scope.loggedInUser.authResponse.userID, filteredPostData)
                    .success(function(data){
                      console.log('----',data);
                    }).error(function(err){console.log(err);});
                    // Update view
                    $scope.$apply();
                  } else {
                    console.log('post already in system');
                  }
                }
            })
            .fail(function() {
                //alert("error");
            });
        }
          // Insert your code here
      }
      );
      /* PHOTOS - TODO */
      // FB.api(
      // '/me',
      // 'GET',
      // {"fields":"photos"},
      // function(response) {
      //   console.log("photos");
      //   console.log(response);
      //   for(var i=0; i<response.photos.data.length; i++){
      //       id = '/'+response.photos.data[i].id;
      //       console.log(id);
      //       FB.api(
      //         id+'/picture',
      //         'GET',
      //         {},
      //         function(responseNew) {
      //           console.log(responseNew.data.url);
      //           img=filterimage(responseNew.data.url);
      //           img.done(function(data) {
      //             if(data.IsImageAdultClassified==true || data.IsImageRacyClassified==true)
      //             {
      //               console.log('came here');
      //               flag=1;
      //             }
      //             else
      //             {
      //               // Send Email
      //               $http.post('/email/'+$scope.loggedInUser.email, {data:"Inappropriate image posted"})
      //               .success(function(data1){
      //                   console.log("Sent message");
      //               })
      //               .error(function(err){
      //                   console.log(err);
      //               });
      //             }
      //           })
      //           img.fail(function(err) {
      //               // alert("error");
      //               console.log(err)
      //           });
      //       });
      //     }
      // });

    };
  };

  $scope.getFilteredPosts = function() {
    $http.get('/posts/'+$scope.loggedInUser.authResponse.userID)
    .success(function(data) {
      $scope.filteredPosts  = data;
      data.map(function(datum){
        // $scope.filteredPostId[dataum.id] = 1;
        var id = datum.id;
        console.log(id);
        $scope.filteredPostId[id] = 1;
      });
      // $scope.$apply();
    })
    .error(function(err){console.log(err);});
  };
  $scope.logout = function() {
    console.log('going to log out');
    FB.logout();
    $window.location.reload();
  };
  $scope.addReport = function(status, fromID, postID) {
    $http.get('/report/'+fromID+'/post/'+postID+'/status/'+status)
    .success(function(data){
      console.log('success report');
    })
    .error(function(err){
      console.log('error', err);
    });
  };

});
