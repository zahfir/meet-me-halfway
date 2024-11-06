import { GeoJSONSource, Map, Marker } from "mapbox-gl";
import TransportationTypes from "@/app/types/transportationTypes";
import Address from "@/app/models/Address";
import { RouteResponseType } from "@/app/types/openRouteServiceResponse";
class Person {
  id: string;
  address: Address;
  marker?: Marker;
  weight: number;
  modeOfTransportation;
  routeData?: RouteResponseType;
  routeDuration?: number; // in minutes
  routeDistance?: number; // in kilometers

  constructor(address: Address) {
    this.id = Math.random().toString(36).substring(2, 11);
    this.address = address;
    this.weight = 1;
    this.modeOfTransportation = TransportationTypes.Car;
  }

  // ROUTE METHODS

  addRouteToMap = (map: Map) => {
    if (!this.routeData) return;

    const coordinates = this.routeData.features[0].geometry.coordinates;
    const routeId = this.id + "-route";
    const pointId = this.id + "-point";
    const color = this.marker!._color;

    map.addSource(routeId, {
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
      id: routeId,
      type: "line",
      source: routeId,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": color,
        "line-width": 4,
      },
    });

    map.addSource(pointId, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: coordinates[0],
        },
      },
    });

    map.addLayer({
      id: pointId,
      type: "circle",
      source: pointId,
      paint: {
        "circle-radius": 8,
        "circle-color": color,
        "circle-blur": 1,
      },
    });
  };

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

  getRouteDistance(): number | undefined {
    return this.initializeRouteDistance();
  }

  initializeRouteDistance(): number | undefined {
    const meters = this.routeData?.features[0].properties?.summary.distance;
    if (!meters) return;

    const km = Math.round(meters / 1000);

    this.routeDistance = km;
    return km;
  }

  getRouteDuration(): number | undefined {
    const duration = this.initializeRouteDuration();
    return duration;
  }

  initializeRouteDuration(): number | undefined {
    const seconds = this.routeData?.features[0].properties?.summary.duration;
    if (!seconds) return;

    const minutes = Math.round(seconds / 60);

    this.routeDuration = minutes;
    return minutes;
  }

  // Function to animate a point along a route using a simple for-loop over coordinates
  // In the future, scrap this and redraw route
  animatePointAlongRoute = (map: Map) => {
    if (!map) {
      console.error("Map not found while animating point.");
      return;
    }

    // Verify Route and Point Exists
    const routeId = this.id + "-route";
    const pointId = this.id + "-point";
    const routeSource = map.getSource(routeId) as GeoJSONSource;
    if (!routeSource) {
      console.debug(`Source with ID '${routeId}' not found.`);
      return;
    }
    const pointSource = map.getSource(pointId) as GeoJSONSource;
    const pointLayer = map.getLayer(pointId);
    if (!pointSource || !pointLayer) {
      console.debug(`Point with ID '${pointId}' not found.`);
      return;
    }

    // Extract path or "keyframes"
    const routeData = routeSource._data as GeoJSON.Feature;
    if (!routeData || routeData.geometry.type !== "LineString") {
      console.debug(`Invalid route data or geometry type for '${routeId}'.`);
      return;
    }

    const lineString = routeData.geometry;
    const coordinates = lineString.coordinates; // Get the array of coordinates

    let animationCounter = 0;
    const noOfSteps = coordinates.length;

    function createPointFeature(
      coord: any
    ): GeoJSON.FeatureCollection<GeoJSON.Geometry> {
      return {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: coord,
            },
          },
        ],
      };
    }

    const animate = () => {
      if (animationCounter < noOfSteps) {
        const currentCoordinate = coordinates[animationCounter];

        const pointFeatureData = createPointFeature(currentCoordinate);

        pointSource.setData(pointFeatureData);

        animationCounter++;

        requestAnimationFrame(animate);
      } else {
        // Hide dot on completion
        const pointLayer = map.getLayer(pointId);
        if (!pointSource || !pointLayer) {
          console.debug(`Point with ID '${pointId}' not found.`);
          return;
        }
        map.setPaintProperty(pointId, "circle-opacity", 0);
      }
    };

    // Start the animation
    map.setPaintProperty(pointId, "circle-opacity", 1);
    requestAnimationFrame(animate);
  };
}

export default Person;
