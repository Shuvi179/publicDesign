import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import reportWebVitals from './reportWebVitals';

import { ContextProviders } from "./context/сontextProviders";

import "./assets/scss/style.scss";

ReactDOM.render(
  <React.StrictMode>
    <ContextProviders>
      <App />
    </ContextProviders>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
