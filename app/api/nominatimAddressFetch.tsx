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
  const coord = useMapStore.getState().userLocation;
  const proximitySearchFilter = coord
    ? `&lat=${coord.lat}&lon=${coord.lng}`
    : "";
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
