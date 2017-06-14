var longitude, latitude, timeHour, timeFull;

if (navigator.geolocation) {
    //Return the user's longitude and latitude on page load using HTML5 geolocation API
    window.onload = function () {
    var currentPosition;
    function getCurrentLocation (position) {
        currentPosition = position;
        latitude = currentPosition.coords.latitude;
        longitude = currentPosition.coords.longitude;
        //AJAX request
        $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&APPID=5a5a02f356f4f64fe223c5d5a5efde42", function (data) {
            var rawJson = JSON.stringify(data);
            var json = JSON.parse(rawJson);
            updateWeather(json); //Update Weather parameters
        });
    }
    navigator.geolocation.getCurrentPosition(getCurrentLocation);
  }
}

function updateWeather (json) {
	longitude = json.coord.lon;
	latitude = json.coord.lat;
}
