import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';

export class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.showUploader = this.showUploader.bind(this);
        this.closeUploader = this.closeUploader.bind(this);
        this.uploadProfilePic = this.uploadProfilePic.bind(this);
    }
    componentDidMount(){
        axios.get('/user').then((res) => {
            var { url, pic, first, last} = res.data;
            this.setState({url, pic, first, last});
        });
    }
    showUploader(){
        this.setState({
            uploaderShown: true
        });
    }
    uploadProfilePic(e){
        var newPic = new FormData;
        newPic.append('pic', e.target.files[0]);

        axios.post('/picupload', newPic)
            .then(resp => {
                const data = resp.data;
                if (!data.success) {
                    this.setState({
                        error: 'Error. Try again.'
                    });
                } else {
                    this.setState({
                        uploaderShown: false,
                        pic: data.pic,
                        error: false
                    });
                }
            });
    }
    closeUploader(){
        this.setState({
            uploaderShown: false
        });
    }
    render() {
        if (!this.state.pic) {
            return <div>Loading...</div>;
        }
        return(
            <div>
                <Logo />
                <ProfilePic showUploader={this.showUploader} image={this.state.url + this.state.pic} first={this.state.first} last={this.state.last} />

                {this.state.uploaderShown && <PicLoader uploadProfilePic={e => this.uploadProfilePic(e)} closeUploader={this.closeUploader} error={this.state.error} />}
            </div>
        );
    }
}

function PicLoader(props) {
    return(
        <div id="shadow" onClick={props.closeUploader}>
            <div id="pic-upload" onClick={ e => e.stopPropagation() }>
                <h4>Change your Profile Picture?</h4>
                <p id="x" onClick={props.closeUploader}>x</p>
                <input type="file" id="img-select" accept="image/*" onChange={e => props.uploadProfilePic(e)} />
                {props.error && <div className="error">{props.error}</div>}
            </div>
        </div>
    );
}

function ProfilePic(props) {
    return(
        <div>
            <img id="profile-pic" src={props.image} alt={props.first + ' ' + props.last} title={props.first + ' ' + props.last} onClick={props.showUploader} />
        </div>
    );
}


function Logo() {
    return (
        <div>
            <img className="logo" src='/images/jollyroger.gif' />
        </div>
    )
}
