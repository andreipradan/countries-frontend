import Cookie from 'js-cookie'
import { toast } from "react-toastify";

import apiClient from '../api'
import { parseErrors } from "./helpers";

export const LOGIN_START = 'LOGIN_START'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export const REGISTER_START = 'REGISTER_START'
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';


const loginError = errors => ({ type: LOGIN_FAILURE, errors: errors})
const loginSuccess = (token, user) => ({type: LOGIN_SUCCESS, token: token, user: user})
const logoutSuccess = () => ({type: LOGOUT_SUCCESS})

export const registerErrors = errors => ({ type: REGISTER_FAILURE, errors: errors})

export const loginUser = creds => dispatch => {
  dispatch({type: LOGIN_START});

  apiClient.post('api/login/', creds)
    .then(response => {
      Cookie.set('expires_at', response.data.expires_at);
      Cookie.set('token', response.data.token);
      Cookie.set('user', response.data.user);
      dispatch(loginSuccess(response.data.token, response.data.user))
    })
    .catch(error => dispatch(loginError(parseErrors(error))))
};

export const logout = (message = "Logged out successfully") => dispatch => {
  Cookie.remove('expires_at');
  Cookie.remove('token');
  Cookie.remove('user');
  dispatch(logoutSuccess());
  toast.info(message,{ hideProgressBar: true, position: "top-center" })
};

export const registerUser = creds => dispatch => {
  dispatch({type: REGISTER_START});

  apiClient.post('api/register/', creds)
    .then(response => {
      Cookie.set('expires_at', response.data.expires_at);
      Cookie.set('token', response.data.token);
      Cookie.set('user', response.data.user);
      dispatch(loginSuccess(response.data.token, response.data.user))
      toast.success("You've been registered successfully");
    })
    .catch(error => dispatch(registerErrors(parseErrors(error))))
};
