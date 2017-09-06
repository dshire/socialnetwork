import React from 'react';
import axios from 'axios';


export class Register extends React.Component{
        constructor(props){
            super(props);
            this.state = {};
            this.handleChange = this.handleChange.bind(this)
        }
        submit() {
            const {first, last, email, pass} = this.state;
            console.log('about to submit', { first, last, email, pass })
            axios.post('/register', { first, last, email, pass })
            .then(resp => {
                const data = resp.data;

                if (!data.success) {
                    this.setState({
                        error: true
                    })
                } else {
                    location.replace('/');
                }
            })
        }
        handleChange(e){
            this.setState({
                [e.target.name]: e.target.value
            }
            // , ()=> {console.log(this.state)}
            )
        }
        render() {
            return (
                <div>
                    {this.state.error && <div className="error">YOU MESSED UP</div>}
                    <p>First Name:</p>
                    <input name="first" onChange= {e => this.handleChange(e)} />
                    <p>Last Name:</p>
                    <input name="last" onChange={e => this.handleChange(e)} />
                    <p>Email:</p>
                    <input name="email" onChange= {e => this.handleChange(e)} />
                    <p>Password:</p>
                    <input name="pass" type="password" onChange={e => this.handleChange(e)} />
                    <button onClick={e => this.submit()}>Submit</button>
                    <a href="/login">Log in</a>
                </div>
            );
        }
}
