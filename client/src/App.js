import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
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
import Account from './components/auth/account';

function App() {


  return (
    <div>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Switch>
              <NonPrivateRoute exact path={["/", "/login"]} component={Login} />
              <NonPrivateRoute path="/register" component={Register} />

              <PrivateRoute exact path="/user/account" roles={["doctor", "patient"]} component={Account} />
              <PrivateRoute path="/home" roles={["doctor", "patient"]} component={Home} />
              <PrivateRoute exact path="/mypatients/" roles={["doctor"]} component={Patients} />
              <PrivateRoute path="/mypatients/:patient" roles={["doctor"]} component={Patient} />
              <PrivateRoute exact path="/myalarms/" roles={["doctor"]} component={Alarms} />
            </Switch>
          </div>
        </div>
      </Router >
      <Footer />
    </div>
  );
}


export default App;
