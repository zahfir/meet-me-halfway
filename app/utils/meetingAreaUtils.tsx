import Person from "@/app/models/Person";
import { getAddressCoords } from "@/app/utils/mapUtils";
import { LngLat } from "mapbox-gl";

// Input list 'people' must be non-empty
// TODO: adjust for weight attribute which needs to go o neach person
export const calculateCentroid = (people: Person[]): LngLat => {
  let totalLat = 0;
  let totalLng = 0;

  people.forEach((person) => {
    const { lat, lng } = getAddressCoords(person.address);
    totalLat += lat;
    totalLng += lng;
  });
  return new LngLat(totalLng / people.length, totalLat / people.length);
};
