import { Map, Marker } from "mapbox-gl";
import TransportationTypes from "@/app/types/transportationTypes";
import Address from "@/app/models/Address";
class Person {
  id: string;
  address: Address;
  marker?: Marker;
  weight: number;
  modeOfTransportation;

  constructor(address: Address) {
    this.id = Math.random().toString(36).substring(2, 11);
    this.address = address;
    this.weight = 1;
    this.modeOfTransportation = TransportationTypes.Car;
  }

  clearRoute(map: Map) {
    const routeId = this.id + "-route";
    const pointId = this.id + "-point";
    if (map.getSource(routeId)) {
      map.removeLayer(routeId);
      map.removeSource(routeId);
    }
    if (map.getSource(pointId)) {
      map.removeLayer(pointId);
      map.removeSource(pointId);
    }
  }
}

export default Person;
