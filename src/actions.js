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
