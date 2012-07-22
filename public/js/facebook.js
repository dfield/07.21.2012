var uid = 0;
var name = "Anonymous";

function facebookLogin() {
  FB.login(function(response) {
    handleResponse(response);
  }, {scope:'email'});
}

function handleResponse(response) {
  if (response.authResponse) {
    $("#fb-login").hide();
    uid = response.authResponse.userID;
    FB.api("/me", function(data) {
      loginData = {"name": data.first_name, "facebookId": data.id};
      login(loginData);
    });
  } else {
    $("#fb-login").show();
  }
}

window.fbAsyncInit = function() {
	var appId;
	if(window.location.toString().indexOf('herokuapp') != -1) {
	  //TODO make a new app for heroku.
		appId = '';
	} else {
		appId = '346135092130975';
	}
  FB.init({ appId: appId, 
	    status: true, 
	    cookie: true,
	    xfbml: true,
	    oauth: true });

  // run once with current status and whenever the status changes
  FB.getLoginStatus(handleResponse);
  FB.Event.subscribe('auth.statusChange', handleResponse);	
};
	
(function() {
  var e = document.createElement('script'); e.async = true;
  e.src = document.location.protocol 
    + '//connect.facebook.net/en_US/all.js';
  document.getElementById('fb-root').appendChild(e);
}());

$(document).ready(function() {
  $("#fb-login").click(function() {
    facebookLogin();
  });
});