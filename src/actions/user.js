import Cookie from 'js-cookie'
import { toast } from "react-toastify";

import apiClient from '../api'
import { parseErrors } from "./helpers";

export const LOGIN_START = 'LOGIN_START'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

const loginSuccess = (token, user) => {
  return {type: LOGIN_SUCCESS, token: token, user: user}
};


const loginError = errors => {
    return {
        type: LOGIN_FAILURE,
        errors: errors,
    };
}


const logoutSuccess = () => ({type: LOGOUT_SUCCESS});
export const logout = (message = "Logged out successfully") => dispatch => {
  Cookie.remove('expires_at');
  Cookie.remove('token');
  Cookie.remove('user');
  dispatch(logoutSuccess());
  toast.info(message,{ hideProgressBar: true, position: "top-center" })
};

const loginStart = () => ({type: LOGIN_START});
export const loginUser = creds => dispatch => {
  dispatch(loginStart());

  apiClient.post('api/login/', creds)
    .then(response => {
      Cookie.set('expires_at', response.data.expires_at);
      Cookie.set('token', response.data.token);
      Cookie.set('user', response.data.user);
      dispatch(loginSuccess(response.data.token, response.data.user))
    })
    .catch(error => dispatch(loginError(parseErrors(error))))
};
