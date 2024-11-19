import { GeoJSONSource, LngLat, Marker } from "mapbox-gl";
import { PlaceCategory } from "@/app/constants/overpass/overpassPlaceCategories";
import useMapStore from "@/app/state/useMapStore";
import { createGeoJSONCircle } from "@/app/utils/mapUtils";
import POI from "./POI";

/**
 * The `MeetingArea` class represents a meeting area on the map with a centroid, marker, radius, place categories, and points of interest (POIs).
 * It provides methods to draw and update a circle on the map.
 *
 * @class
 * @param {LngLat} centroid - The coordinates of the centroid of the meeting area.
 * @param {Marker} marker - The marker representing the meeting area on the map.
 *
 * @property {LngLat} centroid - The coordinates of the centroid of the meeting area.
 * @property {Marker} marker - The marker representing the meeting area on the map.
 * @property {number} radius - The radius of the meeting area circle.
 * @property {Set<PlaceCategory>} placeCategories - A set of place categories associated with the meeting area.
 * @property {POI[]} POIs - An array of points of interest within the meeting area.
 * @property {boolean} isOverpassLoading - A boolean indicating whether the Overpass API is loading data.
 * @property {string} #circleMapId - The ID of the circle layer on the map.
 * @property {number} #circleOpacity - The opacity of the circle layer on the map.
 * @property {string} #circleColor - The color of the circle layer on the map.
 *
 * @example
 * const centroid = new LngLat(-77.0365, 38.8977);
 * const marker = new Marker().setLngLat(centroid);
 * const meetingArea = new MeetingArea(centroid, marker);
 * meetingArea.initCircle();
 */
class MeetingArea {
  centroid: LngLat;
  marker: Marker;
  radius: number = 1;
  placeCategories: Set<PlaceCategory> = new Set();
  POIs: POI[] = [];
  isOverpassLoading: boolean = false;

  readonly #circleMapId: string = "meeting-area-circle";
  readonly #circleOpacity: number = 0.2;
  readonly #circleColor: string = "#0ad692";

  constructor(centroid: LngLat, marker: Marker) {
    this.centroid = centroid;
    this.marker = marker;
    this.placeCategories.add(PlaceCategory.restaurant);
  }

  initCircle() {
    const mapRef = useMapStore.getState().mapRef;
    console.log("setting listener");
    mapRef.current?.on("load", () => {
      console.log("loaded");

      mapRef.current?.addSource(
        this.#circleMapId,
        createGeoJSONCircle(this.centroid, this.radius)
      );

      mapRef.current?.addLayer({
        id: this.#circleMapId,
        type: "fill",
        source: this.#circleMapId,
        layout: {},
        paint: {
          "fill-color": this.#circleColor,
          "fill-opacity": this.#circleOpacity,
        },
      });
    });
  }

  updateCircle(show: boolean = true) {
    const { mapRef } = useMapStore.getState();

    const layer = mapRef.current?.getLayer(this.#circleMapId);
    const opacity: number = show ? this.#circleOpacity : 0;
    if (layer)
      mapRef.current?.setPaintProperty(
        this.#circleMapId,
        "fill-opacity",
        opacity
      );

    const source = mapRef.current?.getSource(
      this.#circleMapId
    ) as GeoJSONSource;

    const newCircle = createGeoJSONCircle(this.centroid, this.radius)
      .data as GeoJSON.GeoJSON;
    source?.setData(newCircle);
  }
}

export default MeetingArea;
