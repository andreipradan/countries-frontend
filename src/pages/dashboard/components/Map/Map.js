import React, {useEffect, useLayoutEffect, useState} from 'react';

import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import s from './Map.module.scss';
import {
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
import SearchIcon from "../../../../components/Icons/HeaderIcons/SearchIcon";
import {newGame, removeCountry} from "../../../../actions/map";
import {connect} from "react-redux";

const Map = props => {
  const [series, setSeries] = useState(null)

  useLayoutEffect(() => {
    props.dispatch(newGame())
    const root = am5.Root.new("map")
    root.setThemes([am5themes_Animated.new(root)])

    let chart = root.container.children.push(
      am5map.MapChart.new(root, {projection: am5map.geoNaturalEarth1()})
    );
    chart.percentHeight = 90
    chart.dy = 10

    chart.homeZoomLevel = 1.2;
    const zoomControl = am5map.ZoomControl.new(root, {});
    chart.set("zoomControl", zoomControl)
    zoomControl.layout = 'horizontal';
    zoomControl.align = 'left';
    zoomControl.valign = 'bottom';
    zoomControl.dy = -10;
    zoomControl.contentHeight = 20;
    zoomControl.minusButton.set("scale", .75)
    zoomControl.plusButton.set("scale", .75)
    zoomControl.plusButton.dx = 5;

    const series = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ['AQ']
      }),
    );
    setSeries(series)

    const template = series.mapPolygons.template
    template.setAll({
      tooltipText: "{name}",
      interactive: true,
      templateField: "columnSettings",
      fill: am5.color("#474D84")
    })
    template.states.create("hover", {
      fill: am5.color("#354D84")
    })
    return () => root.dispose()

  }, [])

  useEffect(() => {
    if (!series) return console.log("No series")
    const data = am5geodata_worldLow.features.map(c => {
      const config = {
        id: c.properties.id,
        name: c.properties.name,
        columnSettings: null
      }
      if (props.foundCountries?.includes(c.properties.name)) {
        config["columnSettings"] = {fill: am5.color("#c9b112")}
      }
      return config
    })
    series.data.setAll(data)
  }, [series, props.foundCountries])

  return (
    <div className={s.mapChart}>
      {
        props.inProgress && <div className={s.stats}>
          <span className="mr-xs fw-normal">
            <Form className="mr-3 ml-3" inline>
              <FormGroup>
                <InputGroup className={`input-group-no-border ${s.searchForm}`}>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className={s.inputGroupText}>
                      <SearchIcon className={s.headerIcon}/>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="search-input"
                    className="input-transparent"
                    placeholder="Country"
                    onInput={e => {
                      const text = e.target.value.toLowerCase()
                      if (props.countries.map(c => c.name.toLowerCase()).includes(text)) {
                        props.dispatch(removeCountry(text))
                        e.target.value = ""
                      }
                    }}
                    autoFocus
                  />
                </InputGroup>
              </FormGroup>
            </Form>
          </span>
        </div>
      }
      <div className={s.map} id="map">
        <span>Alternative content for the map</span>
      </div>
    </div>
  );
}

export default connect(state => state.map)(Map)
