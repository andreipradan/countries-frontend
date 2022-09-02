import {
	FETCH_USERS_FAILURE,
	FETCH_USERS_START,
	FETCH_USERS_SUCCESS,
	FOUND_COUNTRY,
	NEW_GAME,
	SET_COUNTRIES,
	SET_GAME_OVER, SET_SCORE_FAILURE,
	SET_STATE
} from '../actions/map';
import worldGeodata from "@amcharts/amcharts5-geodata/worldLow";
import countries2 from "@amcharts/amcharts5-geodata/data/countries2";

const initialState = {
	activeMap: null,
	countries: null,
	errors: null,
	foundCountries: null,
	gameOver: false,
	inProgress: false,
	loading: false,
	topScore: 0,
	totalCountries: 0,
	users: null,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case FETCH_USERS_FAILURE: return Object.assign({}, state, {
			errors: action.errors, loading: false, users: null,
		})
		case FETCH_USERS_START: return Object.assign({}, state, {
			errors: null, loading: true, users: null,
		})
		case FETCH_USERS_SUCCESS:
			const users = action.users.sort((a, b) => a.score > b.score ? -1 : 1)
			return Object.assign({}, state, {
				errors: null,
				loading: false,
				users: users,
				topScore: users[0].score,
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
				gameOver: true,
				inProgress: false,
			})
		case SET_SCORE_FAILURE:
			return Object.assign({}, state, {
				gameOver: true,
				inProgress: false,
				errors: action.errors,
			})
		case SET_STATE:
			return Object.assign({}, state, action.payload)
		default:
			return state;
	}
}
