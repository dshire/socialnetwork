import React from 'react';
import axios from './axios';
import { Link } from 'react-router';

export const Login = authWrap(LoginForm, '/login');
export const Registration = authWrap(RegistrationForm, '/register');


export function Welcome(props) {
    return (
        <div>
            <h1>Welcome to this Social Network!</h1>
            {props.children}
        </div>
    )
}

function authWrap(Component, url) {
    return class AuthForm extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
            this.url = url;
        }
        handleChange(e){
            this.setState({
                [e.target.name]: e.target.value
            })
        }
        submit() {
            const {first, last, email, pass} = this.state;
            console.log('about to submit', { first, last, email, pass })
            axios.post(url, { first, last, email, pass })
                .then(resp => {
                    const data = resp.data;
                    if (!data.success) {
                        console.log(data)
                        this.setState({
                            error: data.error
                        })
                    } else {
                        location.replace('/');
                    }
                })
        }
        render() {
            return <Component error={this.state.error} handleChange={ e => this.handleChange(e)} submit={ () => this.submit()} />;
        }
    }
}

function LoginForm({ handleChange, submit, error }) {
    return (
        <div>
            <h3>Log in</h3>
            {error && <div className="error">{error}</div>}
            <p>Email:</p>
            <input required type="email" name="email" onChange= {e => handleChange(e)} />
            <p>Password:</p>
            <input required name="pass" type="password" onChange={e => handleChange(e)} />
            <button onClick={submit}>Log in</button>
            <Link to={"/"}>Register now</Link>
        </div>
    );
}

function RegistrationForm({ handleChange, submit, error }) {
    return (
        <div>
            <h3>Register</h3>
            {error && <div className="error">{error}</div>}
            <p>First Name:</p>
            <input required name="first" onChange= {e => handleChange(e)} />
            <p>Last Name:</p>
            <input required name="last" onChange={e => handleChange(e)} />
            <p>Email:</p>
            <input required type="email" name="email" onChange= {e => handleChange(e)} />
            <p>Password:</p>
            <input required name="pass" type="password" onChange={e => handleChange(e)} />
            <button onClick={submit}>Register</button>
            <Link to={"/login"}>Log in</Link>
        </div>
    );
}
