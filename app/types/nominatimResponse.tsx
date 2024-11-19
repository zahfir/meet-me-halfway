/**
 * The `NominatimResult` interface represents the result returned by the Nominatim API for an address search.
 *
 * @interface NominatimResult
 * @property {string} display_name - The full display name of the address.
 * @property {NominatimAddress} address - The detailed address information.
 * @property {string} lat - The latitude of the address.
 * @property {string} lon - The longitude of the address.
 */
export interface NominatimResult {
  display_name: string;
  address: NominatimAddress;
  lat: string;
  lon: string;
}

/**
 * The `NominatimAddress` interface represents the address details returned by the Nominatim API.
 *
 * @interface NominatimAddress
 * @property {string} house_number - The house number of the address.
 * @property {string} road - The road or street name of the address.
 * @property {string} city - The city of the address.
 * @property {string} state - The state or region of the address.
 * @property {string} country - The country of the address.
 * @property {string} postcode - The postal code of the address.
 */
interface NominatimAddress {
  house_number: string;
  road: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
}
