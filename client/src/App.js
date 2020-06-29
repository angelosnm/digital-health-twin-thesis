import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import PrivateRoute from './hocs/privateRoute';
import NonPrivateRoute from './hocs/nonPrivateRoute';
import Navbar from './components/layout/navbar';
import Footer from './components/layout/footer/footer';
import Home from './components/home';
import Patients from './components/patients';
import Patient from './components/patient';
import Alarms from './components/alarms';
import Login from './components/auth/login';
import Register from './components/auth/register';


function App() {


  return (
    <div>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">

            <Switch>
              <NonPrivateRoute path="/login" component={Login} />
              <NonPrivateRoute path="/register" component={Register} />
              <PrivateRoute path="/home" component={Home} />
              <PrivateRoute exact path="/mypatients/" component={Patients} />
              <PrivateRoute path="/mypatients/:patient" component={Patient} />
              <PrivateRoute exact path="/myalarms/" component={Alarms} />
            </Switch>
          </div>
        </div>
      </Router >
      <Footer />
    </div>
  );
}


export default App;
