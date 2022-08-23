export const CLEAR_FOUND_COUNTRIES = 'CLEAR_FOUND_COUNTRIES';
export const FOUND_COUNTRY = 'FOUND_COUNTRY';
export const NEW_GAME = 'NEW_GAME';
export const SET_ACTIVE_MAP = 'SET_ACTIVE_MAP';
export const SET_COUNTRIES = 'SET_COUNTRIES';

export const clearFoundCountries = payload => ({type: CLEAR_FOUND_COUNTRIES, payload})
export const newGame = () => ({type: NEW_GAME})
export const foundCountry = payload => ({type: FOUND_COUNTRY, payload})
export const setActiveMap = payload => ({type: SET_ACTIVE_MAP, payload})
export const setCountries = payload => ({type: SET_COUNTRIES, payload})
