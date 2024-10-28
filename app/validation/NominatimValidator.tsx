import { NominatimResult } from "@/app/types/nominatimResponse";
import { InvalidAddressError } from "@/app/validation/Address/AddressErrors";

export const validateNominatimResult = (nominatimResult: NominatimResult) => {
  const { display_name, lon, lat } = nominatimResult;
  if (!display_name) {
    throw new InvalidAddressError(
      "The 'name' parameter is required and cannot be undefined."
    );
  }
  if (!lat || !lon) {
    throw new InvalidAddressError(
      "Missing coordinate data in Address instantiation."
    );
  }
};
