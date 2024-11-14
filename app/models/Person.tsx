import { Map, Marker } from "mapbox-gl";
import TransportationTypes from "@/app/types/transportationTypes";
import Address from "@/app/models/Address";
import { RouteResponseType } from "@/app/types/openRouteServiceResponse";
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

  // ROUTE METHODS
  setRouteOpacity = (map: Map, opacity: number) => {
    if (map.getLayer(this.routeId)) {
      map.setPaintProperty(this.routeId, "line-opacity", opacity);
    }
  };

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

  clearRouteFromMap(map: Map) {
    if (map.getSource(this.routeId)) {
      map.removeLayer(this.routeId);
      map.removeSource(this.routeId);
    }
  }

  getRouteDistance(): number | undefined {
    const meters = this.routeData?.features[0].properties?.summary.distance;
    if (!meters) return;

    const km = Math.round(meters / 1000);

    this.routeDistance = km;
    return km;
  }

  getRouteDuration(): number | undefined {
    const seconds = this.routeData?.features[0].properties?.summary.duration;
    if (!seconds) return;

    const minutes = Math.round(seconds / 60);

    this.routeDuration = minutes;
    return minutes;
  }
}

export default Person;
