import React from 'react';
import axios from './axios';

export class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { status: this.props.status, recId: this.props.recId };
        this.friendUpdate = this.friendUpdate.bind(this);
    }
    friendUpdate(){
        axios.post('/api/friendUpdate/' + this.props.friendId, { status: this.state.status, recId: this.state.recId })
            .then((res) => {
                this.setState({ status: res.data.status, recId: res.data.recId });
            });
    }
    render(){
        var friendButton;
        if (this.state.status == 1) {
            friendButton = 'End Friendship';
        } else if (this.state.status == 2 && this.state.recId == this.props.id) {
            friendButton = 'Accept Friendship';
        } else if (this.state.status == 2 && this.state.recId == this.props.friendId) {
            friendButton = 'Cancel Friend Request';
        } else {
            friendButton = 'Add Friend';
        }
        return(
            <button onClick={this.friendUpdate}>{friendButton}</button>
        );
    }
}
