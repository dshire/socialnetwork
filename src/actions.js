import axios from './axios';

export function receiveFriends() {
    return axios.get('/api/friends').then(function({ data }) {
        return {
            type: 'RECEIVE_FRIENDS',
            users: data.friends
        };
    });
}

export function friendUpdate(id, status){
    return axios.post('/api/friendUpdate/' + id, { status: status, sendId: id })
        .then(() => {
            return {
                type: 'FRIEND_UPDATE',
                id
            };
        });
}

export function reject(id){
    return axios.post('/api/reject/' + id, {})
        .then(() => {
            return {
                type: 'REJECT',
                id
            };
        });
}

export function storeOnlineUsers(data) {
    return {
        type: 'STORE_ONLINE',
        onlineUsers: data.onlineUsers
    };
}

export function storeChatHistory(data) {
    return {
        type: 'STORE_CHAT',
        chatHistory: data
    };
}

export function userJoined(data) {
    return {
        type: 'USER_JOINED',
        userJoined: data.newOnline
    };
}

export function userLeft(data) {
    console.log('user left action' , data.userLeft);
    return {
        type: 'USER_LEFT',
        userLeft: data.userLeft
    };
}

export function newMessage(data) {
    return {
        type: 'NEW_MESSAGE',
        newMsg: data
    };
}
