import Person from "@/app/models/Person";
import { LngLat } from "mapbox-gl";

/**
 * The `calculateCentroid` function calculates the weighted centroid of a given array of people.
 * Each person's weight is taken into account to determine the centroid.
 *
 * @param {Person[]} people - An array of people to calculate the centroid for.
 * @throws {Error} Throws an error if no people are provided.
 *
 * @example
 * const people = [
 *   new Person(new Address({ lat: "38.8977", lon: "-77.0365" })),
 *   new Person(new Address({ lat: "38.8978", lon: "-77.0366" })),
 * ];
 * const centroid = calculateCentroid(people);
 *
 * @returns {LngLat} The calculated weighted centroid.
 */
export const calculateCentroid = (people: Person[]): LngLat => {
  if (people.length === 0) {
    throw new Error("No people provided to calculate the centroid.");
  }

  let totalLat = 0;
  let totalLng = 0;
  let totalWeight = 0;

  people.forEach((person) => {
    const { lat, lng } = person.address.coord;
    totalLat += lat * person.weight;
    totalLng += lng * person.weight;
    totalWeight += person.weight;
  });

  // Calculate the weighted centroid
  const centroidLat = totalLat / totalWeight;
  const centroidLng = totalLng / totalWeight;

  return new LngLat(centroidLng, centroidLat);
};
