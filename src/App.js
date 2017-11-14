import React, { Component } from 'react';

// set up the es6 promise to get the visitor's location
const getLocation = () => {
  const geolocation = navigator.geolocation;

  const location = new Promise((resolve, reject) => {
    if (!geolocation) {
      reject(new Error('Not Supported'));
    }

    geolocation.getCurrentPosition((position) => {
      resolve(position);
    }, () => {
      reject (new Error('Permission denied'));
    });
  });

  return location;
};


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentWeatherInfo: null,
      lat: null,
      long: null,
      tempC: null,
      tempF: null,
      weatherDescription: '',
      weatherIcon: '',
      weatherMain: '',
      location: null,
      tempUnits: 'C'
    }
  }

  componentDidMount() {

    // call the promise
    getLocation()
    .then((position) => {

      // set location on state
      this.setState({
        lat: position.coords.latitude,
        long: position.coords.longitude
      }, this.getWeather);
    })
    .catch((err) => {
      console.log('error in catch', err);
    });
  }


  getWeather() {
    fetch("https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=" + this.state.lat + "&lon=" + this.state.long + "&APPID=5a5a02f356f4f64fe223c5d5a5efde42")
    .then(data => data.json())
    .then((response) => {
      let tempC = (response.main.temp - 273).toFixed(0);
      let tempF = (1.8 * (response.main.temp - 273) + 32).toFixed(0);
      this.setState({
        tempC: tempC,
        tempF: tempF,
        weatherDescription: response.weather[0].description,
        weatherIcon: response.weather[0].icon,
        location: response.name
      });
    })
    .catch((err) => {
      console.log('error ', err);
    });
  }

  handleTempToggle(e) {
    const prevTempUnit = this.state.tempUnits;
    if(prevTempUnit === 'C') {
      this.setState({
        tempUnits: 'F'
      });
    } else {
      this.setState({
        tempUnits: 'C'
      });
    }
  }

  render() {
    return (
      <div>
        <p>Latitude {this.state.lat}</p>
        <p>Longitude {this.state.long}</p>
        <p>Location: {this.state.location}</p>
        <p>Weather Description: {this.state.weatherDescription} <img alt="weathear icon" src={this.state.weatherIcon} /></p>
        <button onClick={this.handleTempToggle.bind(this)}>Toggle between F and C</button>
        <div>Temp:
          { (this.state.tempUnits === 'C') ?
              <p>{this.state.tempC} Celsius</p> :
              <p>{this.state.tempF} Fahrenheit</p> }
          </div>
      </div>
    );
  }

};

export default App;
