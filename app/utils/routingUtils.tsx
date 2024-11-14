import { LngLat, Map } from "mapbox-gl";
import Person from "@/app/models/Person";

export const setRouteOpacityOnHover = (
  isHover: boolean,
  setIsHover: (hover: boolean) => void,
  mapRef: React.RefObject<Map | null>,
  people: Person[],
  currentPersonId: string,
  enter: boolean
) => {
  if (enter && isHover) return;

  const map = mapRef.current;
  if (!map) {
    console.error("Map not found while highlighting route.");
    return;
  }

  setIsHover(enter);

  const opacity = enter ? 0.1 : 1;
  people.forEach((person) => {
    if (person.id !== currentPersonId) person.setRouteOpacity(map, opacity);
  });
};

// MOVE THIS TO 3RD PARTY API FOLDER
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
