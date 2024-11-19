"use client";
import React, { useRef } from "react";
import { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_ACCESS_TOKEN } from "@/app/page";
import {
  useInitMap,
  useUserLocation,
  useStateListener,
} from "@/app/hooks/useMap";

/**
 * MapboxGL component initializes and renders a Mapbox GL map.
 *
 * This component uses the following hooks:
 * - `useInitMap`: Initializes the map with the provided container reference, map reference, and access token.
 * - `useUserLocation`: Tracks and updates the user's location on the map.
 * - `useStateListener`: Listens to state changes and updates the map accordingly.
 *
 * @component
 * @returns {JSX.Element} A div element that serves as the container for the Mapbox GL map.
 *
 * @example
 * // Usage example:
 * import MapboxGL from "@/app/components/MapboxGL";
 *
 * const App = () => (
 *   <div>
 *     <MapboxGL />
 *   </div>
 * );
 *
 * export default App;
 */
const MapboxGL = (): JSX.Element => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  useInitMap(mapContainerRef, mapRef, MAPBOX_ACCESS_TOKEN ?? "");
  useUserLocation(mapRef);
  useStateListener(mapRef);

  return (
    <div
      ref={mapContainerRef}
      style={{ position: "fixed", width: "100%", height: "100%" }}
    ></div>
  );
};

export default MapboxGL;

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom?: number;
}
