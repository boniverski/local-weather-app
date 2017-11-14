import React, { Component } from 'react';

//
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
      error: ''
    }
  }

  componentDidMount() {

    getLocation()
    .then((position) => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    })
    .catch((e) => {
      this.setState({
        error: `${e}`
      });
    });

  }

  render() {
    const hasError = this.state.error;
    return(
      <div>
        {!hasError ? (<h2>location: {this.state.latitude} {this.state.longitude}</h2>) : (hasError)}
      </div>
    )
  }
}

export default App;
