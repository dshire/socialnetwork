import React from 'react';
import axios from './axios';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';


export class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.friendUpdate = this.friendUpdate.bind(this);
        if (this.props.params.id == this.props.id) {
            browserHistory.push('/');
        }
    }
    componentDidMount(){
        axios.get('/api/user/' + this.props.params.id).then((res) => {
            var { url, pic, first, last, bio, status, recId} = res.data;
            this.setState({  url, pic, first, last, bio, status, recId });
        });
    }
    friendUpdate(){
        axios.post('/api/friendUpdate/' + this.props.params.id, { status: this.state.status, recId: this.state.recId })
            .then((res) => {
                this.setState({ status: res.data.status, recId: res.data.recId });
            });
    }
    render(){
        this.src = this.state.url + this.state.pic;
        var friendButton;
        if (this.state.status == 1) {
            friendButton = 'End Friendship';
        } else if (this.state.status == 2 && this.state.recId == this.props.id) {
            friendButton = 'Accept Friendship';
        } else if (this.state.status == 2 && this.state.recId == this.props.params.id) {
            friendButton = 'Cancel Friend Request';
        } else {
            friendButton = 'Add Friend';
        }
        return(
            <div>
                <img id="profile-pic" src={this.src} alt={this.state.first + ' ' + this.state.last} title={this.state.first + ' ' + this.state.last}/>
                <h2>{this.state.first} {this.state.last}</h2>
                <p>{this.state.bio}</p>
                <button onClick={this.friendUpdate}>{friendButton}</button>
            </div>
        );
    }
}
