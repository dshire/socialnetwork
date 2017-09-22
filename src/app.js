import React from 'react';
import axios from './axios';
import { Link } from 'react-router';
import { getSocket } from './socket';
import Search from "./search";


export class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.showUploader = this.showUploader.bind(this);
        this.closeUploader = this.closeUploader.bind(this);
        this.uploadProfilePic = this.uploadProfilePic.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }
    componentDidMount(){
        axios.get('/api/user').then((res) => {
            var { id, url, pic, first, last, bio} = res.data;
            this.setState({  id, url, pic, first, last, bio });
        });
    }
    showUploader(){
        this.setState({
            uploaderShown: true
        });
    }
    closeUploader(){
        this.setState({
            uploaderShown: false
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
    updateBio(newBio){
        this.setState({
            bio: newBio
        });
    }
    render() {
        getSocket();
        const children = React.cloneElement(this.props.children, {
            first: this.state.first,
            last: this.state.last,
            showUploader: this.showUploader,
            url: this.state.url,
            pic: this.state.pic,
            bio: this.state.bio,
            id: this.state.id,
            updateBio: this.updateBio
        });
        if (!this.state.pic) {
            return <div>Loading...</div>;
        }
        return(
            <div>
                <div>
                    <div className="nav-bar" >
                        <Logo />
                        <Link to={'/friends'}>Friends</Link>
                        <Link to={'/online'}>See who's online!</Link>
                        <Link to={'/chat'}>Chat</Link>
                        <div id="search-container">
                            <p className="search-users-p">Search Users:</p>
                            <Search />
                        </div>
                        <div className="user-info">
                            <ProfilePic className="p-pic" showUploader={this.showUploader} image={this.state.url + this.state.pic} first={this.state.first} last={this.state.last} />
                            {this.state.uploaderShown && <PicLoader uploadProfilePic={e => this.uploadProfilePic(e)} closeUploader={this.closeUploader} error={this.state.error} />}
                            <Link id="pic-user-name" to={'/'}>{this.state.first} {this.state.last}</Link>
                        </div>
                    </div>
                </div>
                <div id="appContainer">
                    <div id="white-background-container">
                        {children}
                    </div>
                </div>
            </div>
        );
    }
}

function PicLoader(props) {
    return(
        <div id="shadow" onClick={props.closeUploader}>
            <div id="pic-upload" onClick={ e => e.stopPropagation() }>
                <label id="upload-label" for="file">Upload a new Profile Picture?<input type="file" name="file" id="img-select" accept="image/*" onChange={e => props.uploadProfilePic(e)} /></label>
                {props.error && <div className="error">{props.error}</div>}
            </div>
        </div>
    );
}

export function ProfilePic(props) {
    return(
        <div>
            <img id="profile-pic" src={props.image} alt={props.first + ' ' + props.last} title={props.first + ' ' + props.last} onClick={props.showUploader} />
        </div>
    );
}


function Logo() {
    return (
        <div id="logo-container">
            <img className="logo" src='/images/jollyroger.gif' />
            <div id="green-bar" ><h1 id="tinasn">T I N A S N</h1></div>
        </div>
    )
}
