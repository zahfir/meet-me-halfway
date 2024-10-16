import { LngLat, Marker } from "mapbox-gl";
import { PlaceCategory } from "@/app/constants/overpassPlaceCategories";
class MeetingArea {
  centroid: LngLat;
  marker: Marker;
  radius: number = 5;
  placeCategories: Set<PlaceCategory> = new Set();

  constructor(centroid: LngLat, marker: Marker) {
    this.centroid = centroid;
    this.marker = marker;
    this.placeCategories.add(PlaceCategory.shopping);
  }
}

export default MeetingArea;
