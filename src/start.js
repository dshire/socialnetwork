import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Register } from './register';


let comp;
if (location.pathname == '/welcome') {
    comp = <Welcome />
} else {
    comp = <Logo />
}


ReactDOM.render(
    comp,
    document.querySelector('main')
);


function Welcome() {
    return (
        <div>
            <h1>Welcome to this Social Network!</h1>
            <Register />
        </div>
    )
}

function Logo() {
    return (
        <div>
            <h1>LOGO</h1>
        </div>
    )
}
