import React from 'react';
import axios from './axios';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';


export class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        if (this.props.params.id == this.props.id) {
            browserHistory.push('/');
        }
    }
    componentDidMount(){
        axios.get('/api/user/' + this.props.params.id).then((res) => {
            var { url, pic, first, last, bio} = res.data;
            this.setState({  url, pic, first, last, bio });
        });
    }
    render(){
        this.src = this.state.url + this.state.pic;
        return(
            <div>
                <img id="profile-pic" src={this.src} alt={this.state.first + ' ' + this.state.last} title={this.state.first + ' ' + this.state.last}/>
                <h2>{this.state.first} {this.state.last}</h2>
                <p>{this.state.bio}</p>
            </div>
        );
    }
}
