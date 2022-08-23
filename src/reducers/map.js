import { CLEAR_FOUND_COUNTRIES, FOUND_COUNTRY, NEW_GAME, SET_ACTIVE_MAP, SET_COUNTRIES } from '../actions/map';
import worldGeodata from "@amcharts/amcharts5-geodata/worldLow";
import countries2 from "@amcharts/amcharts5-geodata/data/countries2";

const initialState = {
	activeMap: null,
	countries: null,
	foundCountries: null,
	totalCountries: 10,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case CLEAR_FOUND_COUNTRIES:
			return Object.assign({}, state, {foundCountries: null});
		case NEW_GAME:
			const countries = worldGeodata.features.filter(c =>
				countries2[c.id]?.continent === state.activeMap
			)
			return Object.assign({}, state, {
				countries: countries.map(f =>
					({id: f.properties.id, name: f.properties.name})),
				foundCountries: null,
				totalCountries: countries.length,
			})
		case FOUND_COUNTRY:
			const currentDate = new Date();
			const datetime = currentDate.getDate() + "/"
                + (currentDate.getMonth()+1)  + "/"
                + currentDate.getFullYear() + " @ "
                + currentDate.getHours() + ":"
                + currentDate.getMinutes() + ":"
                + currentDate.getSeconds();
			const countryToRemove = state.countries.find(c => c.name.toLowerCase() === action.payload.toLowerCase())
			const country = {name: countryToRemove.name, time: datetime}
			return Object.assign({}, state, {
				countries: state.countries.filter(c =>
					c.name !== countryToRemove.name
				),
				foundCountries: state.foundCountries
					? [...state.foundCountries, country]
					: [country]
			});
		case SET_ACTIVE_MAP:
			return Object.assign({}, state, {activeMap: action.payload})
		case SET_COUNTRIES:
			return Object.assign({}, state, {countries: action.payload});
		default:
			return state;
	}
}
