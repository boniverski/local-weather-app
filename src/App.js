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

//Converts Unix timestamp
const getTime = (data) => {

  const date = new Date(data.dt * 1000);
  const hours = (date.getHours().toString().length === 1) ? ('0' + date.getHours()) : (date.getMinutes());
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
      description: '',
      time: '',
      sunrise: '',
      sunset: '',
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

  //Callback function for getLocation() - Fetching weather data with Open Weather Api
  getWeather() {
    fetch(`https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=${this.state.latitude}&lon=${this.state.longitude}&APPID=5a5a02f356f4f64fe223c5d5a5efde42`)
    .then(data => data.json())
    .then((response) => {
      console.log(response);
      const formattedTime = getTime(response);
      const currentTime = response.dt;
      const sunrise = response.sys.sunrise;
      const sunset = response.sys.sunset;

      this.setState({
        description: response.weather[0].description,
        time: formattedTime,
        sunrise: response.sys.sunrise,
        sunset: response.sys.sunset,
        icon: (currentTime > sunrise && currentTime < sunset) ? ('wi wi-owm-day-' + response.weather[0].id + '') : ('wi wi-owm-night-' + response.weather[0].id + '')
      })

    })
    .catch((e) => {
      this.setState({
        error: `&{e}`
      });
    });
  }

  render() {

    const hasError = this.state.error;

    return(
      <div className="app">
        { !hasError ?
          <div>
            <h2>location: {this.state.time} {this.state.latitude} {this.state.longitude} {this.state.description}</h2>
            <i className={this.state.icon}></i>
          </div>
          : (hasError)}
      </div>
    )
  }
}

export default App;
