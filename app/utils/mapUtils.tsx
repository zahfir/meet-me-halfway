import {
  LngLatBounds,
  Map,
  Marker,
  Popup,
  PaddingOptions,
  LngLat,
} from "mapbox-gl";
import markerColors from "@/app/constants/markerColors";
import Person from "../models/Person";
import { MutableRefObject } from "react";

export const FitBoundsPadding: PaddingOptions = {
  top: 300,
  bottom: 300,
  right: 300,
  left: 800,
};

export const customFitBounds = (
  map: MutableRefObject<Map | null>,
  bounds: LngLatBounds
) => {
  if (!map.current) return;
  try {
    map.current.fitBounds(bounds, {
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

export const createMarker = (addressCoords: LngLat, color: string) => {
  const marker = new Marker({
    color: color,
  })
    .setLngLat([addressCoords.lng, addressCoords.lat])
    .setPopup(new Popup().setText(color));
  return marker;
};

export const nextColor = (people: Person[]) => {
  // Returns the next available marker color from the list of marker colors.
  const usedColors = people.map((p) => p.marker?._color);
  const availableColor =
    markerColors.find((color) => !usedColors.includes(color)) ??
    markerColors[0];
  return availableColor;
};
