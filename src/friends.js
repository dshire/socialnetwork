import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { receiveFriends, friendUpdate, reject } from './actions';



class Friends extends React.Component {
    componentDidMount() {
        this.props.receiveFriends();
    }
    render() {
        const { friends, pending } = this.props;
        if(!friends || !pending) {
            return null;
        }
        const friendList = listFriends(friends, this.props);
        const pendList = listFriends(pending, this.props);

        return (
            <div id="friendsList">
                <div>
                    <h2>People you are friends with:</h2>
                    {friendList}
                    {!friends[0] && <p>No friends! Go ahead and add some!</p>}
                </div>
                <div>
                    <h2>Pending Friend Requests:</h2>
                    {pendList}
                    {!pending[0] && <p>No Pending Friend Requests!</p>}
                </div>
            </div>
        );
    }
}

function listFriends(obj, props) {
    return (
        <div>
            {obj.map(user => <div><img id="profile-pic" src={"http://peppermountain.s3.amazonaws.com/" + user.pic} alt={user.first + ' ' + user.last} title={user.first + ' ' + user.last}/><h3>{user.first} {user.last} </h3><button onClick={()=> props.friendUpdate(user.id, user.status)}>{buttonText(user.status)}</button>{(user.status == 2) && <button onClick={()=> props.reject(user.id)}>Reject Friendship Request</button>}</div>)}
        </div>
    );
}

function buttonText(status){
    if (status == 1) {
        return 'End Friendship';
    } else if (status == 2) {
        return 'Accept Friend Request';
    }
}


const mapDispatchToProps = function(dispatch) {
    return {
        friendUpdate: (id, status) => dispatch(friendUpdate(id, status)),
        receiveFriends: () => dispatch(receiveFriends()),
        reject: (id) => dispatch(reject(id))
    };
};

const mapStateToProps = function(state) {
    return {
        friends: state.users && state.users.filter(user => user.status == 1),
        pending: state.users && state.users.filter(user => user.status == 2)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Friends);
