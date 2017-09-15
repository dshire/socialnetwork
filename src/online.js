import React from 'react';
import { connect } from 'react-redux';


class Online extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        if(!this.props) {
            return null;
        }
        const { onlineUsers } = this.props;
        console.log('this.props: ', this.props)
        console.log('this.props.onlineUsers: ', this.props.onlineUsers)
        let onlineList = null;
        if(this.props.onlineUsers){

            onlineList = (
                <div>
                    {this.props.onlineUsers.map(user => <div><img id="profile-pic" src={"http://peppermountain.s3.amazonaws.com/" + user.pic} alt={user.first + ' ' + user.last} title={user.first + ' ' + user.last}/><h3>{user.first} {user.last} </h3></div>)}
                </div>
            );
        }
        return (
            <div>
                <h2>Online now:</h2>
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
