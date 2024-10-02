// "use client";
import React from "react";
import { Map, Marker, ViewStateChangeEvent } from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import { MapBoxProps } from "../types/MapTypes";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiemFoZmlyIiwiYSI6ImNtMWw2emJzazAyanAya3B2b2psYXJlbXIifQ.lqcRz0-kLaGP4vIgZNmHIw";

const MapBox: React.FC<MapBoxProps> = ({
  viewState,
  onMove,
  addressCoords,
}) => {
  // const map = new Map({
  //   accessToken: MAPBOX_ACCESS_TOKEN,
  //   container: "mapContainer",
  //   style: "mapbox://styles/mapbox/streets-v11",
  //   ...viewState,
  // });

  // if (addressCoords.length > 0) {
  //   const bounds = getBounds(addressCoords);
  //   map.fitBounds(bounds, {
  //     padding: 50, // Add padding to ensure markers are not too close to the edges
  //     maxZoom: 14, // Set a maximum zoom level to avoid zooming in too far
  //   });
  // }

  return (
    <Map
      {...viewState}
      onMove={(e: ViewStateChangeEvent) => onMove(e)}
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      style={{ width: "100%", height: "100%", position: "fixed" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      {...addressCoords.map((coord, key) => (
        <Marker
          key={coord}
          longitude={coord.longitude}
          latitude={coord.latitude}
          anchor="bottom"
        ></Marker>
      ))}
    </Map>
  );
};

export default MapBox;
