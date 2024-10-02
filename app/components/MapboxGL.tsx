import React, { useEffect, useRef } from "react";
import mapboxgl, { LngLatBounds, Marker, Popup, Map } from "mapbox-gl";
import { MAPBOX_ACCESS_TOKEN } from "../page";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapboxGLProps {
  viewState: any;
  onMove: (event: any) => void;
  addressCoords: { longitude: number; latitude: number }[];
}

const MapboxGL: React.FC<MapboxGLProps> = ({
  viewState,
  onMove,
  addressCoords,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Callback initializes the map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN ?? "";
      mapRef.current = new Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        ...viewState,
      });
    }
  }, [viewState, onMove]);

  // Callback centers the map on the current addresses
  useEffect(() => {
    if (mapRef.current && addressCoords.length > 0) {
      const bounds = new LngLatBounds();
      addressCoords.forEach((coord) => {
        bounds.extend([coord.longitude, coord.latitude]);
      });

      mapRef.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 14,
      });

      addressCoords.forEach((coord, index) => {
        new Marker()
          .setLngLat([coord.longitude, coord.latitude])
          .setPopup(new Popup().setText(`Marker ${index + 1}`))
          .addTo(mapRef.current!);
      });
    }
  }, [addressCoords]);

  return (
    <div
      ref={mapContainerRef}
      style={{ position: "relative", width: "100vw", height: "100vh" }}
    ></div>
  );
};

const getBounds = (addressCoords: any) => {
  const bounds = new LngLatBounds();
  addressCoords.forEach((address: any) => {
    // Assuming address is an object with longitude and latitude properties
    bounds.extend([address.longitude, address.latitude]);
  });

  return bounds;
};

export default MapboxGL;
