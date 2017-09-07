import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';
import { Login, Registration, Welcome } from './auth';
import { App } from './app'


const router = (
    <Router history={hashHistory}>
        <Route path="/" component={Welcome}>
            <IndexRoute component={Registration} />
            <Route path="/login" component={Login} />
        </Route>
    </Router>
);

let comp;
if (location.pathname == '/welcome') {
    comp = router
} else {
    comp = <App />
}

ReactDOM.render(
    comp,
    document.querySelector('main')
);
