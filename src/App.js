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

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error: '',
      description: ''
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

  //Callback function - Fetching weather data with Open Weather Api
  getWeather() {
    fetch(`https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=${(this.state.latitude)}&lon=${(this.state.longitude)}&APPID=5a5a02f356f4f64fe223c5d5a5efde42`)
    .then(data => data.json())
    .then((response) => {
      console.log(response);
      this.setState({
        description: response.weather[0].description,
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
      <div className="wrapper">
        <div className="app">
          { !hasError ?
            (<h2>location: {this.state.latitude} {this.state.longitude} {this.state.description}</h2>)

            : (hasError)}
        </div>
      </div>
    )
  }
}

export default App;
