import React from "react";
import {Row, Col, Progress, Table, Label, Input, Button} from "reactstrap";
import { connect } from "react-redux";


import Widget from "../../components/Widget";

import Map from "./components/Map/Map";
import ProgressStats from "./components/ProgressStats";

import s from "./FreeGuessing.module.scss";

import { fetchScores } from "../../actions/map";
import {gameSubTypes, getDisplayName} from "./utils";

class FreeGuessing extends React.Component {
  componentDidMount() {
    if (!this.props.scores) {
      this.props.dispatch(fetchScores(this.props.token, this.props.user.id))
    }
  }

  render() {
    const freeGuessingScores = this.props.scores?.["Free Guessing"]
    const scores = freeGuessingScores
      ? this.props.activeMap
        ? freeGuessingScores[this.props.activeMap]
        : Object.keys(freeGuessingScores).map(gameSubType =>
          freeGuessingScores[gameSubType][0]).sort((a, b) =>
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
              loading={this.props.loading}
              refresh={() => this.props.dispatch(fetchScores(this.props.token, this.props.user.id))}
              close
            >
              <p className="fw-semi-bold text-white">Top {this.props.activeMap} players</p>
              {
                scores?.length
                  ? scores.map((score, i) =>
                    <ProgressStats
                      key={i}
                      dynamicLabel
                      label={getDisplayName(score.user)}
                      header={!this.props.activeMap && gameSubTypes[score.game_sub_type]}
                      duration={score.duration}
                      value={score.score}
                      total={scores[0].score}
                    />
                  )
                  : <p className="text-warning small">
                    {
                      this.props.errors
                      ? <>Failed to fetch scores [{this.props.errors}]
                        <Button
                          className="text-warning"
                          color="transparent"
                          size="xs"
                          onClick={() => this.props.dispatch(fetchScores(this.props.token, this.props.user.id))}
                        >
                          <span className="auth-btn-circle ">
                            <i className="la la-refresh"/>
                          </span>
                        </Button>
                      </>
                      : `No scores ${this.props.activeMap ? `for ${this.props.activeMap}`: ""}`
                    }
                </p>
              }
            </Widget>
          </Col>
        </Row>
      </div>
    );
  }
}
export default connect(state => ({...state.map, token: state.auth.token, user: state.auth.user}))(FreeGuessing);
