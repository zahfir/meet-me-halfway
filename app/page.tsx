"use client";

import { useEffect, useState } from "react";
import MapComponent from "@/app/components/Map";
import { LngLat, LngLatBounds, Map } from "mapbox-gl";
import { MapViewState } from "@/app/types/MapTypes";
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

  // const mapContainer = document.createElement("div");
  // mapContainer.id = "map";
  // mapContainer.style.width = "100vw";
  // mapContainer.style.height = "100vh";
  // mapContainer.style.position = "relative";

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
    <div>
      <AddressList
        addresses={addresses}
        setAddresses={setAddresses}
      ></AddressList>
      <MapboxGL
        viewState={viewState}
        onMove={onMapMove}
        addressCoords={addressCoords}
      />
    </div>
  );
}
