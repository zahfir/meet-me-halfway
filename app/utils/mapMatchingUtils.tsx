import { LngLat } from "mapbox-gl";
import { MAPBOX_ACCESS_TOKEN } from "@/app/page";

export async function fetchMatchingRoute(
  coordinates: LngLat[],
  profile = "driving"
) {
  // Convert radius array to a semicolon-separated string
  const radiuses = coordinates.map(() => 25).join(";");
  const formattedCoordinates = formatCoordinates(coordinates);

  // Construct the API request URL
  const url = `https://api.mapbox.com/matching/v5/mapbox/${profile}/${formattedCoordinates}?geometries=geojson&radiuses=${radiuses}&steps=true&access_token=${MAPBOX_ACCESS_TOKEN}`;

  try {
    // Make the API call to the Map Matching API
    const response = await fetch(url, { method: "GET" });

    // Parse the response as JSON
    const data = await response.json();

    // Check for errors in the response
    if (data.code !== "Ok") {
      throw new Error(`${data.code} - ${data.message}`);
    }

    // Process the matched route
    const matchedRoute = data.matchings[0].geometry.coordinates;

    // Log the matched route to the console (or you can use it in your app)
    console.log("Matched Route:", matchedRoute);

    // Return the matched route for further processing
    return matchedRoute;
  } catch (error: Error | unknown) {
    if (error instanceof Error) {
      console.error("Error fetching matched route:", error);
      alert(error?.message);
    }
  }
}

const formatCoordinates = (coordinates: LngLat[]) => {
  return coordinates.map((coord) => `${coord.lng},${coord.lat}`).join(";");
};
