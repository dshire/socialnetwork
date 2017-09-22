import React from 'react';
import { connect } from 'react-redux';
import { getSocket } from './socket';
import { receivePrivateMsg, mainChat } from './actions';
import { browserHistory } from 'react-router';

class MainChat extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.sendMsg = this.sendMsg.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.mainChat = this.mainChat.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.receivePrivateMsg = this.receivePrivateMsg.bind(this);
        this.socket = getSocket();
    }
    sendMsg() {
        if (this.props.currentChat.startsWith('room')) {
            console.log('sending message' + this.state.message);
            this.socket.emit('chatRoomMsg', { room: this.props.currentChat, message: this.state.message});
        } else {
            this.socket.emit('chatMsg', {
                message: this.state.message,
                chatId: this.props.currentChat,
                recId: this.props.recId ? this.props.recId : ''
            });
        }
        this.setState({
            message: ''
        });
        this.chatInput.focus();
    }
    componentDidMount(){
        this.props.dispatch(mainChat());
    }
    handleChange(e){
        this.setState({
            message: e.target.value
        });
    }
    handleKeyPress(e){
        if(e.key == 'Enter') {
            this.sendMsg();
        }
    }
    receivePrivateMsg(id){
        this.props.dispatch(receivePrivateMsg(id));
    }
    mainChat(){
        this.props.dispatch(mainChat());
    }
    componentDidUpdate(){
        if (this.chatWindow) {
            this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
        }
    }
    componentWillReceiveProps(nextProps) {
        console.log('compwillreceiveprops triggered');
        if (this.props.currentChat != nextProps.currentChat){
            if (this.props.currentChat && this.props.currentChat.startsWith('room')) {
                this.socket.emit('leaveChat', this.props.currentChat);
            }
            browserHistory.push('/chat/' + nextProps.currentChat);
            console.log('currentChat check');
        }
        if (this.props.location.pathname != nextProps.location.pathname && nextProps.location.pathname == '/chat') {
            this.chatList = this.props.chatHistory;
            this.mainChat();
        }
    }
    render() {
        if(!this.props.chatHistory) {
            return null;
        }
        this.chatList = this.props.chatHistory;
        if (this.props.currentChat && this.props.chats && this.props.chats[this.props.currentChat]){
            this.chatList = this.props.chats[this.props.currentChat];
        }
        if (this.props.currentChat && this.props.currentChat.startsWith('room')){
            var index = this.props.chatRooms.findIndex(e => e.id == this.props.currentChat);
            this.chatList = this.props.chatRooms[index].messages;
        }
        return (
            <div id="chat">
                <div id="chat-window">
                    <div id="chat-window-content" ref={elem => this.chatWindow = elem}>
                        <ChatDisplay chatHistory={this.chatList} />
                    </div>
                </div>
                <div id="chat-input"><input id="m" autocomplete="off" onChange={e => this.handleChange(e)} value={this.state.message} ref={elem => this.chatInput = elem} onKeyPress={this.handleKeyPress} /><button onClick={this.sendMsg}>send</button></div>
            </div>
        );
    }
}

function ChatDisplay(props) {
    return (
        <ul id="messages">
            {props.chatHistory.map(msg => <li className="message"><img className="chat-pic" src={"http://peppermountain.s3.amazonaws.com/" + msg.pic} alt={msg.first + ' ' + msg.last} title={msg.first + ' ' + msg.last}/><div className="chat-text" >{msg.first} {msg.last} ({msg.date}):<br/>{msg.message}</div></li>)}
        </ul>
    );
}


const mapStateToProps = function(state){
    return {
        onlineUsers: state.onlineUsers,
        chatHistory: state.chatHistory,
        currentChat: state.currentChat,
        chats: state.chats,
        recId: state.recId,
        chatRooms: state.chatRooms
    };
};

export default connect(mapStateToProps)(MainChat);
