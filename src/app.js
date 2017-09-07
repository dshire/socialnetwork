import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';

export class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.showUploader = this.showUploader.bind(this);
    }
    componentDidMount(){
        axios.get('/user').then((data) => {
            this.setState(data);
        });
    }
    showUploader(){
        this.setState({
            uploaderShown: true
        });
    }
    render() {
        if (!this.state.data) {
            return <div>Loading...</div>;
        }
        return(
            <div>
                <Logo />
                <PicLoader showUploader={this.showUploader} image={this.state.data.url + this.state.data.pic} first={this.state.data.first} last={this.state.data.last} />

                {this.state.uploaderShown && <PicLoader setImage={this.setImage} closeUploader={this.closeUploader} />}
            </div>
        );
    }
}


function PicLoader(props) {
    return(
        <div>
            <img src={props.image} alt={props.first + ' ' + props.last} title={props.first + ' ' + props.last} onClick={props.showUploader} />
        </div>
    );
}

function Logo() {
    return (
        <div>
            <img src='/images/jollyroger.gif' />
        </div>
    )
}
