export const CLEAR_FOUND_COUNTRIES = 'CLEAR_FOUND_COUNTRIES';
export const NEW_GAME = 'NEW_GAME';
export const REMOVE_COUNTRY = 'REMOVE_COUNTRY';
export const SET_COUNTRIES = 'SET_COUNTRIES';

export const clearFoundCountries = payload => ({type: CLEAR_FOUND_COUNTRIES, payload})
export const newGame = () => ({type: NEW_GAME})
export const removeCountry = payload => ({type: REMOVE_COUNTRY, payload})
export const setCountries = payload => ({type: SET_COUNTRIES, payload})
