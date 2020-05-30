import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Page from './counter';
import App from './App';
import Home from './uploadS3_v2';
//import Home from './uploadS3';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <Page loginserver="https://4xfwd1debf.execute-api.us-east-1.amazonaws.com/test/login" timeserver="https://4xfwd1debf.execute-api.us-east-1.amazonaws.com/test/time"/>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
