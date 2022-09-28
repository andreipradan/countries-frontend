import React, {useEffect} from "react";
import {Row, Col, Button} from "reactstrap";
import { connect } from "react-redux";


import Widget from "../../components/Widget";

import Map from "./components/Map/Map";
import ProgressStats from "./components/ProgressStats";

import s from "../dashboard/Dashboard.module.scss";

import { fetchScores } from "../../actions/map";
import { gameSubTypes, getDisplayName } from "../freeGuessing/utils";

const RandomMap = props => {
  useEffect(() => {
    if (!props.scores) {
      props.dispatch(fetchScores(props.token, props.user.id))
    }
  }, [])

  const randomMapScores = props.scores?.["Random Map"]
  const scores = randomMapScores
    ? props.activeMap
      ? randomMapScores[props.activeMap]
      : Object.keys(randomMapScores).map(gameSubType =>
        randomMapScores[gameSubType][0]).sort((a, b) =>
          a.score > b.score ? -1 : 1
        )
    : []

  return (
    <div className={s.root}>
      <Row>
        <Col lg={8}><Widget className="bg-transparent"><Map /></Widget></Col>
        <Col lg={1} />
        <Col lg={3}>
          <Widget
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
                    : `No scores ${props.activeMap ? `for ${props.activeMap}`: ""}`
                  }
              </p>
            }
          </Widget>
        </Col>
      </Row>

    </div>
  );
}
export default connect(state => ({...state.map, token: state.auth.token, user: state.auth.user}))(RandomMap);
