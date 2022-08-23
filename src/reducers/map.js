import { CLEAR_FOUND_COUNTRIES, NEW_GAME, REMOVE_COUNTRY, SET_COUNTRIES } from '../actions/map';
import worldGeodata from "@amcharts/amcharts5-geodata/worldLow";

const initialState = {
	countries: null,
	foundCountries: null,
	totalCountries: 10,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case CLEAR_FOUND_COUNTRIES:
			return Object.assign({}, state, {foundCountries: null});
		case NEW_GAME:
			return Object.assign({}, state, {
				countries: worldGeodata.features.map(f =>
					({id: f.properties.id, name: f.properties.name})),
				totalCountries: worldGeodata.features.length,
			})
		case REMOVE_COUNTRY:
			const countryToRemove = state.countries.find(c => c.name.toLowerCase() === action.payload.toLowerCase())
			return Object.assign({}, state, {
				countries: state.countries.filter(c =>
					c.name !== countryToRemove.name
				),
				foundCountries: state.foundCountries
					? [...state.foundCountries, countryToRemove.name]
					: [countryToRemove.name]
			});
		case SET_COUNTRIES:
			return Object.assign({}, state, {countries: action.payload});
		default:
			return state;
	}
}
