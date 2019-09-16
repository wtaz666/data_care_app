import React, { Component } from 'react';
import RouterViews from "routes";
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";

class App extends Component {
  render() {
    return (<div className="App">
              <Router>
                <RouterViews />
              </Router>
      </div>);
  }
}

export default App;