import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


import Navbar from './components/layout/navbar';
import Home from './components/home';
import Patients from './components/patients';
import Patient from './components/patient';
import Alarms from './components/alarms';


function App() {
  return (

    <Router>
      <div className="App">
        <Navbar />
      </div>
      <div className="container">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/mypatients/" exact component={Patients} />
          <Route path="/mypatients/:patient" component={Patient} />
          <Route path="/myalarms/" exact component={Alarms} />
        </Switch>
      </div>
    </Router >

  );
}

export default App;
