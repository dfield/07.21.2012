var uid = 0;
var name = "Anonymous";

console.log("Testing 123");


function facebookLogin() {
  console.log("Trying to log in");
  FB.login(function(response) {
    handleResponse(response);
  }, {scope:'email'});
}

function facebookLogout() {
  FB.logout(function(response) {
    logout();
  });
}

function showLoginButton() {
  console.log("Some logging");
  $("#fb-login").unbind("click");
  $("#fb-login").text("Login with Facebook")
  $("#fb-login").click(function() {
    facebookLogin();
  });
}

function handleResponse(response) {
  console.log(response);
  if (response.authResponse) {
    $("#fb-login").unbind("click");
    $("#fb-login").text("Logout")
    $("#fb-login").click(facebookLogout);
    uid = response.authResponse.userID;
    FB.api("/me", function(data) {
      loginData = {"name": data.name, "facebookId": data.id};
      login(loginData);
    });
  } else {
    showLoginButton();
  }
}

window.fbAsyncInit = function() {
	var appId;
	console.log("there");
	if(window.location.toString().indexOf('coursekick') != -1) {
	  console.log("here");
	  //TODO make a new app for heroku.
		appId = '475997832411925';
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