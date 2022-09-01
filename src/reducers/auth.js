import Cookie from 'js-cookie'
import {
    LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS, LOGIN_START,
} from '../actions/user';

const authenticated = localStorage.getItem('authenticated');
export default function auth(state = {
    isFetching: false,
    errors: null,
    loading: false,
    token: Cookie.get('token') || null,
    user: Cookie.get("user") ? JSON.parse(Cookie.get('user')) : null,
}, action) {
    switch (action.type) {
        case LOGIN_START:
            return Object.assign({}, state, {
                errors: null,
                loading: true,
                token: null,
                user: null,
              });
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {
                errors: null,
                loading: false,
                token: action.token,
                user: action.user,
            });
        case LOGIN_FAILURE:
            return Object.assign({}, state, {
                errors: action.errors,
                loading: false,
                token: null,
                user: null,
            });
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                error: action.message,
                loading: false,
                token: null,
                user: null,
              });
        default:
            return state;
    }
}
