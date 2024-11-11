import { GeoJSONSource, LngLat, Marker } from "mapbox-gl";
import { PlaceCategory } from "@/app/constants/overpass/overpassPlaceCategories";
import useMapStore from "../state/useMapStore";
import { createGeoJSONCircle } from "../utils/mapUtils";
import POI from "./POI";
class MeetingArea {
  centroid: LngLat;
  marker: Marker;
  radius: number = 1;
  placeCategories: Set<PlaceCategory> = new Set();
  POIs: POI[] = [];
  isOverpassLoading: boolean = false;

  readonly #circleMapId: string = "meeting-area-circle";
  readonly #circleOpacity: number = 0.2;

  constructor(centroid: LngLat, marker: Marker) {
    this.centroid = centroid;
    this.marker = marker;
    this.placeCategories.add(PlaceCategory.shopping);
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
          "fill-color": "#088",
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
