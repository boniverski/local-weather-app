if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    //Get local time from Geonames.org
    $.getJSON('http://api.geonames.org/timezoneJSON?lat=' + latitude + '&lng=' + longitude + '&username=ayoisaiah', function(timezone) {
          var rawTimeZone = JSON.stringify(timezone);
          var parsedTimeZone = JSON.parse(rawTimeZone);
          var dateTime = parsedTimeZone.time;
          timeFull = dateTime.substr(11);
          $("#local-time").html(timeFull); //Update local time
          timeHour = dateTime.substr(-5, 2);
    });

    //Getting weather condition data from OpenWeatherMap
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&APPID=5a5a02f356f4f64fe223c5d5a5efde42", function (data) {

      //Fixing temperature in celsius and fahrenheits
      var temp = [(data.main.temp - 273).toFixed(0) + "&#8451;", (1.8 * (data.main.temp - 273) + 32).toFixed(0) + "&#8457;"];

      $("#city").html(data.name);
      $("#temp-celsius").html(temp[0]);
      $("#temp-fahrenheit").html(temp[1]);
      $("#weather-description").html(data.weather[0].description);

    });
  })
}
