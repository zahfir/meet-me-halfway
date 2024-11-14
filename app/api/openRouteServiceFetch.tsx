import { LngLat } from "mapbox-gl";

/**
 * Fetches a route from the OpenRouteService API based on the provided start and end coordinates.
 *
 * @param {LngLat} start - The starting coordinate.
 * @param {LngLat} end - The ending coordinate.
 * @returns {Promise<GeoJSON.FeatureCollection<GeoJSON.LineString> | undefined>}
 *          A promise that resolves to a GeoJSON FeatureCollection representing the route,
 *          or undefined if an error occurs.
 */
export const fetchRoute = async (
  start: LngLat,
  end: LngLat
): Promise<GeoJSON.FeatureCollection<GeoJSON.LineString> | undefined> => {
  const apiKey = "5b3ce3597851110001cf6248e37a497dc65c4b1d869c7c8b512a3e97";
  const baseUrl = "https://api.openrouteservice.org/v2/directions/driving-car";
  const url = `${baseUrl}?api_key=${apiKey}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching route: ${response.statusText}`);
    }
    const data: GeoJSON.FeatureCollection<GeoJSON.LineString> =
      await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
