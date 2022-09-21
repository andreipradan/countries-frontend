import {
	FETCH_SCORES_FAILURE,
	FETCH_SCORES_START,
	FETCH_SCORES_SUCCESS,
	FOUND_COUNTRY,
	NEW_GAME,
	SET_GAME_OVER, SET_RANDOM_COUNTRY, SCORE_ADD_FAILURE,
	SET_STATE, SCORE_ADD_SUCCESS,
} from '../actions/map';
import worldGeodata from "@amcharts/amcharts5-geodata/worldLow";
import countries2 from "@amcharts/amcharts5-geodata/data/countries2";
import {
	gameSubTypes,
	gameTypes,
	officialCountryCodes
} from "../pages/dashboard/utils";


const getRandomCountry = countries =>
	countries[Math.floor(Math.random()*countries.length)]

const initialState = {
	activeMap: null,
	countries: null,
	currentCountry: null,
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
				for (const gameSubType in gameSubTypes) {
					const gameTypeScores = action.scores.filter(s =>
						s.game_type === parseInt(gameType) &&
						s.game_sub_type === parseInt(gameSubType)
					).sort((a, b) =>
						a.score > b.score
							? -1 : a.score === b.score
								? a.duration < b.duration ? -1 : 1
								: 1
					)
					if (gameTypeScores.length) {
						console.log(`added ${gameType} - ${gameSubType}`)
						if (!scores[gameTypes[gameType]])
							scores[gameTypes[gameType]] = {[gameSubTypes[gameSubType]]: gameTypeScores}
						else
							scores[gameTypes[gameType]][gameSubTypes[gameSubType]] = gameTypeScores
					}
				}
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
			const remainingCountries = state.countries.filter(c =>
				c.name !== countryToRemove.name
			)
			return Object.assign({}, state, {
				countries: remainingCountries,
				foundCountries: state.foundCountries
					? [...state.foundCountries, country]
					: [country],
				currentCountry: state.currentCountry
					? getRandomCountry(remainingCountries)
					: null
			});
		case NEW_GAME:
			const activeMap = action.payload
			const countries = activeMap !== "World"
				? worldGeodata.features.filter(c =>
					officialCountryCodes.includes(c.id)
						? c.id === "KN"
							? activeMap === "North America"
							: countries2[c.id]?.continent === activeMap
						: false
      		)
				: worldGeodata.features.filter(c => officialCountryCodes.includes(c.id))
			return Object.assign({}, state, {
				activeMap: activeMap,
				countries: countries.map(f =>
					({id: f.properties.id, name: f.properties.name})),
				currentCountry: null,
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
		case SET_RANDOM_COUNTRY:
			return Object.assign({}, state, {
				currentCountry: getRandomCountry(state.countries)
			})
		case SCORE_ADD_FAILURE:
			return Object.assign({}, state, {
				gameOver: true,
				inProgress: false,
				errors: action.errors,
			})
		case SCORE_ADD_SUCCESS:
			const gameScores = state.scores[action.gameType]?.[action.gameSubType]
			const newScores = gameScores?.length
				? [...gameScores, action.score].sort((a, b) =>
					a.score > b.score
						? -1 : a.score === b.score
							? a.duration < b.duration ? -1 : 1
							: 1)
				: [action.score]
			return Object.assign({}, state, {
				scores: !state.scores
					? {[action.gameType]: {[action.gameSubType]: newScores}}
					: !state.scores[action.gameType]
						? {...state.scores, [action.gameType]: {[action.gameSubType]: newScores}}
						: !state.scores[action.gameType][action.gameSubType]
							? {...state.scores,
								[action.gameType]: {
									...state.scores[action.gameType],
									[action.gameSubType]: newScores
								}}
							: {
								...state.scores,
								[action.gameType]: {
									...state.scores[action.gameType],
									[action.gameSubType]: {
										...state.scores[action.gameType][action.gameSubType],
										newScores
									}
								}}
			})
		case SET_STATE:
			return Object.assign({}, state, action.payload)
		default:
			return state;
	}
}
