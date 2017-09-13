import React from 'react';
import axios from './axios';

export class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { status: this.props.status, sendId: this.props.sendId };
        this.friendUpdate = this.friendUpdate.bind(this);
        this.reject = this.reject.bind(this);
    }
    friendUpdate(){
        axios.post('/api/friendUpdate/' + this.props.friendId, { status: this.state.status, sendId: this.state.sendId })
            .then((res) => {
                this.setState({ status: res.data.status, sendId: res.data.sendId });
            });
    }
    reject(){
        axios.post('/api/reject/' + this.props.friendId, {})
            .then((res) => {
                this.setState({ status: res.data.status, sendId: res.data.sendId });
            });
    }
    render(){
        var friendButton;
        if (this.state.status == 1) {
            friendButton = 'End Friendship';
        } else if (this.state.status == 2 && this.state.sendId == this.props.id) {
            friendButton = 'Cancel Friend Request';
        } else if (this.state.status == 2 && this.state.sendId == this.props.friendId) {
            friendButton = 'Accept Friendship';
        } else {
            friendButton = 'Add Friend';
        }
        var rejectButton;
        if (this.state.status == 2 && this.state.sendId == this.props.friendId) {
            rejectButton = <button onClick={this.reject}>Reject Friendship</button>;
        }
        return(
            <div>
                <button onClick={this.friendUpdate}>{friendButton}</button>
                {rejectButton}
            </div>
        );
    }
}
