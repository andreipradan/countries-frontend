import React, {useEffect, useLayoutEffect, useState} from 'react';
import { Button } from "reactstrap";
import { connect } from "react-redux";

import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_continentsLow from "@amcharts/amcharts5-geodata/continentsLow";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import countries from "@amcharts/amcharts5-geodata/data/countries2";

import { newGame } from "../../../../actions/map";
import s from './Map.module.scss';
import Controls from "./components/Controls";

const Map = props => {
  const [allSeries, setAllSeries] = useState(null)
  const [continentSeries, setContinentSeries] = useState(null)
  const [homeButton, setHomeButton] = useState(null)

  const generateSeries = (chart, root, continent) => {
    const series = chart.series.push(am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_worldLow,
      include: am5geodata_worldLow.features.filter(c =>
        !!continent
        ? c.id === "KN"
          ? continent === "North America"
          : countries[c.id]?.continent === continent
        : true
      ).map(c => c.id),
      exclude: ["AQ"],
    }))
    series.hide()

    const template = series.mapPolygons.template
    template.setAll({
      tooltipText: "{name}",
      interactive: true,
      templateField: "columnSettings",
      fill: am5.color("#474D84")
    })
    template.states.create("hover", {fill: am5.color("#354D84")})
    return series
  }

  const playWorld = () => {
    homeButton.show()
    continentSeries.hide()
    allSeries.World.show()
    props.dispatch(newGame("World"))
  }

  useLayoutEffect(() => {
    const root = am5.Root.new("map")
    root.setThemes([am5themes_Animated.new(root)])

    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoNaturalEarth1(),
      })
    );

    const allSeries = {
      "Africa": generateSeries(chart, root, "Africa"),
      "Asia": generateSeries(chart, root, "Asia"),
      "Europe": generateSeries(chart, root, "Europe"),
      "North America": generateSeries(chart, root, "North America"),
      "Oceania": generateSeries(chart, root, "Oceania"),
      "South America": generateSeries(chart, root, "South America"),
      "World": generateSeries(chart, root),
    }
    setAllSeries(allSeries)
    const continentSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_continentsLow,
        exclude: ['antarctica'],
      }),
    );
    setContinentSeries(continentSeries)
    continentSeries.mapPolygons.template.events.on("click", ev => {
      homeButton.show()
      continentSeries.zoomToDataItem(ev.target.dataItem)
      continentSeries.hide()

      for (const continent in allSeries)
        if (continent === ev.target.dataItem.dataContext.name) {
          allSeries[continent].show()
          props.dispatch(newGame(continent))
        } else
          allSeries[continent].hide()
    });

    const continentTemplate = continentSeries.mapPolygons.template
    continentTemplate.setAll({
      tooltipText: "{name}",
      interactive: true,
      templateField: "columnSettings",
      fill: am5.color("#474D84")
    })
    continentTemplate.states.create("hover", {fill: am5.color("#354D84")})

    const zoomControl = am5map.ZoomControl.new(root, {});
    chart.set("zoomControl", zoomControl)
    zoomControl.minusButton.set("scale", .75)
    zoomControl.plusButton.set("scale", .75)

    const homeButton = chart.children.push(am5.Button.new(root, {
      paddingTop: 10,
      paddingBottom: 10,
      x: am5.percent(100),
      centerX: am5.percent(100),
      opacity: 0,
      interactiveChildren: false,
      scale: .75,
      icon: am5.Graphics.new(root, {
        svgPath: "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8",
        fill: am5.color(0xffffff)
      })
    }));
    homeButton.events.on("click", () => {
      chart.goHome();
      homeButton.hide();
      for (const continent in allSeries) allSeries[continent].hide()
      continentSeries.show()
      props.dispatch(newGame(null))
    });
    setHomeButton(homeButton)

    return () => root.dispose()

  }, [])

  useEffect(() => {
    if (!props.activeMap || !allSeries) return
    const data = am5geodata_worldLow.features.map(c => {
      const config = {
        id: c.properties.id,
        name: c.properties.name,
        columnSettings: null
      }
      if (props.foundCountries?.map(c => c.name).includes(c.properties.name)) {
        config["columnSettings"] = {fill: am5.color("#c9b112")}
      }
      return config
    })
    allSeries[props.activeMap].data.setAll(data)
  }, [allSeries, props.activeMap, props.foundCountries])

  useEffect(()=>{
    homeButton && (
      !props.activeMap || props.inProgress || (props.started && !props.gameOver)
        ? homeButton.hide()
        : homeButton.show()
    )
  }, [homeButton, props.gameOver, props.inProgress])

  return (
    <div className={s.mapChart}>
      {
        !props.activeMap && <span>
          Please select a continent or{" "}
          <Button
            className="text-white"
            color="default"
            size="xs"
            onClick={playWorld}
          >
            play with all the countries
          </Button>
        </span>
      }
      <Controls />
      <div className={s.map} id="map" />
    </div>
  );
}

export default connect(state => state.map)(Map)
