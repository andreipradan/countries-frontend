import React, {useEffect} from "react";
import {Button} from "reactstrap";
import {connect} from "react-redux";

import {gameSubTypes, getDisplayName} from "../utils";
import {fetchScores} from "../../../actions/map";
import ProgressStats from "../../randomMap/components/ProgressStats";
import Widget from "../../../components/Widget";


const TopScores = props => {

  useEffect(() => {
    if (!props.scores) {
      props.dispatch(fetchScores(props.token, props.user.id))
    }
  }, [])

  const gameScores = props.scores?.[props.gameType]
  const scores = gameScores
    ? props.activeMap
      ? gameScores[props.activeMap]
      : Object.keys(gameScores).map(gameSubType =>
        gameScores[gameSubType][0]).sort((a, b) =>
          a.score > b.score ? -1 : 1
        )
    : []

	return <Widget
		className="bg-transparent"
		loading={props.loading}
		refresh={() => props.dispatch(fetchScores(props.token, props.user.id))}
		close
	>
		<p className="fw-semi-bold text-white">Top {props.activeMap} players</p>
		{
			scores?.length
				? scores.map((score, i) =>
					<ProgressStats
						key={i}
						dynamicLabel
						label={getDisplayName(score.user)}
						header={!props.activeMap && gameSubTypes[score.game_sub_type]}
						duration={score.duration}
						value={score.score}
						total={scores[0].score}
					/>
				)
				: <p className="text-warning small">
					{
						props.errors
							? <>Failed to fetch scores [{props.errors}]
								<Button
									className="text-warning"
									color="transparent"
									size="xs"
									onClick={() => props.dispatch(fetchScores(props.token, props.user.id))}
								>
							<span className="auth-btn-circle ">
								<i className="la la-refresh"/>
							</span>
								</Button>
							</>
							: `No scores ${props.activeMap ? `for ${props.activeMap}` : ""}`
					}
				</p>
		}
	</Widget>
}

export default connect(state => ({...state.map, token: state.auth.token, user: state.auth.user}))(TopScores)
