var uid = 0;
var name = "Anonymous";

function login(callback) {
  FB.login(function(response) {
    if (response.authResponse) {
      uid = response.authResponse.userID;
      FB.api("/me", function(data) {
        name = data.first_name;
        callback();
      });
    } else {
      //user cancelled login or did not grant authorization
    }
  }, {scope:'email'});
}

window.fbAsyncInit = function() {
	var appId;
	if(window.location.toString().indexOf('herokuapp') != -1) {
		appId = '';//TODO make a new app for heroku.
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
      console.log("Auth response.");
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
    login(function() {
    });
  });
});