import { GeoJSONSource, LngLat, Marker } from "mapbox-gl";
import { PlaceCategory } from "@/app/constants/overpassPlaceCategories";
import useMapStore from "../state/useMapStore";
import { createGeoJSONCircle } from "../utils/mapUtils";
class MeetingArea {
  centroid: LngLat;
  marker: Marker;
  radius: number = 1;
  placeCategories: Set<PlaceCategory> = new Set();

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
        "meeting-area-circle",
        createGeoJSONCircle(this.centroid, this.radius)
      );

      mapRef.current?.addLayer({
        id: "meeting-area-circle",
        type: "fill",
        source: "meeting-area-circle",
        layout: {},
        paint: {
          "fill-color": "#088",
          "fill-opacity": 0.2,
        },
      });
    });
  }

  updateCircle() {
    const mapRef = useMapStore.getState().mapRef;
    const source = mapRef.current?.getSource(
      "meeting-area-circle"
    ) as GeoJSONSource;

    const newCircle = createGeoJSONCircle(this.centroid, this.radius)
      .data as GeoJSON.GeoJSON;
    source?.setData(newCircle);
  }
}

export default MeetingArea;
