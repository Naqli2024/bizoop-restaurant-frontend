import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {ThemeProvider} from './helpers/ThemeContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider>
     <App />
  </ThemeProvider>
   
  
);

