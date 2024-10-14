import { LngLat } from "mapbox-gl";
import { validateAddressParams } from "@/app/validation/Address/AddressValidator";

class Address {
  name: string;
  coord: LngLat;

  constructor(name: string, coord: LngLat) {
    validateAddressParams(name, coord);

    this.name = name;
    this.coord = coord;
  }
}
export default Address;
