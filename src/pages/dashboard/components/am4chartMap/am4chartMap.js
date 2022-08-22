import React, {useEffect, useLayoutEffect, useState} from 'react';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import worldGeodata from "@amcharts/amcharts4-geodata/worldLow";

import s from './am4chartMap.module.scss';
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

const Am4chartMap = props => {
  const [series, setSeries] = useState(null)

  useLayoutEffect(() => {
    props.dispatch(newGame())
    let map = am4core.create("map", am4maps.MapChart);
    map.geodata = worldGeodata;
    map.percentHeight = 90;
    map.dy = 10;
    map.projection = new am4maps.projections.Miller();

    let polygonSeries = map.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    polygonSeries.exclude = ["AQ"]
    map.homeZoomLevel = 1.2;
    map.zoomControl = new am4maps.ZoomControl();
    map.zoomControl.layout = 'horizontal';
    map.zoomControl.align = 'left';
    map.zoomControl.valign = 'bottom';
    map.zoomControl.dy = -10;
    map.zoomControl.contentHeight = 20;
    map.zoomControl.minusButton.background.fill = am4core.color("#C7D0FF");
    map.zoomControl.minusButton.background.stroke = am4core.color("#6979C9");
    map.zoomControl.minusButton.label.fontWeight = 600;
    map.zoomControl.minusButton.label.fontSize = 22;
    map.zoomControl.minusButton.scale = .75;
    map.zoomControl.minusButton.label.scale = .75;
    map.zoomControl.plusButton.background.fill = am4core.color("#C7D0FF");
    map.zoomControl.plusButton.background.stroke = am4core.color("#6979C9");
    map.zoomControl.plusButton.label.fontWeight = 600;
    map.zoomControl.plusButton.label.fontSize = 22;
    map.zoomControl.plusButton.label.align = "center";
    map.zoomControl.plusButton.scale = .75;
    map.zoomControl.plusButton.label.scale = .75;
    map.zoomControl.plusButton.dx = 5;

    let plusButtonHoverState = map.zoomControl.plusButton.background.states.create("hover");
    plusButtonHoverState.properties.fill = am4core.color("#354D84");

    let minusButtonHoverState = map.zoomControl.minusButton.background.states.create("hover");
    minusButtonHoverState.properties.fill = am4core.color("#354D84");

    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name} {id} {found}";
    polygonTemplate.fill = am4core.color("#474D84");
    polygonTemplate.stroke = am4core.color("#6979C9")

    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#354D84");
    polygonTemplate.propertyFields.fill = "fill";

    setSeries(polygonSeries)
    return () => map.dispose()
  }, [])

  useEffect(() => {
    if (!series) return
    series.data = worldGeodata.features.map(c => {
      const config = {
        id: c.properties.id,
        name: c.properties.name,
        columnSettings: null
      }
      if (props.foundCountries?.includes(c.properties.name)) {
        config["fill"] = am4core.color("#7ed01c");
      }
      return config
    })
  }, [props.foundCountries])

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

export default connect(state => state.map)(Am4chartMap)
