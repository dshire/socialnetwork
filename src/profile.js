import React from 'react';
import axios from './axios';
import { Link } from 'react-router';
import { ProfilePic } from './app'

export function Profile(props) {
    return (
        <div style={{ width: 'auto', height: '400px' }}>
            <ProfilePic showUploader={props.showUploader} image={props.url + props.pic} first={props.first} last={props.last} />
            <h2>{props.first} {props.last}</h2>
            <Bio bio={props.bio} />
        </div>
    );
}

class Bio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.editBio = this.editBio.bind(this);
        this.saveBio = this.saveBio.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    editBio(){
        this.setState({
            showBioEdit: true
        });
    }
    saveBio(){
        this.props.bio = this.bio;
        this.setState({
            showBioEdit: false
        });
        axios.post('/updatebio', { bio: this.bio })
            .then(res => {
                if (!res.data.success) {
                    error: true
                } else {
                    error: false
                    this.setState({
                        bio: res.data.bio
                    });
                }
            });
    }
    handleChange(e){
        this[e.target.name] = e.target.value;
    }
    render(){
        let elem = null;
        if (!this.state.showBioEdit && this.props.bio){
            elem = <div>{this.props.bio}<p onClick={this.editBio}>Edit bio</p></div>;
        } else if (!this.state.showBioEdit && !this.props.bio) {
            elem = <p onClick={this.editBio}>Add bio</p>;
        } else {
            elem = <div><textarea name="bio" onChange={e => this.handleChange(e)} rows="6" cols="50">{this.props.bio}</textarea><button onClick={this.saveBio}>Save</button></div>;
        }
        return(
            <div>
                {elem}
            </div>
        );
    }
}
