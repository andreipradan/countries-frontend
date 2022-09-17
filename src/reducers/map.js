import {
	FETCH_SCORES_FAILURE,
	FETCH_SCORES_START,
	FETCH_SCORES_SUCCESS,
	FOUND_COUNTRY,
	NEW_GAME,
	SET_GAME_OVER, SCORE_ADD_FAILURE,
	SET_STATE, SCORE_ADD_SUCCESS,
} from '../actions/map';
import worldGeodata from "@amcharts/amcharts5-geodata/worldLow";
import countries2 from "@amcharts/amcharts5-geodata/data/countries2";
import {gameTypes} from "../pages/dashboard/utils";

const initialState = {
	activeMap: null,
	countries: null,
	errors: null,
	foundCountries: null,
	gameCounter: 0,
	gameOver: false,
	inProgress: false,
	loading: false,
	scores: null,
	series: null,
	totalCountries: 0,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case FETCH_SCORES_FAILURE: return Object.assign({}, state, {
			errors: action.errors, loading: false, scores: null,
		})
		case FETCH_SCORES_START: return Object.assign({}, state, {
			errors: null, loading: true, scores: null,
		})
		case FETCH_SCORES_SUCCESS:
			const scores = {}
			for (const gameType in gameTypes) {
				const gameTypeScores = action.scores.filter(s => s.game_type === parseInt(gameType)).sort((a, b) =>
          a.score > b.score
            ? -1 : a.score === b.score
              ? a.duration < b.duration ? -1 : 1
              : 1
        )
        if (gameTypeScores.length)
          scores[gameTypes[gameType]] = gameTypeScores
			}
			return Object.assign({}, state, {
				errors: null,
				loading: false,
				scores: scores,
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
				gameCounter: countries?.map(c => c.properties.name).reduce((partialSum, item) => partialSum + item.length, 0) / 2.3,
				gameOver: false,
				inProgress: false,
				totalCountries: countries.length,
			})
		case SET_GAME_OVER:
			return Object.assign({}, state, {
				gameOver: true,
				inProgress: false,
			})
		case SCORE_ADD_FAILURE:
			return Object.assign({}, state, {
				gameOver: true,
				inProgress: false,
				errors: action.errors,
			})
		case SCORE_ADD_SUCCESS:
			const gameType = gameTypes[action.gameTypeId]
			const gameScores = state.scores[gameType]
			const newScores = gameScores?.length
				? [...gameScores, action.score].sort((a, b) =>
					a.score > b.score
						? -1 : a.score === b.score
							? a.duration < b.duration ? -1 : 1
							: 1)
				: [action.score]
			return Object.assign({}, state, {
				scores: !state.scores
					? {[gameType]: newScores}
					: {...state.scores, [gameType]: newScores}
			})
		case SET_STATE:
			return Object.assign({}, state, action.payload)
		default:
			return state;
	}
}
