import { LngLat } from "mapbox-gl";
import { validateNominatimResult } from "@/app/validation/NominatimValidator";
import { NominatimResult } from "../types/nominatimResponse";

class Address {
  display_name: string;
  coord: LngLat;
  formattedAddressLineOne?: string;
  formattedAddressLineTwo?: string;

  constructor(nominatimResult: NominatimResult) {
    validateNominatimResult(nominatimResult);
    this.display_name = nominatimResult.display_name;
    this.coord = new LngLat(
      parseFloat(nominatimResult.lon),
      parseFloat(nominatimResult.lat)
    );

    this.formattedAddressLineOne = this.extractAddressLineOne(nominatimResult);
    this.formattedAddressLineTwo = this.extractAddressLineTwo(nominatimResult);
  }

  /**
   *
   * @param nominatimResult
   * @returns Formatted address (possibly empty string)
   */
  extractAddressLineOne = (nominatimResult: NominatimResult): string => {
    if (!nominatimResult || !nominatimResult.address) return "";

    const { house_number, road } = nominatimResult.address;
    return [house_number ?? "", road ?? ""].filter(Boolean).join(" ").trim();
  };

  /**
   *
   * @param nominatimResult
   * @returns Formatted address (possibly empty string)
   */
  extractAddressLineTwo = (nominatimResult: NominatimResult): string => {
    if (!nominatimResult || !nominatimResult.address) return "";

    const { city, state, postcode, country } = nominatimResult.address;
    const tmp = [city ?? "", state ?? "", postcode ?? "", country ?? ""]
      .filter(Boolean)
      .join(", ")
      .trim();
    return tmp;
  };
}
export default Address;
