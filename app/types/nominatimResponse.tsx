export interface NominatimResult {
  display_name: string;
  address: NominatimAddress;
  lat: string;
  lon: string;
}

interface NominatimAddress {
  house_number: string;
  road: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
}
