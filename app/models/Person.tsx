import { SearchBoxRetrieveResponse } from "@mapbox/search-js-core";
import { Marker } from "mapbox-gl";
import TransportationTypes from "@/app/constants/transportationTypes";
class Person {
  id: string;
  address: SearchBoxRetrieveResponse;
  marker?: Marker;
  weight: number;
  modeOfTransportation;

  constructor(address: SearchBoxRetrieveResponse) {
    this.id = Math.random().toString(36).substring(2, 11);
    this.address = address;
    this.weight = 1;
    this.modeOfTransportation = TransportationTypes.Car;
  }
}

export default Person;
