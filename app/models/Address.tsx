import { LngLat } from "mapbox-gl";
import { NominatimResult } from "@/app/types/nominatimResponse";

/**
 * The `Address` class represents an address with its display name, coordinates, and formatted address lines.
 * It is constructed from a NominatimResult object.
 *
 * @class
 * @param {NominatimResult} nominatimResult - The result object from the Nominatim API containing address details.
 *
 * @property {string} display_name - The full display name of the address.
 * @property {LngLat} coord - The coordinates of the address.
 * @property {string} [formattedAddressLineOne] - The formatted first line of the address.
 * @property {string} [formattedAddressLineTwo] - The formatted second line of the address.
 *
 * @example
 * const nominatimResult = {
 *   display_name: "1600 Pennsylvania Avenue NW, Washington, DC 20500, USA",
 *   lon: "-77.0365",
 *   lat: "38.8977",
 *   address: {
 *     house_number: "1600",
 *     road: "Pennsylvania Avenue NW",
 *     city: "Washington",
 *     state: "DC",
 *     postcode: "20500",
 *     country: "USA"
 *   }
 * };
 * const address = new Address(nominatimResult);
 */
class Address {
  display_name: string;
  coord: LngLat;
  formattedAddressLineOne?: string;
  formattedAddressLineTwo?: string;

  constructor(nominatimResult: NominatimResult) {
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
    if (!nominatimResult?.address) return "";

    const { house_number, road } = nominatimResult.address;
    return [house_number ?? "", road ?? ""].filter(Boolean).join(" ").trim();
  };

  /**
   *
   * @param nominatimResult
   * @returns Formatted address (possibly empty string)
   */
  extractAddressLineTwo = (nominatimResult: NominatimResult): string => {
    if (!nominatimResult?.address) return "";

    const { city, state, postcode, country } = nominatimResult.address;
    const tmp = [city ?? "", state ?? "", postcode ?? "", country ?? ""]
      .filter(Boolean)
      .join(", ")
      .trim();
    return tmp;
  };
}
export default Address;
