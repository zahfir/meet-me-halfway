import { LngLat } from "mapbox-gl";

export const fetchRouteClient = async (start: LngLat, end: LngLat) => {
  try {
    const response = await fetch("/api/ors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ start, end }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch route");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching route from API route:", error);
  }
};
