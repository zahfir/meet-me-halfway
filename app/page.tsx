"use client";

import { useEffect, useState } from "react";
import { LngLat } from "mapbox-gl";
import { MapViewState } from "@/app/components/MapboxGL";
import { ViewStateChangeEvent } from "react-map-gl";
import { SearchBoxRetrieveResponse } from "@mapbox/search-js-core";
import "bootstrap/dist/css/bootstrap.min.css";
import AddressList from "./components/AddressList";
import MapboxGL from "./components/MapboxGL";
export const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiemFoZmlyIiwiYSI6ImNtMWw2emJzazAyanAya3B2b2psYXJlbXIifQ.lqcRz0-kLaGP4vIgZNmHIw";

export default function Home() {
  const [userLocation, setUserLocation] = useState<LngLat>();
  const [viewState, setViewState] = useState<MapViewState>();
  const [addresses, setAddresses] = useState<SearchBoxRetrieveResponse[]>([]);

  const addressCoords = addresses.map((address) => {
    return {
      longitude: address.features[0].geometry.coordinates[0],
      latitude: address.features[0].geometry.coordinates[1],
    };
  });

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

        setUserLocation(location);
        setViewState(viewState);
        console.log("location", location);
      });
    } else {
      console.log("Geolocation is not available");
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
      <MapboxGL
        viewState={viewState}
        onMove={onMapMove}
        addressCoords={addressCoords}
      />
      <div className="position-absolute top-0 start-0 w-25 h-100 bg-white bg-opacity-75 p-3 overflow-auto">
        <AddressList addresses={addresses} setAddresses={setAddresses} />
      </div>
    </div>
  );
}
