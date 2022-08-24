import React, {useEffect, useState} from "react";
import { Row, Col, ButtonGroup, Button } from "reactstrap";
import { connect } from "react-redux";

import Map from "./components/Map/Map";
import ProgressStats from "./components/ProgressStats";
import ResultsModal from "./components/ResultsModal"
import Widget from "../../components/Widget";
import s from "./Dashboard.module.scss";

import { setGameOver, newGame } from "../../actions/map";

const secondsToTime = secs => {
  let divisor_for_minutes = secs % (60 * 60);
  let minutes = Math.floor(divisor_for_minutes / 60);

  let divisor_for_seconds = divisor_for_minutes % 60;
  let seconds = Math.ceil(divisor_for_seconds);

  if (minutes / 10 < 1) minutes = `0${minutes}`
  if (seconds / 10 < 1) seconds = `0${seconds}`
  return {"mins": minutes, "secs": seconds}
}

const Dashboard = props => {
  const [counter, setCounter] = useState(0)
  const [inProgress, setInProgress] = useState(false)
  const [started, setStarted] = useState(false)
  const [modal, setModal] = useState(false)

  const {mins, secs} = secondsToTime(counter)

  useEffect(() => setCounter(props.totalCountries * 10), [props.totalCountries])

  useEffect(() => {
    inProgress && setTimeout(() => {
      if (counter < 1 || !props.countries.length ) handleEndGame()
      else setCounter(counter - 1)
    }, 1000)
  })

  const handleEndGame = () => {
    props.dispatch(setGameOver(true))
    setInProgress(false)
    setStarted(false)
    setModal(true)
  }

  const handleNewGame = () => {
    props.dispatch(newGame(props.activeMap))
    setCounter(props.totalCountries * 10)
    setGameOver(false)
    setInProgress(false)
    setStarted(false)
  }

  const startStopGame = () => {
    setInProgress(!inProgress)
    if (inProgress) setStarted(true)
    if (!inProgress && props.gameOver) handleNewGame()
  }

  return (
    <div className={s.root}>
      <h1 className="page-title">
        Dashboard &nbsp;<small><small>Country Guesser</small></small>
      </h1>
      <Row>
        <Col lg={9}>
          <Widget className="bg-transparent">
            <Map inProgress={inProgress} started={started}/>
          </Widget>
        </Col>

        {
          props.activeMap
            ? <Col lg={3}>
              <Widget
                className="bg-transparent"
                title={<h5>{" "}Map<span
                  className="fw-semi-bold">&nbsp;Statistics</span></h5>}
                refresh
                close
              >
                <ButtonGroup>
                  <Button
                    className="text-white"
                    color="info"
                    size="xs"
                    type="submit"
                    onClick={startStopGame}
                  >
                    <span className="auth-btn-circle ">
                      <i className="la la-play"/>
                    </span>
                    {
                      inProgress
                        ? "Pause"
                        : started
                          ? "Resume"
                          : props.gameOver
                            ? "New game"
                            : "Start"
                    }
                  </Button>
                  {
                    !inProgress && started && <>
                      <Button
                        className="text-white"
                        color="warning"
                        size="xs"
                        onClick={handleNewGame}
                      >
                        <span className="auth-btn-circle ">
                          <i className="la la-refresh"/>
                        </span>
                        Restart
                      </Button>
                      <Button
                        className="text-white"
                        color="danger"
                        size="xs"
                        onClick={handleEndGame}
                      >
                        <span className="auth-btn-circle ">
                          <i className="la la-times"/>
                        </span>
                        End game
                      </Button>
                    </>
                  }
                  {
                    props.gameOver && !modal && <Button
                      className="text-white"
                      color="danger"
                      size="xs"
                      onClick={() => setModal(true)}
                    >
                      <span className="auth-btn-circle ">
                        <i className="la la-trophy"/>
                      </span>
                      Results
                    </Button>
                  }
                </ButtonGroup>
                <ProgressStats label="Countries found"
                               value={props.foundCountries?.length || 0}
                               total={props.totalCountries} dynamicLabel/>
                <ProgressStats label="Countries remaining"
                               value={props.countries?.length}
                               total={props.totalCountries}/>
                <ProgressStats label="Total countries" value={props.totalCountries}
                               total={props.totalCountries}/>
                <ProgressStats label="Time remaining" value={counter} dynamicLabel
                               verbose={`${mins}:${secs}`} total={props.totalCountries * 10}/>
              </Widget>
            </Col>
          : "Please select a map"
        }

      </Row>
      <ResultsModal
        body={"foo"}
        isOpen={modal}
        toggle={() => setModal(!modal)}
      />
    </div>
  );
}

export default connect(state => state.map)(Dashboard)
