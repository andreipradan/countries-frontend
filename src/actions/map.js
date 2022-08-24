export const FOUND_COUNTRY = 'FOUND_COUNTRY';
export const NEW_GAME = 'NEW_GAME';
export const SET_COUNTRIES = 'SET_COUNTRIES';
export const SET_GAME_OVER = 'SET_GAME_OVER';

export const newGame = payload => ({type: NEW_GAME, payload})
export const foundCountry = payload => ({type: FOUND_COUNTRY, payload})
export const setCountries = payload => ({type: SET_COUNTRIES, payload})
export const setGameOver = payload => ({type: SET_GAME_OVER, payload})
