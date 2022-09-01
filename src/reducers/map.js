import {
	FOUND_COUNTRY,
	NEW_GAME,
	SET_COUNTRIES,
	SET_GAME_OVER,
	SET_STATE
} from '../actions/map';
import worldGeodata from "@amcharts/amcharts5-geodata/worldLow";
import countries2 from "@amcharts/amcharts5-geodata/data/countries2";

const initialState = {
	activeMap: null,
	countries: null,
	foundCountries: null,
	gameOver: false,
	inProgress: false,
	totalCountries: 0,
};

export default (state = initialState, action) => {
	switch (action.type) {
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
		case NEW_GAME:
			const activeMap = action.payload
			const countries = activeMap !== "World"
				? worldGeodata.features.filter(c => c.id === "KN"
						? activeMap === "North America"
						: countries2[c.id]?.continent === activeMap
      		)
				: worldGeodata.features.filter(c => c.id !== "AQ")
			return Object.assign({}, state, {
				activeMap: activeMap,
				countries: countries.map(f =>
					({id: f.properties.id, name: f.properties.name})),
				foundCountries: null,
				gameOver: false,
				inProgress: false,
				totalCountries: countries.length,
			})
		case SET_COUNTRIES:
			return Object.assign({}, state, {countries: action.payload});
		case SET_GAME_OVER:
			return Object.assign({}, state, {
				gameOver: action.payload,
				inProgress: false,
			})
		case SET_STATE:
			return Object.assign({}, state, action.payload)
		default:
			return state;
	}
}