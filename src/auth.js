import React from 'react';
import axios from './axios';
import { Link } from 'react-router';

export const Login = authWrap(LoginForm, '/login');
export const Registration = authWrap(RegistrationForm, '/register');


export function Welcome(props) {
    return (
        <div>
            <div id="title-wrapper">
                <h1 id="welcome-title" >THIS IS NOT A SOCIAL NETWORK</h1>
            </div>
            {props.children}
        </div>
    );
}

function authWrap(Component, url) {
    return class AuthForm extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
            this.url = url;
        }
        handleChange(e){
            this[e.target.name] = e.target.value;
        }
        submit() {
            const {first, last, email, pass} = this;
            console.log('about to submit', { first, last, email, pass });
            axios.post(url, { first, last, email, pass })
                .then(resp => {
                    const data = resp.data;
                    if (!data.success) {
                        console.log(data);
                        this.setState({
                            error: data.error
                        });
                    } else {
                        location.replace('/');
                    }
                });
        }
        render() {
            return <Component error={this.state.error} handleChange={ e => this.handleChange(e)} submit={ () => this.submit() } />;
        }
    };
}

function LoginForm({ handleChange, submit, error }) {
    return (
        <div className="auth-form-container">
            <h3>Log In:</h3>
            {error && <div className="error">{error}</div>}
            <p>Email</p>
            <input required type="email" name="email" onChange= {e => handleChange(e)} />
            <p>Password</p>
            <input required name="pass" type="password" onChange={e => handleChange(e)} />
            <button onClick={submit}>Submit</button>
            <Link to={"/"}>Register</Link>
        </div>
    );
}

function RegistrationForm({ handleChange, submit, error }) {
    return (
        <div className="auth-form-container">
            <h3>Register:</h3>
            {error && <div className="error">{error}</div>}
            <p>First Name</p>
            <input required name="first" onChange= {e => handleChange(e)} />
            <p>Last Name</p>
            <input required name="last" onChange={e => handleChange(e)} />
            <p>Email</p>
            <input required type="email" name="email" onChange= {e => handleChange(e)} />
            <p>Password</p>
            <input required name="pass" type="password" onChange={e => handleChange(e)} />
            <button onClick={submit}>Submit</button>
            <Link to={"/login"}>Log in</Link>
        </div>
    );
}
