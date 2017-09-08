import axios from 'axios';


var instance = axios.create({
    'xsrfCookieName': 'spicedsocial',
    'xsrfHeaderName': 'csrf-token'
});

export default instance;
