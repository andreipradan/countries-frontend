import apiClient from '../api'
import { logout } from "./user";
import { parseErrors } from "./helpers";

export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE'
export const FETCH_USERS_START = 'FETCH_USERS_START'
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS'

export const FOUND_COUNTRY = 'FOUND_COUNTRY';
export const NEW_GAME = 'NEW_GAME';
export const SET_GAME_OVER = 'SET_GAME_OVER';
export const SET_STATE = 'SET_STATE';

export const USER_SCORE_FAILURE = 'USER_SCORE_FAILURE'
export const USER_SCORE_UPDATE = 'USER_SCORE_UPDATE'

const fetchUsersError = errors => ({ type: FETCH_USERS_FAILURE, errors: errors})
export const foundCountry = payload => ({type: FOUND_COUNTRY, payload})
export const newGame = payload => ({type: NEW_GAME, payload})
export const setState = payload => ({type: SET_STATE, payload})

export const fetchUsers = (token, userId) => dispatch => {
  dispatch({type: FETCH_USERS_START})
  apiClient.get(
    "api/users/",
    {headers: {'Authorization': 'Token ' + token}})
    .then(response => {
      dispatch({type: FETCH_USERS_SUCCESS, users: response.data, userId: userId})
    })
    .catch(error => {
      const logoutErrors = ['Token expired.', 'Invalid token.'];
      if (logoutErrors.includes(error.response?.data?.detail)) {
        dispatch(logout("Session expired. Please log in again"))
      }
      dispatch(fetchUsersError([error.message]))
    });
}

export const setGameOver = (token, score, userId, gameTypeId) => dispatch => {
	apiClient.post(
		`api/scores/`,
		{user: userId, score: score, game_type: gameTypeId},
		{headers: {Authorization: `Token ${token}`}})
		.then(response => {
			dispatch({type: USER_SCORE_UPDATE, score: response.data, gameTypeId})
		})
		.catch(error => dispatch({type: USER_SCORE_FAILURE, errors: parseErrors(error)}))
	dispatch({type: SET_GAME_OVER})
}
