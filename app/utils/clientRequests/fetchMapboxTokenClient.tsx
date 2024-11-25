/**
 * Fetches the Mapbox access token from the server.
 * This function makes a request to the server to retrieve the Mapbox access token,
 * which is required for initializing and using Mapbox services.
 *
 * @returns {Promise<string | null>} A promise that resolves to the Mapbox access token as a string.
 *
 * @throws {Error} Throws an error if the fetch request fails or if the token is not available.
 *
 * @example
 * fetchMapboxTokenClient()
 *   .then((token) => {
 *     console.log("Mapbox access token:", token);
 *   })
 *   .catch((error) => {
 *     console.error("Error fetching Mapbox access token:", error);
 *   });
 */
export const fetchMapboxTokenClient = async (): Promise<string | null> => {
  try {
    const response = await fetch("/api/mapboxToken");
    if (!response.ok) {
      throw new Error("Failed to fetch Mapbox token");
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Error fetching Mapbox token:", error);
    return null;
  }
};
