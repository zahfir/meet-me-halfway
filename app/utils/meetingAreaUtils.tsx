import Person from "@/app/models/Person";
import { getAddressCoords } from "@/app/utils/mapUtils";
import { LngLat } from "mapbox-gl";

export const calculateCentroid = (people: Person[]): LngLat => {
  if (people.length === 0) {
    throw new Error("No people provided to calculate the centroid.");
  }

  let totalLat = 0;
  let totalLng = 0;
  let totalWeight = 0;

  people.forEach((person) => {
    const { lat, lng } = getAddressCoords(person.address);
    totalLat += lat * person.weight;
    totalLng += lng * person.weight;
    totalWeight += person.weight;
  });

  // Calculate the weighted centroid
  const centroidLat = totalLat / totalWeight;
  const centroidLng = totalLng / totalWeight;

  return new LngLat(centroidLng, centroidLat);
};
