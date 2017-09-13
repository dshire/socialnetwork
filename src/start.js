import React from 'react';
import ReactDOM from 'react-dom';
import axios from './axios';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { Login, Registration, Welcome } from './auth';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducer';
import { App } from './app';
import { Profile } from './profile';
import {OtherProfile} from './otherprofile';
import Friends from './friends';

const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));

const router = (
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path='/' component={App}>
                <IndexRoute component={Profile} />
                <Route path='user/:id' component={OtherProfile} />
                <Route path='/friends' component ={Friends} />
            </Route>
        </Router>
    </Provider>
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
