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

export function privateMsg(data) {
    return {
        type: 'PRIVATE_MSG',
        privateMsg: data,
        chatId: data.chatId
    };
}

export function msgNotif(id) {
    return {
        type: 'MSG_NOTIFICATION',
        id
    };
}

export function msgRead(id) {
    return {
        type: 'MSG_READ',
        id
    };
}

export function getChat(id) {
    return axios.get('/api/getChat/' + id).then(function({ data }){
        return {
            type: 'GET_CHAT',
            chat: data.chatHistory,
            chatId: data.chatId,
            recId: data.recId
        };
    });
}

export function mainChat(){
    console.log('mainChat triggered');
    return {
        type: 'MAIN_CHAT'
    };
}

export function chatRooms(data) {
    return {
        type: 'CHAT_ROOMS',
        data
    };
}

export function getChatRoom(id) {
    return {
        type: 'GET_CHAT_ROOM',
        id
    };
}

export function newRoomMsg(data) {
    return {
        type: 'NEW_ROOM_MSG',
        room: data.room,
        data
    };
}

export function getSearch(input) {
    var ajax;
    if(ajax) {
        ajax.abort();
    }
    return ajax = axios.get("/api/search/" + input).then(function({ data }) {
        return {
            type: "SEARCH",
            searchResults: data.searchResults
        };
    });
}

export function clearSearch() {
    return {
        type: "CLEAR_SEARCH"
    };
}
