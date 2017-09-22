import React from 'react';
import { connect } from 'react-redux';
import { getSocket } from './socket';
import { getChat, mainChat, getChatRoom, receiveFriends, msgRead } from './actions';
import axios from './axios';

class Chat extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.getChat = this.getChat.bind(this);
        this.getChatRoom = this.getChatRoom.bind(this);
        this.mainChat = this.mainChat.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveChat = this.saveChat.bind(this);
        this.socket = getSocket();
    }
    componentDidMount() {
        this.props.dispatch(receiveFriends());
    }
    getChat(id){
        console.log('getChat triggered with id ' + id);
        this.props.dispatch(getChat(id));
        if (this.props.msgNotif && this.props.msgNotif.find(msgId => msgId == id)) {
            this.props.dispatch(msgRead(id));
        }
    }
    getChatRoom(id){
        this.props.dispatch(getChatRoom(id));
        this.socket.emit('joinChat', id);
    }
    mainChat(){
        this.props.dispatch(mainChat());
    }
    handleChange(e){
        this.setState({
            newChat: e.target.value
        });
    }
    saveChat(){
        console.log('chat.js this.saveChat');
        this.socket.emit('newChat', {
            newChat: this.state.newChat
        });
        this.setState({
            newChat: ''
        });
    }
    render() {
        if(!this.props) {
            return null;
        }
        var directChat = null;
        var friendChat = null;
        if (this.props.onlineUsers) {
            directChat = (
                <div className="chatlist">
                    Online Users:
                    {this.props.onlineUsers.filter(user => user.id != this.props.id).map(user => <div className="chat-user" onClick={() => {this.getChat(user.id)}}><img className="chat-pic" src={"http://peppermountain.s3.amazonaws.com/" + user.pic} alt={user.first + ' ' + user.last} title={user.first + ' ' + user.last}/><h3>{user.first} {user.last} </h3>{(this.props.msgNotif && this.props.msgNotif.find(id => id == user.id)) && <img id="msgNotif" src="/images/message-2-128.png" alt="New Message" />}</div>)}
                </div>
            );
        }
        if (this.props.users && this.props.onlineUsers) {
            var filteredFriends = this.props.users.filter((user) => {
                if(this.props.onlineUsers.find(e => e.id == user.id)) {
                    return false;
                } else if (user.status == 1) {
                    return true;
                } else {
                    return false;
                }
            });
            friendChat = (
                <div className="friendChat">
                    Friends (Offline):
                    {filteredFriends.map(user => <div className="chat-user" onClick={() => {this.getChat(user.id)}}><img className="chat-pic" src={"http://peppermountain.s3.amazonaws.com/" + user.pic} alt={user.first + ' ' + user.last} title={user.first + ' ' + user.last}/><h3>{user.first}&nbsp;{user.last} </h3></div>)}
                </div>
            );
        }
        var chatRooms = null;
        if (this.props.chatRooms) {
            chatRooms = (
                <div>
                    {this.props.chatRooms.map(chat => <div className="chat-room" onClick={() => {this.getChatRoom(chat.id)}}>{chat.chatName}</div>)}
                </div>
            );
        }
        return (
            <div id="chat-div">
                <div id="chat-nav">
                    <h4>Chat Rooms:</h4>
                    <p className="chat-rooms-title" onClick={() => this.props.dispatch(mainChat())}>Main Chat</p>
                    {chatRooms}
                    <div className="new-chat-input">
                        <input type='text' name='new-chat' onChange={this.handleChange} value={this.state.newChat}  />
                        <button className="new-chat-button" onClick={this.saveChat}>Add Room</button>
                    </div>
                    {directChat}
                    {friendChat}
                </div>
                {this.props.children}
            </div>
        );
    }
}

const mapStateToProps = function(state){
    return {
        onlineUsers: state.onlineUsers,
        chatHistory: state.chatHistory,
        chatRooms: state.chatRooms,
        users: state.users,
        msgNotif: state.msgNotif
    };
};


export default connect(mapStateToProps)(Chat);
