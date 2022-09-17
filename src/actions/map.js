import apiClient from '../api'
import { logout } from "./user";
import { parseErrors } from "./helpers";

export const FETCH_SCORES_FAILURE = 'FETCH_USERS_FAILURE'
export const FETCH_SCORES_START = 'FETCH_USERS_START'
export const FETCH_SCORES_SUCCESS = 'FETCH_USERS_SUCCESS'

export const FOUND_COUNTRY = 'FOUND_COUNTRY';
export const NEW_GAME = 'NEW_GAME';
export const SET_GAME_OVER = 'SET_GAME_OVER';
export const SET_STATE = 'SET_STATE';

export const SCORE_ADD_FAILURE = 'USER_SCORE_FAILURE'
export const SCORE_ADD_SUCCESS = 'USER_SCORE_UPDATE'

const fetchScoresError = errors => ({ type: FETCH_SCORES_FAILURE, errors: errors})
export const foundCountry = payload => ({type: FOUND_COUNTRY, payload})
export const newGame = payload => ({type: NEW_GAME, payload})
export const setState = payload => ({type: SET_STATE, payload})

export const fetchScores = (token, userId) => dispatch => {
  dispatch({type: FETCH_SCORES_START})
  apiClient.get(
    "api/scores/",
    {headers: {'Authorization': 'Token ' + token}})
    .then(response => {
      dispatch({type: FETCH_SCORES_SUCCESS, scores: response.data, userId: userId})
    })
    .catch(error => {
      const logoutErrors = ['Token expired.', 'Invalid token.'];
      if (logoutErrors.includes(error.response?.data?.detail)) {
        dispatch(logout("Session expired. Please log in again"))
      }
      dispatch(fetchScoresError([error.message]))
    });
}

export const setGameOver = (token, userId, gameTypeId, score, duration) => dispatch => {
	apiClient.post(
		`api/scores/`,
		{user_id: userId, score: score, game_type: gameTypeId, duration: duration},
		{headers: {Authorization: `Token ${token}`}})
		.then(response => {
			dispatch({type: SCORE_ADD_SUCCESS, score: response.data, gameTypeId: gameTypeId})
		})
		.catch(error => dispatch({type: SCORE_ADD_FAILURE, errors: parseErrors(error)}))
	dispatch({type: SET_GAME_OVER})
}
