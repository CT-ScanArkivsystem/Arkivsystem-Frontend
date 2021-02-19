import React from 'react'
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import UserStore from "./stores/UserStore";

/**
 * This class is the form where the users will fill in their email and password.
 * This class also sends the POST request for the log in when the user hits the submit button.
 */
class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            buttonDisabled: false
        }
    }

    setInputValue(property, value) {
        value = value.trim();
        if (value.length > 100) {
            return;
        }
        this.setState({
            [property]: value
        })
    }
    // Resets both input fields and enables the submit button
    resetForm() {
        this.setState({
            email: '',
            password: '',
            buttonDisabled: false
        })
    }
    // Only resets the password input field and enables the submit button
    resetPassword() {
        this.setState( {
            email: this.state.email,
            password: '',
            buttonDisabled: false
        })
    }

    async doLogin() {
        if (!this.state.email) {
            return;
        }
        if (!this.state.password) {
            return;
        }

        this.setState({
            buttonDisabled: true
        })

        try {
            let res = await fetch ('http://localhost:8080/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json'
               },
                //NB! In the backend the login system treats the email to login as username. 16.02.2021
                //credentials: 'same-origin',
                body: JSON.stringify({
                    username: this.state.email,
                    password: this.state.password,
                })
            });
            let result = await res.json();
            if (result && result.success) {
                UserStore.isLoggedIn = true;
                UserStore.firstName = result.firstName;
                UserStore.lastName = result.lastName;
                UserStore.email = result.email;
            }
            else if (!result || (result.success !== true)) {
                this.resetPassword();
                console.log("Did not log in");
            }
            console.log("isLoggedIn: " + UserStore.isLoggedIn);
        }
        catch (e) {
            console.log(e);
            this.resetForm();
        }
    }

    render() {
        return (
            <div className="loginForm">
                Log in
                <InputField
                    type='text'
                    placeholder='Email'
                    value={this.state.email ? this.state.email : ''}
                    onChange={ (value) => this.setInputValue('email', value)}
                />
                <InputField
                    type='password'
                    placeholder='Password'
                    value={this.state.password ? this.state.password : ''}
                    onChange={ (value) => this.setInputValue('password', value)}
                />
                <SubmitButton
                    text='Login'
                    disabled={this.state.buttonDisabled}
                    onClick={ () => this.doLogin() }
                />


            </div>
        );
    }
}

export default LoginForm;
