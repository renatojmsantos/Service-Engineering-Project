import React, { Component } from "react";
import ReactDom from 'react-dom';

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
            <form>
                Login <input type="text" value={this.state.login} onChange={this.handleLoginChange}/> <br/>
                Password <input type="password" value={this.state.password} onChange={this.handlePasswordChange}/> <br/>
                <input type="button" value="submit" onClick={this.props.login.bind(this.props.parent, this.state.login, this.state.password)}/>
            </form>
        )
    }
}


class Watch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {date : ''};
    }

    componentWillMount() {
        var theobject = this
        console.log('this =', this)
        console.log('this.props =', this.props)
  fetch(this.props.timeserver, {
            headers:{
              'authorizationToken' : JSON.stringify({ 'token' : this.props.token })
            }
        }).then(data => data.json())
          .then(thedate => theobject.setState({date : thedate}))
    .catch(function(error) {
            console.log('There has been a problem with your fetch operation: ', error.message);
           });
    }

    render() {
        console.log('date =', this.state.date)
        return <h2>{this.state.date}</h2>
    }
}


class Page extends React.Component {
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
            method: 'POST', // or 'PUT'
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
                <div>
                    {errormessage}
                    <Watch timeserver={this.props.timeserver} token={this.state.token}/>
                </div>
            )
    }
}

export default Page;