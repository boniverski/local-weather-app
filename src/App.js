import React, { Component } from 'react';
import './App.css';

//Setting up a promise for user's location
const getLocation = () => {

  const geolocation = navigator.geolocation;
  const location = new Promise((resolve, reject) => {
    if (!geolocation) {
      reject(new Error('Geolocation is not supported by this browser!'));
    }

    geolocation.getCurrentPosition((position) => {
      resolve(position);
    }, () => {
      reject (new Error('Access denied! Please allow your browser for reading your location.'));
    });
  });

  return location;
};

//Convert Unix timestamp
const getTime = (data) => {

  const date = new Date(data.dt * 1000),
        hours = (date.getHours().toString().length === 1) ? ('0' + date.getHours()) : (date.getHours()),
        minutes = (date.getMinutes().toString().length === 1) ? ('0' + date.getMinutes()) : (date.getMinutes()),
        formattedTime = hours + ':' + minutes;

  return formattedTime;
}

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error: '',
      time: '',
      location: '',
      country: '',
      sunrise: '',
      sunset: '',
      temp: '',
      tempUnit: '°F', // changing to 'C', Fahrenheit will be default
      weatherDescription: '',
      humidity: '',
      pressure: '',
      icon: ''
    }
  }

  componentDidMount() {

    getLocation()
      .then((position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }, this.getWeather);
      })
      .catch((e) => {
        console.log(e);
        this.setState({
          error: 'Something went wrong! Error is logged in console.'
        });
      });

  }

  //Callback for getLocation() - Fetching weather data from Open Weather Map
  getWeather() {

    fetch(`https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=${this.state.latitude}&lon=${this.state.longitude}&APPID=5a5a02f356f4f64fe223c5d5a5efde42`)
      .then(data => data.json())
      .then((response) => {

        document.getElementById('loading-spinner').remove();
        document.getElementById('btn').style.display = 'inline-block'; // Display button after data is loaded

        const formattedTime = getTime(response),
              currentTime = response.dt,
              sunrise = response.sys.sunrise,
              sunset = response.sys.sunset,
              humidity = 'Humidity: ' + response.main.humidity + '%',
              pressure = 'Pressure: ' + response.main.pressure + 'mb',
              tempC = (response.main.temp - 273).toFixed(0) + '°C',
              tempF = (1.8 * (response.main.temp - 273) + 32).toFixed(0) + '°F',
              iconID = response.weather[0].id,
              icon = (currentTime > sunrise && currentTime < sunset) ? ('wi wi-owm-day-' + iconID + '') : ('wi wi-owm-night-' + iconID + ''),

              weatherDescription = () => {
                const getDescription = response.weather[0].description;
                return getDescription.charAt(0).toUpperCase() + getDescription.slice(1);
              }

        this.setState({
          time: formattedTime,
          location: response.name,
          country: response.sys.country,
          sunrise: response.sys.sunrise,
          sunset: response.sys.sunset,
          tempC: tempC,
          tempF: tempF,
          weatherDescription: weatherDescription(),
          humidity: humidity,
          pressure: pressure,
          icon: icon
        });

      })
      .catch((e) => {
        console.log(e);
        this.setState({
          error: 'Something went wrong! Error is logged in console.'
        });
      })
  }

  handleTempToggle = (e) => {
    const prevTempUnit = this.state.tempUnit;
    prevTempUnit === '°C' ? this.setState({tempUnit: '°F'}) : this.setState({tempUnit: '°C'});
  };

  render() {
    const hasError = this.state.error;

    return(
      <div className='app'>
        <div id='loading-spinner'></div>

        { !hasError ?

            <div className='app__wrapper'>
              <h2 className='weather-location'>
                {this.state.location}
              </h2>
              <div className='weather-temp'>
                {
                  this.state.tempUnit === '°C' ?
                    <div>{this.state.tempF}</div> :
                    <div>{this.state.tempC}</div>
                }
                <div>
                  <i className={this.state.icon}></i>
                </div>
              </div>
              <div className='weather-description'>{this.state.weatherDescription}</div>
              <duv className='weather-features'>
                <div>
                  {this.state.humidity}
                </div>
                <div>
                  {this.state.pressure}
                </div>
              </duv>
              <a id='btn' className='btn btn-default' onClick={this.handleTempToggle}>
                {this.state.tempUnit}
              </a>
            </div>

          : hasError }

      </div>
    )
  }
}

export default App;
