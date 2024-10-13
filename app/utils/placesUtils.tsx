import useMapStore from "../state/useMapStore";
import { MAPBOX_ACCESS_TOKEN } from "@/app/page";

export async function getPOIs() {
  if (!useMapStore.getState().meetingArea) return [];

  const { lat, lng } = useMapStore.getState().meetingArea!.centroid;
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/poi.json?proximity=${lng},${lat}&types=poi&access_token=${MAPBOX_ACCESS_TOKEN}`
  );
  const data = await response.json();
  return data.features; // This will return an array of POIs
}
