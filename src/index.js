import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LoginPage from './LoginPage';
import SearchLocation from './SearchLocation';
import App from './App';
import Home from './uploadS3_v2';
//import Home from './uploadS3';
import {BrowserRouter as Router,Route,Redirect,Switch} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

/*
function Routes(){
  return (
    <Router>
      <div>
        <Switch>
            <Route path="/" component = {LoginPage}/>
            <Redirect from='/App/' to="/SearchLocation/" />
            <Route path="/SearchLocation/" component={SearchLocation} />
        </Switch>
      </div>
    </Router>
  )
}
*/
ReactDOM.render(
    <LoginPage loginserver="https://4xfwd1debf.execute-api.us-east-1.amazonaws.com/proj/login"/>,
    //<App />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
