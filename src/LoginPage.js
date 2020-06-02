import React, { Component } from "react";
import ReactDom from 'react-dom';
import App from './App'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {login : '', password : ''}
        this.handleLoginChange = this.changeLogin.bind(this);
        this.handlePasswordChange = this.changePassword.bind(this);
    }

    changeLogin(event) {
        this.setState({ login : event.target.value })
    }

    changePassword(event) {
        this.setState({ password : event.target.value })
    }

    render () {
        return (
           
            <form align="center">
                <h1>ES - Project #2</h1>
                Login <input type="text" value={this.state.login} onChange={this.handleLoginChange}/> <br/>
                Password <input type="password" value={this.state.password} onChange={this.handlePasswordChange}/> <br/>
                <input type="button" value="submit" onClick={this.props.login.bind(this.props.parent, this.state.login, this.state.password)}/>
            </form>
        )
    }
}

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {token : undefined, errormessage : undefined };
    }

    authenticated(token) {
        this.setState({ token : token, errormessage : undefined })
    }

    failedauthenticated() {
        this.setState({ token : undefined, errormessage : 'Authentication Error' })
    }

    doLogin(login, password) {
        var theobject = this
        var formparameters = {
            method: 'POST', //para nao ficar visivel
            body: JSON.stringify({'login' : login, 'password' : password}),
            headers:{
              'Content-Type': 'application/json'
            }
        }
  fetch(this.props.loginserver, formparameters).then(function(data) {
            if(data.status!==200) {
                theobject.failedauthenticated()
                throw new Error(data.status)
            }
            else {
                var json = data.json();
                return json;
            }
  }).then(function(thetoken) {
            console.log('message =', thetoken)
            if ('token' in thetoken)
                theobject.authenticated(thetoken['token'])
  }).catch(function(error) {
            console.log('There has been a problem with your fetch operation: ', error.message);
        });
    }

    render() {
        console.log(this.state.token)
        if (this.state.errormessage != undefined)
            var errormessage = <h2>{this.state.errormessage}</h2>
        else
            var errormessage = <div/>
        if (this.state.token == undefined)
            return (
                <div> 
                    {errormessage}
                    <Login parent={this} login={this.doLogin}/>
                </div>
            )
        else
            return (
                <App/>
            )
    }
}

export default LoginPage;