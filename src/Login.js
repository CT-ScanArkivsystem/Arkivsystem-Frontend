import React from 'react'
import { observer } from "mobx-react";
import UserStore from "./stores/UserStore";
import SubmitButton from "./SubmitButton";
import LoginForm from "./LoginForm";

import './Login.css';

class Login extends React.Component {

    async componentDidMount() {
        try {
            let response = await fetch('/auth/login', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            let result = await response.json();

            if (result && result.success) {
                UserStore.loading = false;
                UserStore.isLoggedIn = true;
                UserStore.firstName = result.firstName;
            }
            else {
                UserStore.loading = false;
                UserStore.isLoggedIn = false;
            }
        }
        catch (e) {
            UserStore.loading = false;
            UserStore.isLoggedIn = false;
        }
    }

    async doLogout() {
        try {
            let response = await fetch('/logout', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            let result = await response.json();

            if (result && result.success) {
                UserStore.isLoggedIn = false;
                UserStore.firstName = '';
                UserStore.lastName = '';
            }
            else {
                UserStore.loading = false;
                UserStore.isLoggedIn = false;
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    render() {

        if (UserStore.loading) {
            return (
                <div className="app">
                    <div className='container'>
                      <p>Loading, please wait..</p>
                    </div>
                </div>
            )
        }
        else {
            if (UserStore.isLoggedIn) {
                return (
                <div className="app">
                    <div className='container'>
                        <p>Welcome {UserStore.firstName}!</p>
                        <SubmitButton
                            text={'Log out'}
                            disabled={false}
                            onClick={ () => this.doLogout() }
                        />
                    </div>
                </div>
                );
            }
            else {
                return (
                  <div className="app">
                      <div className='container'>
                          <LoginForm />
                      </div>
                  </div>
                );
            }
        }

        /*
        return (
            <div className="Login">
                <header className="Login-header">
                    <h1>Login</h1>
                    <p>Please enter e-mail and password: </p>
                    <form>
                        <label>E-mail: </label>
                        <input type={"text"} name={"email"}></input><br/>
                        <label>Password: </label>
                        <input type={"text"} name={"password"}></input>
                    </form>
                </header>
            </div>
        );
        */
    }
}

export default observer(Login);
