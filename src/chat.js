import React from 'react';
import { connect } from 'react-redux';
import { getSocket } from './socket';

class Chat extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.sendMsg = this.sendMsg.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.socket = getSocket();
    }
    sendMsg() {
        this.socket.emit('chatMsg', this.state.message);
        console.log(this.state.message);
        this.setState({
            message: ''
        });
        this.chatInput.focus();
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
    componentDidUpdate(){
        this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
    }
    render() {

        if(!this.props) {
            return null;
        }
        var chatMessages = null;
        if (this.props.chatHistory) {
            chatMessages = (
                <ul id="messages">
                    {this.props.chatHistory.map(msg => <li className="message"><img className="chat-pic" src={"http://peppermountain.s3.amazonaws.com/" + msg.pic} alt={msg.first + ' ' + msg.last} title={msg.first + ' ' + msg.last}/><div className="chat-text" >{msg.first} {msg.last} ({msg.date}):<br/>{msg.message}</div></li>)}
                </ul>
            );
        }
        return (
            <div id="chat">
                <div id="chat-window" ref={elem => this.chatWindow = elem} >
                    {chatMessages}
                </div>
                <div id="chat-input"><input id="m" autocomplete="off" onChange={e => this.handleChange(e)} value={this.state.message} ref={elem => this.chatInput = elem} onKeyPress={this.handleKeyPress} /><button onClick={this.sendMsg}>send</button></div>
            </div>
        );
    }
}

const mapStateToProps = function(state){
    return {
        onlineUsers: state.onlineUsers,
        chatHistory: state.chatHistory
    };
};


export default connect(mapStateToProps)(Chat);
