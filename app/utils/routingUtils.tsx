import { GeoJSONSource, LngLat, Map } from "mapbox-gl";
import useMapStore from "../state/useMapStore";

/**
 *
 * @param start Starting coordinate
 * @param end Ending coordinate
 * @returns GeoJSON object with route data
 */
export const fetchRoute = async (start: LngLat, end: LngLat) => {
  const apiKey = "5b3ce3597851110001cf6248e37a497dc65c4b1d869c7c8b512a3e97";
  const baseUrl = "https://api.openrouteservice.org/v2/directions/driving-car";
  const url = `${baseUrl}?api_key=${apiKey}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching route: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching route:", error);
    throw error;
  }
};

export const addRouteToMap = (
  id: string,
  map: Map,
  coordinates: any,
  color: string
) => {
  const routeId = id + "-route";
  const pointId = id + "-point";

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

// Function to animate a point along a route using a simple for-loop over coordinates
export const animatePointAlongRoute = (personId: string) => {
  const routeId = personId + "-route";
  const map = useMapStore.getState().mapRef.current;
  if (!map) {
    console.error("Map not found while animating point.");
    return;
  }

  // Check if the source with the given routeId exists
  const source = map.getSource(routeId) as GeoJSONSource;
  if (!source) {
    console.error(`Source with ID '${routeId}' not found.`);
    return;
  }

  // Extract the geometry coordinates from the source
  const routeData = source._data as GeoJSON.Feature;
  if (!routeData || routeData.geometry.type !== "LineString") {
    console.error(`Invalid route data or geometry type for '${routeId}'.`);
    return;
  }

  const lineString = routeData.geometry;
  const coordinates = lineString.coordinates; // Get the array of coordinates

  // Assuming the point source and layer exist on the map already
  const pointId = personId + "-point";
  const pointSource = map.getSource(pointId) as GeoJSONSource;

  if (!pointSource) {
    console.error(`Point source with ID '${pointId}' not found.`);
    return;
  }

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
      map.setPaintProperty(pointId, "circle-opacity", 0);
    }
  };

  // Start the animation
  map.setPaintProperty(pointId, "circle-opacity", 1);
  requestAnimationFrame(animate);
};
