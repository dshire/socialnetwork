import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class Online extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        if(!this.props) {
            return null;
        }

        let onlineList = null;
        if(this.props.onlineUsers){

            onlineList = (
                <div id="friendsList" >
                    {this.props.onlineUsers.map(user => <div><Link to={'user/' + user.id}><img id="profile-pic" src={"http://peppermountain.s3.amazonaws.com/" + user.pic} alt={user.first + ' ' + user.last} title={user.first + ' ' + user.last}/></Link><h3>{user.first} {user.last} </h3></div>)}
                </div>
            );
        }
        return (
            <div>
                <h2 id="online-now" >Online now:</h2>
                {onlineList}
            </div>
        );
    }
}

const mapStateToProps = function(state){
    return {
        onlineUsers: state.onlineUsers
    };
};


export default connect(mapStateToProps)(Online);
