import React from 'react'
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import UserStore from "./stores/UserStore";

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

    resetForm() {
        this.setState({
            email: '',
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
            let res = await fetch ('login', {
               method: 'post',
               headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json'
               },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password
                })
            });

            let result = await  res.json();
            if (result && result.success) {
                UserStore.isLoggedIn = true;
                UserStore.email = result.email;
            }
            else if (result && result.success === false) {
                this.resetForm();
                alert(result.msg);
            }
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
