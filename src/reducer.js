export default function(state = {}, action) {
    if (action.type == 'RECEIVE_FRIENDS') {
        state = Object.assign({}, state, {
            users: action.users
        });
    }
    if (action.type == 'FRIEND_UPDATE') {
        state = Object.assign({}, state, {
            users: state.users.map(function(user) {
                if (user.id == action.id) {
                    return Object.assign({}, user, {
                        status: newStatus(user.status)
                    });
                }
                return user;
            })
        });
    }
    if (action.type == 'REJECT') {
        state = Object.assign({}, state, {
            users: state.users.map(function(user) {
                if (user.id == action.id) {
                    return Object.assign({}, user, {
                        status: 5
                    });
                }
                return user;
            })
        });
    }
    if (action.type == 'STORE_ONLINE') {
        state = Object.assign({}, state, {
            onlineUsers: action.onlineUsers
        });
    }
    if (action.type == 'STORE_CHAT'){
        state = Object.assign({}, state, {
            chatHistory: action.chatHistory
        });
    }
    if (action.type == 'NEW_MESSAGE' && state.chatHistory){
        state = Object.assign({}, state, {
            chatHistory: state.chatHistory ? [ ...state.chatHistory, action.newMsg] : [action.newMsg]
        });
    }
    if (action.type == 'USER_JOINED' && state.onlineUsers) {
        if (state.onlineUsers && !state.onlineUsers.find(user => user.id == action.userJoined.id)) {

            state = Object.assign({}, state, {
                onlineUsers: state.onlineUsers ? [ ...state.onlineUsers, action.userJoined] : [action.userJoined]
            });
        }
    }
    if (action.type == 'USER_LEFT'){
        state = Object.assign({}, state, {
            onlineUsers: state.onlineUsers.filter(function(user){
                if(user.id == action.userLeft) {
                    return undefined;
                }
                return user;
            })
        });
    }
    if (action.type == 'PRIVATE_MSG'){
        console.log('action.chatId is: ' + action.chatId);
        state = Object.assign({}, state, {
            chats: Object.assign({}, state.chats, {[action.chatId]: state.chats[action.chatId] ? [ ...state.chats[action.chatId], action.privateMsg] : [action.privateMsg]})
        });
    }
    if (action.type == 'GET_CHAT'){
        console.log(action.recId);
        var chats = state.chats ? Object.assign({}, state.chats, {[action.chatId]: action.chat }) : Object.assign({}, {[action.chatId]: action.chat });
        return Object.assign({}, state, {currentChat: action.chatId}, { chats }, { recId: action.recId });
    }
    if (action.type == 'MAIN_CHAT') {
        state = Object.assign({}, state, {
            currentChat: ''
        });
    }
    if (action.type == 'CHAT_ROOMS') {
        state = Object.assign({}, state, {
            chatRooms: action.data
        });
    }
    if(action.type == 'GET_CHAT_ROOM') {
        state = Object.assign({}, state, {
            currentChat: action.id
        });
    }
    if(action.type == "NEW_ROOM_MSG") {
        var index = state.chatRooms.findIndex(e => e.id == action.room);
        state = Object.assign({}, state, {
            chatRooms: state.chatRooms.map(function(room, i) {
                if (i == index) {
                    return Object.assign({}, room, {
                        messages: [...room.messages, action.data]
                    });
                }
                return room;
            })
        });
    }
    if (action.type == "SEARCH") {
        state = Object.assign({}, state, {
            searchResults: action.searchResults
        });
    }
    if (action.type == "CLEAR_SEARCH") {
        state = Object.assign({}, state, {
            searchResults: null
        });
    }
    if (action.type == "MSG_NOTIFICATION") {
        state = Object.assign({}, state, {
            msgNotif: state.msgNotif ? [ ...state.msgNotif, action.id ] : [ action.id ]
        });
    }
    if (action.type == "MSG_READ") {
        var newMsgArr = state.msgNotif.filter(elem => elem != action.id);
        state = Object.assign({}, state, {
            msgNotif: state.msgNotif ? newMsgArr : []
        });
    }
    return state;
}

function newStatus(oldStatus){
    if (oldStatus == 1) {
        return 4;
    } else if (oldStatus == 2) {
        return 1;
    } else {
        return 2;
    }
}
