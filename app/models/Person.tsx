import { Map, Marker } from "mapbox-gl";
import TransportationTypes from "@/app/types/transportationTypes";
import Address from "@/app/models/Address";
class Person {
  id: string;
  address: Address;
  marker?: Marker;
  weight: number;
  modeOfTransportation;
  routeId?: string;

  constructor(address: Address) {
    this.id = Math.random().toString(36).substring(2, 11);
    this.address = address;
    this.weight = 1;
    this.modeOfTransportation = TransportationTypes.Car;
  }

  clearRoute(map: Map) {
    if (this.routeId) {
      map.removeLayer(this.routeId);
      map.removeSource(this.routeId);
      this.routeId = undefined;
    }
  }
}

export default Person;
