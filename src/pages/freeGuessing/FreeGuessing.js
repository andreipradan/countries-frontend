import React, {useEffect} from "react";
import {Row, Col} from "reactstrap";
import { connect } from "react-redux";


import {setState} from "../../actions/map";
import Widget from "../../components/Widget";

import s from "./FreeGuessing.module.scss";
import Map from "./components/Map/Map";
import TopScores from "./components/TopScores";


const FreeGuessing = props => {
  useEffect(() => {
    props.dispatch(setState({gameType: "Free Guessing"}))
  }, [])

  return <div className={s.root}>
    <Row>
      <Col lg={8}><Widget className="bg-transparent"><Map/></Widget></Col>
      <Col lg={1}/>
      <Col lg={3}><TopScores/></Col>
    </Row>
  </div>
}

export default connect()(FreeGuessing)
