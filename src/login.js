import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';

export class Login extends React.Component{
        constructor(props){
            super(props);
            this.state = {};
            this.handleChange = this.handleChange.bind(this)
        }
        submit() {
            const {email, pass} = this.state;
            console.log('about to submit', { email, pass })
            axios.post('/login', { email, pass })
            .then(resp => {
                const data = resp.data;

                if (!data.success) {
                    this.setState({
                        error: data.error
                    })
                } else {
                    location.replace('/');
                }
            })
        }
        handleChange(e){
            this.setState({
                [e.target.name]: e.target.value
            })
        }
        render() {
            return (
                <div>
                    <h3>Log in</h3>
                    {this.state.error && <div className="error">{this.state.error}</div>}
                    <p>Email:</p>
                    <input name="email" onChange= {e => this.handleChange(e)} />
                    <p>Password:</p>
                    <input name="pass" type="password" onChange={e => this.handleChange(e)} />
                    <button onClick={e => this.submit()}>Log in</button>
                    <Link to={"/"}>Register now</Link>
                </div>
            );
        }
}
