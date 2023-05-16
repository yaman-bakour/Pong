import './App.css';
import React , { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import Pong from "./components/pong"

class App extends Component {
  state = {};
  render () {
    return (
    <React.Fragment>
        <Pong />    
    </React.Fragment>
    );
  } 
}
export default App;