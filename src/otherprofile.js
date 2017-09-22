import React from 'react';
import axios from './axios';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import { FriendButton } from './friendButton';


export class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        if (this.props.params.id == this.props.id) {
            browserHistory.push('/');
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.location.pathname != prevProps.location.pathname) {
            if (this.props.params.id == this.props.id) {
                browserHistory.push('/');
            } else {
                axios.get('/api/user/' + this.props.params.id).then((res) => {
                    var { url, pic, first, last, bio} = res.data;
                    this.status = res.data.status;
                    this.sendId = res.data.sendId;
                    this.setState({ url, pic, first, last, bio });
                    if (res.data.status == 1) {
                        axios.get('/api/otherFriends/' + this.props.params.id).then((res) => {
                            this.setState({
                                friends: res.data.friends
                            });
                        });
                    } else {
                        console.log(this.state.friends);
                        this.setState({
                            friends: null
                        });
                    }
                });
            }
        }
    }
    componentDidMount(){
        axios.get('/api/user/' + this.props.params.id).then((res) => {
            var { url, pic, first, last, bio} = res.data;
            this.status = res.data.status;
            this.sendId = res.data.sendId;
            this.setState({ url, pic, first, last, bio });
            if (res.data.status == 1) {
                axios.get('/api/otherFriends/' + this.props.params.id).then((res) => {
                    this.setState({
                        friends: res.data.friends
                    });
                    console.log(res.data.friends);
                });
            }
        });
    }
    render(){
        var friends = null;
        if (this.state.friends) {
            console.log('getting friendsList')
            if (this.state.friends[0]) {
                friends = (
                    <div id="other-profile-friends-container" >
                        <h2>Friends:</h2>
                        <div id="other-profile-friends">
                            {this.state.friends.map(user => <div><Link to={'/user/' + user.id}><img id="profile-pic" src={"http://peppermountain.s3.amazonaws.com/" + user.pic} alt={user.first + ' ' + user.last} title={user.first + ' ' + user.last}/></Link><h3>{user.first} {user.last} </h3></div>)}
                        </div>
                    </div>
                );
            }
        }
        this.src = this.state.url + this.state.pic;
        return(
            <div id="other-profile-container">
                <div id="other-profile-profile">
                    <img id="profile-pic" src={this.src} alt={this.state.first + ' ' + this.state.last} title={this.state.first + ' ' + this.state.last}/>
                    <h2>{this.state.first} {this.state.last}</h2>
                    <p>{this.state.bio}</p>
                    {this.state.first && <FriendButton status={this.status} sendId={this.sendId} id={this.props.id} friendId={this.props.params.id} />}
                </div>
                {friends}
            </div>
        );
    }
}
