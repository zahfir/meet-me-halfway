import React, { useEffect, useRef } from "react";
import mapboxgl, {
  LngLatBounds,
  Marker,
  Popup,
  Map,
  PaddingOptions,
} from "mapbox-gl";
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

  // Map init
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN ?? "";
      mapRef.current = new Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/dark-v11",

        ...viewState,
      });
    }
  }, [viewState, onMove]);

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
  left: 800, // Adjusted for sidebar
};

export default MapboxGL;
