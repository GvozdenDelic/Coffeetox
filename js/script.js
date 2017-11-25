//vanilla flavored javascript

document.getElementById("body").addEventListener("load",(
		bodyClass()
	)
);

function bodyClass(){
	var body = document.getElementById("body");

	setTimeout(function(){
		body.className += "body-loaded ";
	},100);
}

/* User geolocation start */
var x = document.getElementsByClassName("js-getLocation");
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition,showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
	var latitude = position.coords.latitude,
		longitude = position.coords.longitude;
}

function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      alert("Please allow us to locate you.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable. Please enable location informations.");
      break;
    case error.TIMEOUT:
      alert("The request to get your location timed out. Please try again.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred. Please try again.");
      break;
  }
}
/* User geolocation end */

const request = require('request');

request({
  url: 'https://api.foursquare.com/v2/venues/explore',
  method: 'GET',
  qs: {
    client_id: '2SKKZZWAX2S5YCSTZO14CSGTEBUYL3TVMKWNH54IMWLYOFCH',
    client_secret: '0YT3WURXQ4BKXYXKRGFXKYJC4P1XFWBC0QH0FIT0RQ5SWVNE',
    ll: '40.7243,-74.0018',
    query: 'coffee',
    v: '20170801',
    limit: 1
  }
}, function(err, res, body) {
  if (err) {
    console.error(err);
  } else {
    console.log(body);
  }
});