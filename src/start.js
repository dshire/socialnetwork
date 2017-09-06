import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';
import { Register } from './register';
import { Login } from './login';



const router = (
    <Router history={hashHistory}>
        <Route path="/" component={Welcome}>
            <IndexRoute component={Register} />
            <Route path="/login" component={Login} />
  	    </Route>
    </Router>
);

let comp;
if (location.pathname == '/welcome') {
    comp = router
} else {
    comp = <Logo />
}

ReactDOM.render(
    comp,
    document.querySelector('main')
);




function Welcome(props) {
    return (
        <div>
            <h1>Welcome to this Social Network!</h1>
            {props.children}
        </div>
    )
}
<Register />

function Logo() {
    return (
        <div>
            <h1>LOGO</h1>
        </div>
    )
}
