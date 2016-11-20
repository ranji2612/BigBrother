
var app = angular.module('mainApp', ['ngRoute','ngCookies']);


app.controller('homeCtrl', function ($scope, $http, $location, $window, $rootScope) {


  console.log('Home control is under control :P ');

$scope.imgNew=[];
  $scope.isLoggedIn = false;
  $scope.loggedInUser = null;
  $scope.filteredPosts = [];
  $scope.filteredPostId = {};
  $scope.posts= {};
  $scope.filteredPhotos = [];
  $scope.filteredPhotoId = {};
  $scope.photos= {};
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
        document.getElementsByTagName('body')[0].className = "";
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
          .success(function(data){
            if('score' in data) {
              $scope.loggedInUser.score = data['score'];
            } else {
              $scope.loggedInUser.score = 0;
            }
          })
          .error(function(err){});
          $scope.getFilteredPosts();
          $scope.getStats();
        });

        setCookie('fbVal',JSON.stringify(response),1,'');
        $scope.$apply();
      } else {
        $location.path('/login');
        document.getElementsByTagName('body')[0].className = "login";
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
      FB.api(
      '/me',
      'GET',
      {"fields":"photos"},
      function(response) {
        console.log("photos");
        console.log(response);
        for(var i=0; i<response.photos.data.length; i++){
            id = response.photos.data[i].id;
            FB.api(
              '/'+id+'/picture',
              'GET',
              {},
              function(responseNew) {
                console.log(responseNew.data.url);
                urlId=responseNew.data.url.split("720/")[1];
                if(urlId!=undefined) urlId = urlId.split("_")[1];
                if(urlId!=undefined) urlId=urlId.split("_")[0];
                $scope.posts[responseNew.data.url]=responseNew;
                image=filterimage(responseNew.data.url);
                image.done(function(data){
                  console.log(data);
                  //console.log(data,urlId);
                  if(data.IsImageAdultClassified==true || data.IsImageRacyClassified==true) {
                    console.log('here');
                  $http.post('/email/'+$scope.loggedInUser.email, {data:"Inappropriate image posted"})
                      .success(function(data1){
                          console.log("Sent message");
                      })
                      .error(function(err){
                          console.log(err);
                      });
                      console.log($scope.loggedInUser.authResponse.userID,urlId);
                  $http.post(
                    '/posts/'+$scope.loggedInUser.authResponse.userID,
                    { id:$scope.loggedInUser.authResponse.userID+'_'+urlId, status:"pending",
                      userID:$scope.loggedInUser.authResponse.userID,
                      imgUrl: responseNew.data.url
                    })
                        .success(function(data){
                          console.log('----',data);
                        }).error(function(err){console.log(err);});
                      }
                });
              //   if(image.readyState===4) {
              //   console.log(image.responseText);
              // }
              /*  if(image.responseText!="" && image.responseText!=undefined){
                  console.log(image.responseText);
                  if(image.responseText.contains("true")!=-1) {
                  console.log("Inappropriate image");
                  console.log(response.data.url);
                }
              }*/
                // img.done(function(data) {
                //   console.log('This');
                //   console.log(data);
                //   if(data.IsImageAdultClassified==true || data.IsImageRacyClassified==true)
                //   {
                //     $http.post('/email/'+$scope.loggedInUser.email, {data:"Inappropriate image posted"})
                //     .success(function(data1){
                //         console.log("Sent message");
                //     })
                //     .error(function(err){
                //         console.log(err);
                //     });
                //       $http.post('/posts/'+$scope.loggedInUser.authResponse.userID, responseNew.data.id)
                //       .success(function(data){
                //         console.log('----',data);
                //       }).error(function(err){console.log(err);});
                //       // Update view
                //       $scope.$apply();
                //     console.log('came here');
                //     flag=1;
                //   }
                //   else
                //   {
                //     // Send Email
                //
                //     }
                // })
                // img.fail(function(err) {
                //     // alert("error");
                //     console.log(err)
                // });
            });
          }
      });

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
  $scope.getStats = function() {
    $http.get('/stats/'+$scope.loggedInUser.authResponse.userID)
    .success(function(data){
      console.log(data);
      $scope.stats = data;
      $scope.stats.total = data.pending + data.true + data.false;
    });
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
