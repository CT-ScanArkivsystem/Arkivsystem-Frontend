import React from 'react'
import { observer } from "mobx-react";
import UserStore from "./stores/UserStore";
import SubmitButton from "./SubmitButton";
import LoginForm from "./LoginForm";

import './Login.css';

class Login extends React.Component {

    //Function checks if user is already logged in when entering the site
    async componentDidMount() {
        UserStore.loading = false;

        /*try {
            let res = await fetch('http://localhost:8080/user/allUsers', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });

            let result = await res.json();

            if (result !== null && result !== "") {
                UserStore.loading = false;
                UserStore.isLoggedIn = true;
                //UserStore.firstName = result.firstName;
            }
            else {
                UserStore.loading = false;
                UserStore.isLoggedIn = false;
            }
        }
        catch (e) {
            UserStore.loading = false;
            UserStore.isLoggedIn = false;
        }*/
    }

    // Logs out the user
    async doLogout() {
        //TODO: The cookie that holds the JWT token needs to be cleared to log out from the system!
        //Clear token here
        //This if test should check if the token is there or not, if not clear info.
        if (UserStore.isLoggedIn) {
            UserStore.isLoggedIn = false;
            UserStore.firstName = '';
            UserStore.lastName = '';
        }
        else {
            UserStore.loading = false;
            UserStore.isLoggedIn = false;
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
