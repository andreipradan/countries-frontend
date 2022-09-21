import React, {useEffect, useLayoutEffect, useState} from 'react';
import { connect } from "react-redux";

import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import worldMap from "@amcharts/amcharts5-geodata/worldHigh";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import s from '../../../dashboard/components/Map/Map.module.scss';
import Controls from "./components/Controls";

const defaultButtonProps = {
  paddingTop: 10,
  paddingBottom: 10,
  x: am5.percent(100),
  centerX: am5.percent(100),
  opacity: 0,
  interactiveChildren: false,
}

const Map = props => {
  const [series, setSeries] = useState(null)
  const [resetButton, setResetButton] = useState(null)

  useEffect(() => {
    if (!props.currentCountry) return console.log("no current country")
    resetButton && resetButton.events.on("click", () => {
      series.zoomToDataItem(
        series.dataItems.find(d => d.dataContext.id === props.currentCountry.id)
      )
    })
    series && series.zoomToDataItem(
      series.dataItems.find(di => di.dataContext.id === props.currentCountry.id)
    )
  }, [props.currentCountry, series])

  useEffect(() => {
    if (!props.currentCountry) return
    const data = worldMap.features.map(c => ({
      id: c.properties.id,
      name: c.properties.name,
      columnSettings: props.currentCountry.id === c.id
        ? {fill: am5.color("#c94612")}
        : props.foundCountries?.map(c => c.name).includes(c.properties.name)
          ? {fill: am5.color("#c9b112")}
          : null
    }))
    series.data.setAll(data)
  }, [series, props.currentCountry, props.foundCountries])

  useEffect(()=>{
    resetButton && (
      !props.currentCountry || !props.inProgress
        ? resetButton.hide()
        : resetButton.show()
    )
  }, [resetButton, props.gameOver, props.inProgress, props.currentCountry, props.started])

  const createHomeButton = (root, chart) => {
    const homeButton = chart.children.push(am5.Button.new(root, {
      ...defaultButtonProps,
      scale: .75,
      icon: am5.Graphics.new(root, {
        svgPath: "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8",
        fill: am5.color(0xffffff)
      })
    }));
    homeButton.events.on("click", () => chart.goHome())
    homeButton.show()
  }

  const createResetButton = (root, chart) => {
    const resetButton = chart.children.push(am5.Button.new(root, {
      ...defaultButtonProps,
      y: am5.percent(7),
      scale: .63,
      icon: am5.Graphics.new(root, {
        svgPath: "M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z",
        fill: am5.color(0xffffff)
      })
    }));
    resetButton.show()
    setResetButton(resetButton)
  }

  const createZoomControl = (root, chart) => {
    const zoomControl = am5map.ZoomControl.new(root, {});
    chart.set("zoomControl", zoomControl)
    zoomControl.minusButton.set("scale", .75)
    zoomControl.plusButton.set("scale", .75)
  }

  const generateSeries = (root, chart) => {
    const series = chart.series.push(am5map.MapPolygonSeries.new(root, {
      geoJSON: worldMap,
      include: worldMap.features.map(c => c.id),
      exclude: ["AQ"],
    }))
    series.mapPolygons.template.setAll(
      {templateField: "columnSettings", fill: am5.color("#474D84")})
    return series
  }

  useLayoutEffect(() => {
    const root = am5.Root.new("map")
    root.setThemes([am5themes_Animated.new(root)])

    let chart = root.container.children.push(
      am5map.MapChart.new(root, {projection: am5map.geoNaturalEarth1()})
    )

    const series = generateSeries(root, chart)
    setSeries(series)
    series.mapPolygons.template.events.on("click", ev => {
      series.zoomToDataItem(ev.target.dataItem)
    })
    createZoomControl(root, chart)
    createHomeButton(root, chart)
    createResetButton(root, chart)
    return () => root.dispose()
  }, [])

  return (
    <div className={s.mapChart}>
      <Controls />
      <div className={s.map} id="map" />
    </div>
  )
}

export default connect(state => state.map)(Map)
