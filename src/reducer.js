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
        console.log('user left reducer', action.userLeft);
        state = Object.assign({}, state, {
            onlineUsers: state.onlineUsers.filter(function(user){
                if(user.id == action.userLeft) {
                    return undefined;
                }
                return user;
            })
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
