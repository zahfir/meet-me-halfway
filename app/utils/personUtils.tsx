import { LngLat } from "mapbox-gl";
import Address from "../models/Address";
import Person from "../models/Person";
import { InvalidAddressError } from "../validation/Address/AddressErrors";
import { NominatimResult } from "@/app/components/AddressSearch";

/**
 *
 * @param oldWeight
 * @param dx
 * @returns The new weight given how much the mouse has moved in the x-axis
 */
export const computeNewWeight = (oldWeight: number, dx: number) => {
  const sensitivity = 5;
  return Math.max(1, Math.min(100, oldWeight + dx / sensitivity));
};

export const createPerson = (searchSelection: NominatimResult) => {
  if (!searchSelection) return;
  try {
    const address = new Address(
      searchSelection.display_name,
      new LngLat(
        parseFloat(searchSelection.lon),
        parseFloat(searchSelection.lat)
      )
    );
    return new Person(address);
  } catch (error) {
    if (error instanceof InvalidAddressError) {
      console.error("Custom error caught:", error.message);
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
};
