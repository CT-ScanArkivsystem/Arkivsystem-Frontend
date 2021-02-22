import React from 'react'
import { observer } from "mobx-react";
import { configure } from "mobx";
import UserStore from "./stores/UserStore";
import SubmitButton from "./SubmitButton";
import LoginForm from "./LoginForm";

import './Login.css';

// Stops warning when changing an observable value without using an action.
configure({ enforceActions: 'never'});

class Login extends React.Component {


    //Function checks if user is already logged in when entering the site
    async componentDidMount() {
        try {
            let res = await fetch('http://localhost:8080/user/allUsers', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                },
            });

            let result = await res.json();

            if (result !== null && result !== "") {
                UserStore.loading = false;
                UserStore.isLoggedIn = true;
                UserStore.firstName = result.firstName;
                UserStore.lastName = result.lastName;
                UserStore.email = result.email;
                //TODO: Get info from user when there is a getUser request
            }
            else {
                UserStore.loading = false;
                UserStore.isLoggedIn = false;
            }
        }
        catch (e) {
            UserStore.loading = false;
            UserStore.isLoggedIn = false;
            console.log("Something went wrong: " + e);
            //TODO: TELL THE USER SOMETHING WENT WRONG!
        }
    }

    // Logs out the user
    async doLogout() {
        try {
            let res = await fetch('http://localhost:8080/auth/logout', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                },
            });
            //let result = await res.json();

            //TODO: The cookie that holds the JWT token needs to be cleared to log out from the system!
            //Clear token here
            //This if test should check if the token is there or not, if not clear info.
            if (UserStore.isLoggedIn) {
                UserStore.isLoggedIn = false;
                UserStore.firstName = '';
                UserStore.lastName = '';
                UserStore.email = '';
            } else {
                UserStore.loading = false;
                UserStore.isLoggedIn = false;
            }
        }
        catch (e) {
            console.log("Something went wrong: " + e);
            //TODO: TELL THE USER SOMETHING WENT WRONG!
        }
    }

    async doGetAllUsers() {
        try {
            let res = await fetch ('http://localhost:8080/user/allUsers', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                },
            });

            let result = await res.json();
            let didFindStuff;

            if (result !== null && result !== "") {
                didFindStuff = true;
                console.log("didFindStuff: " + didFindStuff);
            } else {
                didFindStuff = false;
                console.log("didFindStuff: " + didFindStuff);
            }
            //return <p className={'messageToUser'}>{didFindStuff}</p>;
        }
        catch (e) {
            console.log("Something went wrong: " + e);
            //TODO: TELL THE USER SOMETHING WENT WRONG!
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
                            text={'Get all users request'}
                            disabled={false}
                            onClick={ () => this.doGetAllUsers() }
                            />
                        <SubmitButton
                            text={'Log out'}
                            disabled={false}
                            onClick={ () => this.doLogout() }
                        />
                        <p className={'messageToUser'}></p>
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
