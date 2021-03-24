import React from 'react';
import './App.css';
import { HashRouter, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import PrivateRoute from './hocs/privateRoute';
import NonPrivateRoute from './hocs/nonPrivateRoute';
import Navbar from './components/layout/navbar';
import Footer from './components/layout/footer/footer';
import HomeDoctor from './components/doctor/homeDoctor';
import Patients from './components/doctor/patients';
import Patient from './components/doctor/patient';
import Alarms from './components/doctor/alarms';
import Login from './components/auth/login';
import Register from './components/auth/register';
import HomePatient from './components/patient/homePatient'
import Toots from './components/patient/toots'
import Devices from './components/patient/devices'
import DeviceAdded from './components/patient/deviceAdded'

function App() {

  return (
    <div>
      <HashRouter>
        <div className="App">
          <Navbar />
          <div className="container">
            <Switch>
              <NonPrivateRoute exact path={["/", "/login"]} component={Login} />
              <NonPrivateRoute path="/register" component={Register} />

              <PrivateRoute path="/doctor" roles={["doctor"]} component={HomeDoctor} />
              <PrivateRoute exact path="/mypatients" roles={["doctor"]} component={Patients} />
              <PrivateRoute path="/mypatients/:patient" roles={["doctor"]} component={Patient} />
              <PrivateRoute path="/myalarms" roles={["doctor"]} component={Alarms} />

              <PrivateRoute exact path="/patient" roles={["patient"]} component={HomePatient} />
              <PrivateRoute path="/mytoots" roles={["patient"]} component={Toots} />
              <PrivateRoute path="/mydevices" roles={["patient"]} component={Devices} />
              <PrivateRoute path="/added" roles={["patient"]} component={DeviceAdded} />
            </Switch>
          </div>
        </div>
      </HashRouter >
      <Footer />
    </div>
  );
}


export default App;
