"use client";

import { useEffect, useState } from "react";
import MapComponent from "@/app/components/Map";
import { LngLat } from "mapbox-gl";
import { MapViewState } from "@/app/types/MapTypes";
import { ViewStateChangeEvent } from "react-map-gl";
import "bootstrap/dist/css/bootstrap.min.css";
import { SearchBox } from "@mapbox/search-js-react";
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiemFoZmlyIiwiYSI6ImNtMWw2emJzazAyanAya3B2b2psYXJlbXIifQ.lqcRz0-kLaGP4vIgZNmHIw";

export default function Home() {
  const [userLocation, setLocation] = useState<LngLat>();
  const [viewState, setViewState] = useState<MapViewState>();

  console.log(userLocation);

  // Gets location from browser
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;

        const location = new LngLat(longitude, latitude);
        const viewState: MapViewState = {
          longitude: longitude,
          latitude: latitude,
          zoom: 14,
        };

        setLocation(location);
        setViewState(viewState);
        console.log("location", location);
      });
    }
  }, []);

  // Callback function for when the map moves
  const onMapMove = (e: ViewStateChangeEvent) => {
    if (!e) return;
    setViewState(e.viewState);
  };

  if (!userLocation) return null;
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "25rem",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 1)",
          padding: "20px",
          zIndex: 1,
        }}
      >
        <h1>Meet Me Halfway</h1>
        <p>Who&apos;s meeting up today?</p>
        <SearchBox accessToken={MAPBOX_ACCESS_TOKEN} />
      </div>
      <MapComponent viewState={viewState} onMove={onMapMove} />
    </div>
  );
}
