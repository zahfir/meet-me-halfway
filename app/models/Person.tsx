import { SearchBoxRetrieveResponse } from "@mapbox/search-js-core";
import { Marker } from "mapbox-gl";
class Person {
  address: SearchBoxRetrieveResponse;
  marker?: Marker;
  weight: number;

  constructor(address: SearchBoxRetrieveResponse) {
    this.address = address;
    this.weight = Math.floor(Math.random() * 100) + 1;
    console.log(address, "weight of", this.weight);
  }
}

export default Person;
