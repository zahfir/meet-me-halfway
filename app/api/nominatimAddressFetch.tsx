import { LngLat } from "mapbox-gl";
import useMapStore from "../state/useMapStore";

/**
 *
 * @param query {String} search query
 * @returns {Promise<Response>}
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

const getViewbox = () => {
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
