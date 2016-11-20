app.controller('landingCtrl', function($scope,$http,$routeParams) {
    console.log('landingCtrl under control..');

});
window.fbAsyncInit = function() {
		    FB.init({
		      appId      : '622776597883723',
		      xfbml      : true,
		      version    : 'v2.5'
		    });
		    FB.getLoginStatus(function(response) {
		      console.log(response);
		    	if (response.status === 'connected') {
		    		document.getElementById('status').innerHTML = 'We are connected.';
		    		//document.getElementById('login').style.visibility = 'hidden';

            FB.api(
            '/me',
            'GET',
            {"fields":"posts.since(12){message}"},
            function(response) {
              console.log(response.posts.data);
              for(var i=0; i<response.posts.data.length; i++){
                  
              }
                // Insert your code here
            }
            );
		    	} else if (response.status === 'not_authorized') {
		    		document.getElementById('status').innerHTML = 'We are not logged in.'
		    	} else {
		    		document.getElementById('status').innerHTML = 'You are not logged into Facebook.';
		    	}
		    });



		};
