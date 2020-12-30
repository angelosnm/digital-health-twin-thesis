import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
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
              <NonPrivateRoute exact path={["/", "/dht/login"]} component={Login} />
              <NonPrivateRoute path="/dht/register" component={Register} />

              <PrivateRoute path="/dht/doctor" roles={["doctor"]} component={HomeDoctor} />
              <PrivateRoute exact path="/dht/mypatients" roles={["doctor"]} component={Patients} />
              <PrivateRoute path="/dht/mypatients/:patient" roles={["doctor"]} component={Patient} />
              <PrivateRoute path="/dht/myalarms" roles={["doctor"]} component={Alarms} />

              <PrivateRoute path="/dht/patient" roles={["patient"]} component={HomePatient} />
              <PrivateRoute path="/dht/myposts" roles={["patient"]} component={Posts} />
              <PrivateRoute path="/dht/mydevices" roles={["patient"]} component={Devices} />
              <PrivateRoute path="/dht/device" roles={["patient"]} component={DeviceAdded} />
            </Switch>
          </div>
        </div>
      </Router >
      <Footer />
    </div>
  );
}


export default App;
