import { GeoJSONSource, LngLat } from "mapbox-gl";
import useMapStore from "@/app/state/useMapStore";

/**
 *
 * @param start Starting coordinate
 * @param end Ending coordinate
 * @returns GeoJSON "route" from start to end
 */
export const fetchRoute = async (
  start: LngLat,
  end: LngLat
): Promise<GeoJSON.FeatureCollection<GeoJSON.LineString>> => {
  const apiKey = "5b3ce3597851110001cf6248e37a497dc65c4b1d869c7c8b512a3e97";
  const baseUrl = "https://api.openrouteservice.org/v2/directions/driving-car";
  const url = `${baseUrl}?api_key=${apiKey}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching route: ${response.statusText}`);
    }
    const data: GeoJSON.FeatureCollection<GeoJSON.LineString> =
      await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching route:", error);
    throw error;
  }
};

// Function to animate a point along a route using a simple for-loop over coordinates
export const animatePointAlongRoute = (personId: string) => {
  const map = useMapStore.getState().mapRef.current;
  if (!map) {
    console.error("Map not found while animating point.");
    return;
  }

  // Verify Route and Point Exists
  const routeId = personId + "-route";
  const pointId = personId + "-point";
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
