import { LngLat, Marker } from "mapbox-gl";
class MeetingArea {
  centroid: LngLat;
  marker: Marker;
  radius: number = 15;

  constructor(centroid: LngLat, marker: Marker) {
    this.centroid = centroid;
    this.marker = marker;
  }
}

export default MeetingArea;
