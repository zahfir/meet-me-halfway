// "use client";
import React from "react";
import { Map, ViewStateChangeEvent } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapBoxProps } from "../types/MapTypes";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiemFoZmlyIiwiYSI6ImNtMWw2emJzazAyanAya3B2b2psYXJlbXIifQ.lqcRz0-kLaGP4vIgZNmHIw";

const MapBox: React.FC<MapBoxProps> = ({ viewState, onMove }) => {
  return (
    <Map
      {...viewState}
      onMove={(e: ViewStateChangeEvent) => onMove(e)}
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      style={{ width: "100%", height: "100%", position: "fixed" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
  );
};

export default MapBox;
