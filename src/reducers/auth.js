import Cookie from 'js-cookie'
import {
	LOGIN_FAILURE,
	LOGIN_SUCCESS,
	LOGIN_START,
	LOGOUT_SUCCESS,
	REGISTER_FAILURE,
	REGISTER_SUCCESS,
	REGISTER_START,
} from '../actions/user';

const initialState = {
	isFetching: false,
	errors: null,
	loading: false,
	token: Cookie.get('token') || null,
	user: Cookie.get("user") ? JSON.parse(Cookie.get('user')) : null,
}

const fail = (state, errors) => Object.assign({}, state, {
	errors: errors, loading: false, token: null, user: null,
})
const success = (state, token, user) => Object.assign({}, state, {
	errors: null, loading: false, token: token, user: user,
})
const start = state => Object.assign({}, state, {
	errors: null, loading: true, token: null, user: null,
})

export default function auth(state = initialState, action) {
	switch (action.type) {
		case LOGIN_FAILURE: return fail(state, action.errors)
		case LOGIN_SUCCESS: return success(state, action.token, action.user)
		case LOGIN_START: return start(state)
		case LOGOUT_SUCCESS:
			return Object.assign({}, state, {
				error: action.message,
				loading: false,
				token: null,
				user: null,
			});
		case REGISTER_FAILURE: return fail(state, action.errors)
		case REGISTER_SUCCESS: return success(state, action.token, action.user)
		case REGISTER_START: return start(state)
		default:
			return state;
	}
}
