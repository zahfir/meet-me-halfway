import { SearchBoxRetrieveResponse } from "@mapbox/search-js-core";
import { Marker } from "mapbox-gl";
// TODO: Add weight property to Person
class Person {
  address: SearchBoxRetrieveResponse;
  marker: Marker | null = null;

  constructor(address: SearchBoxRetrieveResponse) {
    this.address = address;
  }
}

export default Person;
