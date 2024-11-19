import { LngLat } from "mapbox-gl";
import useMapStore from "@/app/state/useMapStore";

/**
 * Fetches address suggestions from the Nominatim API based on the search query.
 *
 * @param {string} query - The search query.
 * @returns {Promise<Response>} A promise that resolves to the response from the Nominatim API.
 */
export const fetchAddressSuggestions = async (
  query: string
): Promise<Response> => {
  const format = "json";
  const proximitySearchFilter = getViewbox();
  const filters = `addressdetails=1&limit=5${proximitySearchFilter}`;

  const url = `https://nominatim.openstreetmap.org/search?format=${format}&q=${query}&${filters}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch address suggestions: ${response.statusText}`
    );
  }
  return response;
};

/**
 * Generates a viewbox parameter for the Nominatim API based on the current map state.
 * The viewbox is a bounding box around the centroid of the meeting area or the user's location.
 *
 * @returns {string} The viewbox parameter in the format "&viewbox=sw.lng,sw.lat,ne.lng,ne.lat".
 *                   Returns an empty string if the centroid is not available.
 */
const getViewbox = (): string => {
  const state = useMapStore.getState();
  const centroid: LngLat | null =
    state.meetingArea?.centroid ?? state.userLocation;
  if (!centroid) return "";

  const boxSize = 1.8;

  const sw = {
    lat: centroid.lat - boxSize,
    lng: centroid.lng - boxSize,
  };

  const ne = {
    lat: centroid.lat + boxSize,
    lng: centroid.lng + boxSize,
  };
  return `&viewbox=${sw.lng},${sw.lat},${ne.lng},${ne.lat}`;
};
