import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthProvider from './Context/AuthContext';
import { BrowserRouter } from 'react-router-dom';


ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
