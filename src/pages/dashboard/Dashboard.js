import React from "react";

import Map from "./components/Map/Map";
import Widget from "../../components/Widget";
import s from "./Dashboard.module.scss";

export default () => {
  return <div className={s.root}>
    <h1 className="page-title">
      <small><small>Country Guesser</small></small>
    </h1>
    <Widget className="bg-transparent"><Map /></Widget>
  </div>
}
