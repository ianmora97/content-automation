import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// SCSS
import './scss/index.scss';
import 'animate.css/animate.css'
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away-extreme.css';

// Bootstrap
import 'bootstrap/dist/js/bootstrap.js';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
