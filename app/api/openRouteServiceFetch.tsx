import { LngLat } from "mapbox-gl";

/**
 *
 * @param start Starting coordinate
 * @param end Ending coordinate
 * @returns GeoJSON object that represents a route from start to end
 */
export const fetchRoute = async (
  start: LngLat,
  end: LngLat
): Promise<GeoJSON.FeatureCollection<GeoJSON.LineString>> => {
  const apiKey = "5b3ce3597851110001cf6248e37a497dc65c4b1d869c7c8b512a3e97";
  const baseUrl = "https://api.openrouteservice.org/v2/directions/driving-car";
  const url = `${baseUrl}?api_key=${apiKey}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      // TODO - Handle error by displaying a message to the user in person list item
      throw new Error(`Error fetching route: ${response.statusText}`);
    }
    const data: GeoJSON.FeatureCollection<GeoJSON.LineString> =
      await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching route:", error);
    throw error;
  }
};
