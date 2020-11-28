import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import PrivateRoute from './hocs/privateRoute';
import NonPrivateRoute from './hocs/nonPrivateRoute';
import Navbar from './components/layout/navbar';
import Footer from './components/layout/footer/footer';
import HomeDoctor from './components/homeDoctor';
import Patients from './components/patients';
import Patient from './components/patient';
import Alarms from './components/alarms';
import Login from './components/auth/login';
import Register from './components/auth/register';
import Account from './components/auth/account';
import HomePatient from './components/patient/homePatient'
import Posts from './components/patient/posts'
import Devices from './components/patient/devices'
import DeviceAdded from './components/patient/deviceAdded'

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

              <PrivateRoute path="/doctor" roles={["doctor"]} component={HomeDoctor} /> 
              <PrivateRoute exact path="/mypatients" roles={["doctor"]} component={Patients} />
              <PrivateRoute path="/mypatients/:patient" roles={["doctor"]} component={Patient} />
              <PrivateRoute path="/myalarms" roles={["doctor"]} component={Alarms} />

              <PrivateRoute exact path="/patient" roles={["patient"]} component={HomePatient} />
              <PrivateRoute path="/myposts" roles={["patient"]} component={Posts} />
              <PrivateRoute path="/mydevices" roles={["patient"]} component={Devices} />
              <PrivateRoute path="/device_added" roles={["patient"]} component={DeviceAdded} />
            </Switch>
          </div>
        </div>
      </Router >
      <Footer />
    </div>
  );
}


export default App;
