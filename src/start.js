import React from 'react';
import ReactDOM from 'react-dom';
import axios from './axios';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';
import { Login, Registration, Welcome } from './auth';
import { App } from './app'
import { Profile } from './profile';
import {OtherProfile} from './otherprofile';


const router = (
    <Router history={browserHistory}>
        <Route path='/' component={App}>
            <IndexRoute component={Profile} />
            <Route path='user/:id' component={OtherProfile} />
        </Route>
    </Router>
);


const welcomeRouter = (
    <Router history={hashHistory}>
        <Route path="/" component={Welcome}>
            <IndexRoute component={Registration} />
            <Route path="/login" component={Login} />
        </Route>
    </Router>
);

let comp;
if (location.pathname == '/welcome') {
    comp = welcomeRouter;
} else {
    comp = router;
}

ReactDOM.render(
    comp,
    document.querySelector('main')
);
