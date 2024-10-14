import { InvalidAddressError } from "@/app/validation/Address/AddressErrors";
import { LngLat } from "mapbox-gl";

export const validateAddressParams = (name: string, coord: LngLat) => {
  if (!name) {
    throw new InvalidAddressError(
      "The 'name' parameter is required and cannot be undefined."
    );
  }
  if (!coord) {
    throw new InvalidAddressError(
      "The 'coord' parameter is required and cannot be undefined."
    );
  }
};
