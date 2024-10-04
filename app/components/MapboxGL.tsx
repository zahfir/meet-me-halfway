"use client";
import React, { useRef } from "react";
import { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_ACCESS_TOKEN } from "@/app/page";
import {
  useInitializeMap,
  useUserLocation,
  useStateListener,
} from "@/app/hooks/useMap";

const MapboxGL = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  // Custom hooks for initializing the map, getting user location, and subscribing to viewState
  useInitializeMap(mapContainerRef, mapRef, MAPBOX_ACCESS_TOKEN ?? "");
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
