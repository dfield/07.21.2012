var uid = 0;
var name = "Anonymous";

function facebookLogin(callback) {
  FB.login(function(response) {
    if (response.authResponse) {
      uid = response.authResponse.userID;
      FB.api("/me", function(data) {
        loginData = {"name": data.first_name, "facebookId": data.id};
        callback(loginData);
      });
    }
  }, {scope:'email'});
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

  function updateButton(response) {
    if (response.authResponse) {
      //$("#fb-login").hide();
    }
  }

  // run once with current status and whenever the status changes
  FB.getLoginStatus(updateButton);
  FB.Event.subscribe('auth.statusChange', updateButton);	
};
	
(function() {
  var e = document.createElement('script'); e.async = true;
  e.src = document.location.protocol 
    + '//connect.facebook.net/en_US/all.js';
  document.getElementById('fb-root').appendChild(e);
}());

$(document).ready(function() {
  $("#fb-login").click(function() {
    facebookLogin(login);
  });
});