import * as io from 'socket.io-client';
import axios from './axios';
import { storeOnlineUsers, storeChatHistory, userJoined, userLeft, newMessage } from './actions';

let socket;
import { store } from './start';

export function getSocket() {
    if (!socket) {
        socket = io.connect();
        socket.on('connect', function() {
            axios.get(`/connected/${socket.id}`);
        });

        socket.on('welcome', function(data) {
            console.log(data);
        });
        socket.on('onlineUsers', function(data){
            // console.log('Online users', data);
            store.dispatch(storeOnlineUsers(data));
        });
        socket.on('userJoined', function(data){
            // console.log('New user: ', data);
            store.dispatch(userJoined(data));
        });
        socket.on('userLeft', function(data){
            store.dispatch(userLeft(data));
        });
        socket.on('chat', function(data) {
            store.dispatch(storeChatHistory(data));
        });
        socket.on('newMsg', function(data) {
            // console.log(data);
            store.dispatch(newMessage(data));
        });
    }
    return socket;
}
