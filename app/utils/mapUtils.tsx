import {
  LngLatBounds,
  Map,
  Marker,
  PaddingOptions,
  LngLat,
  GeoJSONSourceSpecification,
} from "mapbox-gl";
import { markerColors } from "@/app/styles/colors";
import Person from "@/app/models/Person";
import { MutableRefObject } from "react";

export const FitBoundsPadding: PaddingOptions = {
  top: 300,
  bottom: 300,
  right: 300,
  left: 800,
};

/**
 * Returns the straight line distance between two points (Haversine formula)
 * @param coord1
 * @param coord2
 * @returns distance in km
 */
export const distance = (coord1: LngLat, coord2: LngLat) => {
  const r = 6371;
  const p = Math.PI / 180;

  const a =
    0.5 -
    Math.cos((coord2.lat - coord1.lat) * p) / 2 +
    (Math.cos(coord1.lat * p) *
      Math.cos(coord2.lat * p) *
      (1 - Math.cos((coord2.lng - coord1.lng) * p))) /
      2;

  return 2 * r * Math.asin(Math.sqrt(a));
};

/**
 * The `customFitBounds` function adjusts the map view to fit the given bounds with custom padding and maximum zoom level.
 *
 * @param {MutableRefObject<Map | null>} map - A reference to the Mapbox map instance.
 * @param {LngLatBounds} bounds - The bounds to fit the map view to.
 *
 * @example
 * const bounds = new LngLatBounds([[-77.0365, 38.8977], [-77.0365, 38.8978]]);
 * customFitBounds(mapRef, bounds);
 *
 * @returns {void}
 */
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

/**
 * The `getBounds` function calculates the bounding box for a given array of coordinates.
 *
 * @param {LngLat[]} addressCoords - An array of coordinates to calculate the bounding box for.
 *
 * @example
 * const coords = [new LngLat(-77.0365, 38.8977), new LngLat(-77.0365, 38.8978)];
 * const bounds = getBounds(coords);
 *
 * @returns {LngLatBounds} The calculated bounding box.
 */
export const getBounds = (addressCoords: LngLat[]) => {
  const bounds = new LngLatBounds();
  addressCoords.forEach((coord: LngLat) => {
    bounds.extend([coord.lng, coord.lat]);
  });
  return bounds;
};

/**
 * The `createMarker` function creates a new marker at the given coordinates with the specified color and optional custom element.
 *
 * @param {LngLat} addressCoords - The coordinates to place the marker at.
 * @param {string} color - The color of the marker.
 * @param {HTMLElement} [element] - An optional custom HTML element for the marker.
 *
 * @example
 * const marker = createMarker(new LngLat(-77.0365, 38.8977), "red");
 *
 * @returns {Marker} The created marker.
 */
export const createMarker = (
  addressCoords: LngLat,
  color: string,
  element?: HTMLElement
) => {
  const marker = new Marker({
    color: color,
    element: element,
  }).setLngLat([addressCoords.lng, addressCoords.lat]);
  return marker;
};

/**
 * The `nextColor` function returns the next available marker color from the list of marker colors.
 *
 * @param {Person[]} people - An array of people to check for used marker colors.
 *
 * @example
 * const color = nextColor(people);
 *
 * @returns {string} The next available marker color.
 */
export const nextColor = (people: Person[]) => {
  const usedColors = people.map((p) => p.marker?._color);
  const availableColor =
    markerColors.find((color) => !usedColors.includes(color)) ??
    markerColors[0];
  return availableColor;
};

/**
 * The `createGeoJSONCircle` function creates a GeoJSON object representing a circle with the given center and radius.
 *
 * @param {LngLat} center - The center coordinates of the circle.
 * @param {number} radius - The radius of the circle in kilometers.
 * @param {number} [points=64] - The number of points to use for the circle.
 *
 * @example
 * const geoJSONCircle = createGeoJSONCircle(new LngLat(-77.0365, 38.8977), 1);
 *
 * @returns {GeoJSONSourceSpecification} The GeoJSON object representing the circle.
 */
export const createGeoJSONCircle = function (
  center: LngLat,
  radius: number,
  points?: number
) {
  if (!points) points = 64;
  const ret = [];
  const distanceX = radius / (111.32 * Math.cos((center.lat * Math.PI) / 180));
  const distanceY = radius / 110.574;

  let theta, x, y;
  for (let i = 0; i < points; i++) {
    theta = (i / points) * (2 * Math.PI);
    x = distanceX * Math.cos(theta);
    y = distanceY * Math.sin(theta);

    ret.push([center.lng + x, center.lat + y]);
  }
  ret.push(ret[0]);

  return {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [ret],
          },
        },
      ],
    },
  } as GeoJSONSourceSpecification;
};
