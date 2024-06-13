import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './bigLoader.css'
import { AuthProvider } from 'react-auth-kit';
import axios from 'axios';

axios.defaults.baseURL = "https://beltzy-server.onrender.com"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider
    authType={"cookie"}
    authName={"_auth"}
    cookieDomain={window.location.hostname}
    cookieSecure={false}
  >
    <App />
  </AuthProvider>

);
