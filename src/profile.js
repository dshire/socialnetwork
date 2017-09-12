import React from 'react';
import axios from './axios';
import { Link } from 'react-router';
import { ProfilePic } from './app'

export function Profile(props) {
    return (
        <div style={{ width: 'auto', height: '400px' }}>
            <ProfilePic showUploader={props.showUploader} image={props.url + props.pic} first={props.first} last={props.last} />
            <h2>{props.first} {props.last}</h2>
            <Bio bio={props.bio} updateBio={props.updateBio} />
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
    componentDidMount() {
        this.setState({
            bio: this.props.bio
        });
    }
    editBio(){
        this.setState({
            showBioEdit: true
        });
    }
    saveBio(){
        this.props.updateBio(this.state.bio);
        this.setState({
            showBioEdit: false
        });
        axios.post('/updatebio', { bio: this.state.bio })
            .then(res => {
                if (!res.data.success) {
                    error: true;
                } else {
                    error: false;
                }
            });
    }
    handleChange(e){
        this.setState({
            bio: e.target.value
        });
    }
    render(){
        let elem = null;
        if (!this.state.showBioEdit && this.state.bio){
            elem = <div>{this.state.bio}<p onClick={this.editBio}>Edit bio</p></div>;
        } else if (!this.state.showBioEdit && !this.state.bio) {
            elem = <p onClick={this.editBio}>Add bio</p>;
        } else {
            elem = <div><textarea name="bio" onChange={this.handleChange} value={this.state.bio} rows="6" cols="50" /><button onClick={this.saveBio}>Save</button></div>;
        }
        return(
            <div>
                {elem}
            </div>
        );
    }
}
