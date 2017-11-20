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

  const date = new Date(data.dt * 1000);
  const hours = (date.getHours().toString().length === 1) ? ('0' + date.getHours()) : (date.getHours());
  const minutes = (date.getMinutes().toString().length === 1) ? ('0' + date.getMinutes()) : (date.getMinutes());
  const formattedTime = hours + ':' + minutes;

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
      tempUnit: 'F', // changing to 'C', Fahrenheit temperature would be default
      description: '',
      humidity: '',
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
      this.setState({
        error: `${e}`
      });
    });

  }

  //Callback for getLocation() - Fetching weather data from Open Weather Map
  getWeather() {

    fetch(`https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=${this.state.latitude}&lon=${this.state.longitude}&APPID=5a5a02f356f4f64fe223c5d5a5efde42`)
    .then(data => data.json())
    .then((response) => {
      document.getElementById('loading').style.display = 'none'; //hide loading spinner
      document.getElementById('btn').style.display = 'inline-block'; //hide loading spinner

      console.log(response);
      const formattedTime = getTime(response);
      const currentTime = response.dt;
      const sunrise = response.sys.sunrise;
      const sunset = response.sys.sunset;
      const tempC = (response.main.temp - 273).toFixed(0) + ' C';
      const tempF = (1.8 * (response.main.temp - 273) + 32).toFixed(0) + ' F';
      const iconID = response.weather[0].id;

      this.setState({
        time: formattedTime,
        location: response.name,
        country: response.sys.country,
        sunrise: response.sys.sunrise,
        sunset: response.sys.sunset,
        tempC: tempC,
        tempF: tempF,
        description: response.weather[0].description,
        humidity: response.main.humidity + '%',
        pressure: response.main.pressure + 'mb',
        icon: (currentTime > sunrise && currentTime < sunset) ? ('wi wi-owm-day-' + iconID + '') : ('wi wi-owm-night-' + iconID + '')
      });

    })
    .catch((e) => {
      this.setState({
        error: `&{e}`
      });
    });
  }

  handleTempToggle(e) {
    const prevTempUnit = this.state.tempUnit;
    prevTempUnit === 'C' ? this.setState({tempUnit: 'F'}) : this.setState({tempUnit: 'C'});
  };

  render() {

    const hasError = this.state.error;

    return(
      <div className="app">
        <div id="loading">Loading</div>
        { !hasError ?
            <div className="app__wrapper">
              <h2>{this.state.location} {this.state.country}</h2>
              <div className="weather-temp">
                {
                  (this.state.tempUnit === 'C') ?
                    <h3>{this.state.tempF}</h3> :
                    <h3>{this.state.tempC}</h3>
                }
              </div>
              <a id='btn' className='btn btn-default' onClick={this.handleTempToggle.bind(this)}>{this.state.tempUnit}</a>
              <i className={this.state.icon}></i>
              <h4 className="weather-description">{this.state.description}</h4>
            </div>
         : (hasError) }
      </div>
    )
  }
}

export default App;
