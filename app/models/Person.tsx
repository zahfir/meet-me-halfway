import { Map, Marker } from "mapbox-gl";
import TransportationTypes from "@/app/types/transportationTypes";
import Address from "@/app/models/Address";
import { RouteResponseType } from "@/app/types/openRouteServiceResponse";

/**
 * The `Person` class represents a person with an address, transportation mode, and route information.
 * It provides methods to manage the person's route on a Mapbox map.
 *
 * @class
 * @param {Address} address - The address associated with the person.
 *
 * @property {string} id - The unique identifier for the person.
 * @property {Address} address - The address associated with the person.
 * @property {Marker} [marker] - The marker representing the person's location on the map.
 * @property {number} weight - The weight associated with the person.
 * @property {TransportationTypes} modeOfTransportation - The mode of transportation for the person.
 * @property {string} routeId - The unique identifier for the person's route.
 * @property {RouteResponseType} [routeData] - The route data for the person's route.
 * @property {number} [routeDuration] - The duration of the route in minutes.
 * @property {number} [routeDistance] - The distance of the route in kilometers.
 *
 * @example
 * const address = new Address(nominatimResult);
 * const person = new Person(address);
 * person.setRouteOpacity(map, 0.5);
 * person.addRouteToMap(map);
 */
class Person {
  id: string;
  address: Address;
  marker?: Marker;
  weight: number;
  modeOfTransportation;
  routeId: string;
  routeData?: RouteResponseType;
  routeDuration?: number; // in minutes
  routeDistance?: number; // in kilometers

  constructor(address: Address) {
    this.id = Math.random().toString(36).substring(2, 11);
    this.address = address;
    this.weight = 1;
    this.modeOfTransportation = TransportationTypes.Car;
    this.routeId = this.id + "-route";
  }

  /**
   * Sets the opacity of the route on the map.
   *
   * @param {Map} map - The Mapbox map instance.
   * @param {number} opacity - The opacity value to set for the route.
   */
  setRouteOpacity = (map: Map, opacity: number) => {
    if (map.getLayer(this.routeId)) {
      map.setPaintProperty(this.routeId, "line-opacity", opacity);
    }
  };

  /**
   * Adds the route to the map as a source and a layer.
   *
   * @param {Map} map - The Mapbox map instance.
   */
  addRouteToMap = (map: Map) => {
    if (!this.routeData) return;

    const routeColor = this.marker!._color;
    const coordinates = this.routeData.features[0].geometry.coordinates;

    map.addSource(this.routeId, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: coordinates,
        },
      },
    });

    map.addLayer({
      id: this.routeId,
      type: "line",
      source: this.routeId,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": routeColor,
        "line-width": 4,
      },
    });
  };

  /**
   * Removes the route from the map.
   *
   * @param {Map} map - The Mapbox map instance.
   */
  clearRouteFromMap(map: Map) {
    if (map.getSource(this.routeId)) {
      map.removeLayer(this.routeId);
      map.removeSource(this.routeId);
    }
  }

  /**
   * Retrieves the route summary including distance and duration from the route data.
   *
   * @returns {{ distance: number | undefined, duration: number | undefined }}
   *          An object containing the distance in kilometers and duration in minutes,
   *          or undefined if the route data is not available or incomplete.
   */
  getRouteSummary(): {
    distance: number | undefined;
    duration: number | undefined;
  } {
    if (this.routeDistance && this.routeDuration)
      return { distance: this.routeDistance, duration: this.routeDuration };

    const summary = this.routeData?.features?.[0].properties?.summary;
    if (!summary) return { distance: undefined, duration: undefined };

    const meters = summary.distance;
    const seconds = summary.duration;

    const km = meters ? Math.round(meters / 1000) : undefined;
    const minutes = seconds ? Math.round(seconds / 60) : undefined;

    this.routeDistance = km;
    this.routeDuration = minutes;

    return { distance: km, duration: minutes };
  }
}

export default Person;
