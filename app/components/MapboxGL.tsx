import React, { useEffect, useRef } from "react";
import mapboxgl, {
  LngLatBounds,
  Marker,
  Popup,
  Map,
  PaddingOptions,
  LngLat,
} from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_ACCESS_TOKEN } from "@/app/page";
import useMapStore from "@/app/state/useMapStore";

interface MapboxGLProps {
  addressCoords: { longitude: number; latitude: number }[];
}

const MAP_STYLE = "mapbox://styles/mapbox/dark-v11";

const MapboxGL: React.FC<MapboxGLProps> = ({ addressCoords }) => {
  const { setUserLocation, setViewState } = useMapStore();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  // Initialize the map on first render
  useEffect(() => {
    const mapIsAvailable = mapRef.current;
    const containerIsAvailable = mapContainerRef.current;
    if (!mapIsAvailable && containerIsAvailable) {
      mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN ?? "";
      mapRef.current = new Map({
        container: mapContainerRef.current!,
        style: MAP_STYLE,
      });
    } else {
      console.debug(containerIsAvailable, mapIsAvailable);
    }
  }, [mapContainerRef.current]);

  // Update the map view when the view state is updated
  useEffect(() => {
    const unsubscribe = useMapStore.subscribe((state, prevState) => {
      if (mapRef.current && state.viewState !== prevState.viewState) {
        console.log("change in state.viewState", state.viewState);
        const { longitude, latitude, zoom } = state.viewState!;

        mapRef.current.setCenter([longitude, latitude]);
        mapRef.current.setZoom(zoom!);
      }
    });
    return () => unsubscribe();
  }, []);

  // Get user location and set view state
  useEffect(() => {
    const geolocationIsAvailable = "geolocation" in navigator;
    if (
      mapRef.current &&
      geolocationIsAvailable &&
      !useMapStore.getState().userLocation
    ) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        const location = new LngLat(longitude, latitude);
        console.log("location", location);
        setUserLocation(location);
        setViewState({
          longitude: location.lng,
          latitude: location.lat,
          zoom: 14,
        });
      });
    }
  }, []);

  // Update the map when the address list changes
  useEffect(() => {
    if (mapRef.current && addressCoords.length > 0) {
      customFitBounds(mapRef.current, addressCoords);
      buildMarker(addressCoords, mapRef.current);
    }
  }, [addressCoords]);

  return (
    <div
      ref={mapContainerRef}
      style={{ position: "fixed", width: "100%", height: "100%" }}
    ></div>
  );
};

const customFitBounds = (map: Map, addressCoords: any) => {
  map.fitBounds(getBounds(addressCoords), {
    padding: FitBoundsPadding,
    maxZoom: 14,
  });
};

const getBounds = (addressCoords: any) => {
  const bounds = new LngLatBounds();
  addressCoords.forEach((address: any) => {
    bounds.extend([address.longitude, address.latitude]);
  });
  return bounds;
};

const buildMarker = (addressCoords: any, map: Map) => {
  addressCoords.forEach(
    (coord: { longitude: number; latitude: number }, index: number) => {
      new Marker()
        .setLngLat([coord.longitude, coord.latitude])
        .setPopup(new Popup().setText(`Marker ${index + 1}`))
        .addTo(map);
    }
  );
};

const FitBoundsPadding: PaddingOptions = {
  top: 300,
  bottom: 300,
  right: 300,
  left: 800,
};

export default MapboxGL;
export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom?: number;
}
