import {
  LngLatBounds,
  Map,
  Marker,
  Popup,
  PaddingOptions,
  LngLat,
} from "mapbox-gl";
import { SearchBoxRetrieveResponse } from "@mapbox/search-js-core";

export const customFitBounds = (map: Map, bounds: LngLatBounds) => {
  try {
    map.fitBounds(bounds, {
      padding: FitBoundsPadding,
      maxZoom: 14,
    });
  } catch (error) {
    console.error("Error fitting bounds", error);
  }
};

export const getBounds = (addressCoords: LngLat[]) => {
  const bounds = new LngLatBounds();
  addressCoords.forEach((coord: LngLat) => {
    bounds.extend([coord.lng, coord.lat]);
  });
  return bounds;
};

export const buildMarker = (map: Map, addressCoords: LngLat, color: string) => {
  const marker = new Marker({
    color: color,
  })
    .setLngLat([addressCoords.lng, addressCoords.lat])
    .setPopup(new Popup().setText(color))
    .addTo(map);
  return marker;
};

export const FitBoundsPadding: PaddingOptions = {
  top: 300,
  bottom: 300,
  right: 300,
  left: 800,
};

export const getAddressCoords = (address: SearchBoxRetrieveResponse) => {
  return new LngLat(
    address.features[0].geometry.coordinates[0],
    address.features[0].geometry.coordinates[1]
  );
};
