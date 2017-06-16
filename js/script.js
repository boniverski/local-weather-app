$(document).ready(function() {

  //Global variables
  var hours, longitude, latitude;

  //Getting user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;

      //Get local time from TimeZoneDB.com
      $.getJSON("https://boniverski.github.io/local-weather-app/http://api.timezonedb.com/v2/get-time-zone?key=9KO15I9T9P1B&format=json&callback=?&by=position&lat=" + latitude + "&lng=" + longitude, function (timezone) {

        // Create a new JavaScript Date object based on the timestamp
        //Timestapm minus gmtOffset to get UTC time
        var date = new Date((timezone.timestamp - timezone.gmtOffset) * 1000);
        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Will display time in 10:30 UTC format
        var formattedTime = hours + ':' + minutes.substr(-2);

        $("#local-time").html(formattedTime); //Adding formatted time to HTML

        //Getting weather condition data from OpenWeatherMap
        $.getJSON("https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&APPID=5a5a02f356f4f64fe223c5d5a5efde42", function (data) {

          //Fixing temperature in celsius and fahrenheits
          var temp = [(data.main.temp - 273).toFixed(0) + "&#8451;", (1.8 * (data.main.temp - 273) + 32).toFixed(0) + "&#8457;"];

          //Adding weather data to HTML
          $("#city").html(data.name);
          $("#temp-celsius").html(temp[0]);
          $("#temp-fahrenheit").html(temp[1]);
          $(".unit-change").click(function () {
            $("#temp-fahrenheit").toggle();
            $("#temp-celsius").toggle();
          });
          $("#weather-description").html(data.weather[0].description);

          //Skycons - weather icons
          var skycons = new Skycons({"color": "#FDFDFD"});

          skycons.add("#animated-icon", Skycons.CLEAR_DAY);
          skycons.play();

          var weather = data.weather[0].description;

          if(weather.indexOf("rain") >= 0) {
            skycons.set("animated-icon", Skycons.RAIN);
          } else if (weather.indexOf("sunny") >= 0) {
            skycons.set("animated-icon", Skycons.CLEAR_DAY);
          } else if (weather.indexOf("clear") >= 0) {
            if (hours >= 7 && hours < 20) {
              skycons.set("animated-icon", Skycons.CLEAR_DAY);
            } else {
              skycons.set("animated-icon", Skycons.CLEAR_NIGHT);
            }
          } else if (weather.indexOf("cloud") >= 0) {
              if (hours >= 7 && hours< 20) {
                skycons.set("animated-icon", Skycons.PARTLY_CLOUDY_DAY);
              } else {
                  skycons.set("animated-icon", Skycons.PARTLY_CLOUDY_NIGHT);
                }
          } else if (weather.indexOf("thunderstorm") >= 0) {
              skycons.set("animated-icon", Skycons.SLEET);
          } else if (weather.indexOf("snow") >= 0) {
              skycons.set("animated-icon", Skycons.SNOW);
          }
        })
      });
    })
  } else {
    	alert("Geolocation is not supported by your browser, download the latest Chrome or Firefox to use this app");
  };
})
