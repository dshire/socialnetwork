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
