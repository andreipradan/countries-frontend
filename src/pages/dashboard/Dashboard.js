import React, {useEffect, useState} from "react";
import { connect } from "react-redux";
import {Row, Col, ButtonGroup, Button} from "reactstrap";

import AnimateNumber from "react-animated-number";

import Loader from "../../components/Loader";
import Map from "./components/Map/Map";
import Widget from "../../components/Widget";
import s from "./Dashboard.module.scss";
import widgetClasses from "../../components/Widget/Widget.module.scss";
import ProgressStats from "./components/ProgressStats";
import {newGame} from "../../actions/map";

const secondsToTime = secs => {
  let divisor_for_minutes = secs % (60 * 60);
  let minutes = Math.floor(divisor_for_minutes / 60);

  let divisor_for_seconds = divisor_for_minutes % 60;
  let seconds = Math.ceil(divisor_for_seconds);

  return {"m": minutes, "s": seconds}
}

const Dashboard = props => {
  const [counter, setCounter] = useState(300)
  const [inProgress, setInProgress] = useState(false)

  useEffect(() => {
    inProgress && setTimeout(() => {
      setCounter(counter - 1)
      if (counter < 1) setInProgress(false)
    }, 1000)
  })

  const startStopGame = () => {
    setInProgress(!inProgress)
    if (!inProgress) props.dispatch(newGame())
  }

  return (
    <div className={s.root}>
      <h1 className="page-title">
        Dashboard &nbsp;<small><small>Country Guesser</small></small>
      </h1>

      <Row>
        <Col lg={9}>
          <Widget className="bg-transparent">
            <Map inProgress={inProgress}/>
          </Widget>
        </Col>

        <Col lg={3}>
          <Widget
            className="bg-transparent"
            title={<h5>{" "}Map<span className="fw-semi-bold">&nbsp;Statistics</span></h5>}
            settings
            refresh
            close
          >
            <ButtonGroup>
              {
                props.loading
                ? <Loader className={widgetClasses.widgetLoader} size={40}/>
                : <Button
                  className="text-white"
                  color="info"
                  size="xs"
                  type="submit"
                  onClick={startStopGame}
                >
                  <span className="auth-btn-circle ">
                    <i className="la la-play"/>
                  </span>
                  {inProgress ? 'Stop': 'Start'}
                </Button>
              }
            </ButtonGroup>
            <p className="mt">Score: <strong><AnimateNumber value={props.foundCountries?.length}/></strong></p>
            <ProgressStats label="Total countries" value={props.totalCountries} total={props.totalCountries}/>
            <ProgressStats label="Countries remaining" value={props.countries?.length} total={props.totalCountries}/>
            <ProgressStats label="Time remaining" value={counter} total={300}/>
          </Widget>
        </Col>
      </Row>
    </div>
  );
}

export default connect(state => state.map)(Dashboard)
