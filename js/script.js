/**
 * Title: Local Weather App (for FreeCodeCamp), June 2017
 * Author: Boško Rabrenović
 * https://github.com/boniverski/local-weather-app
 * Description: A local weather web-app that generates your local weather based on geo-coordinates. You have to allow browser for checking current location.
 */
$(document).ready(function() {

  //Global variables
  var hours, longitude, latitude;

  //Getting user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;

      //Get local time from TimeZoneDB.com
      $.getJSON("https://api.timezonedb.com/v2/get-time-zone?key=9KO15I9T9P1B&format=json&callback=?&by=position&lat=" + latitude + "&lng=" + longitude, function (timezone) {

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
          var temp = [(data.main.temp - 273).toFixed(0) + "&deg;C", (1.8 * (data.main.temp - 273) + 32).toFixed(0) + "&deg;F"];
          // var highestTemp = [(data.main.temp_max - 273).toFixed(0) + "&deg;", (1.8 * (data.main.temp_max - 273) + 32).toFixed(0) + "&deg;"]
          // var lowestTemp = [(data.main.temp_min - 273).toFixed(0) + "&deg;", (1.8 * (data.main.temp_min - 273) + 32).toFixed(0) + "&deg;"]

          //Adding weather data to HTML
          $("#city").html(data.name + ", " + data.sys.country);

          // $("#high-and-low-c").html("<i class='fa fa-long-arrow-up' aria-hidden='true'></i>" + " " + highestTemp[0] + " " + "<i class='fa fa-long-arrow-down' aria-hidden='true'></i>" + " " +lowestTemp[0]);
          // $("#high-and-low-f").html("<i class='fa fa-long-arrow-up' aria-hidden='true'></i>" + " " + highestTemp[1] + " " + "<i class='fa fa-long-arrow-down' aria-hidden='true'></i>" + " " +lowestTemp[1]);
          $("#humidity").html(data.main.humidity + "%");
          $("#temp-celsius").html(temp[0]);
          $("#temp-fahrenheit").html(temp[1]);

          $(".unit-change").click(function () {
            $("#temp-fahrenheit").toggle();
            $("#temp-celsius").toggle();
            // $("#high-and-low-f").toggle();
            // $("#high-and-low-c").toggle();
          });

          //Capitalize first letter of weather description
          var oldString = data.weather[0].description;
          function capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
          }

          $("#weather-description").html(capitalize(oldString));

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
          } else if (weather.indexOf("mist") >= 0) {
              skycons.set("animated-icon", Skycons.FOG);
          } else if (weather.indexOf("wind") >= 0) {
            skycons.set("animated-icon", Skycons.WIND);
          }
        })
      });
    })
  } else {
    	alert("Geolocation is not supported by your browser, download the latest Chrome or Firefox to use this app");
  };
})
