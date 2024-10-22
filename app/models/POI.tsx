import { Marker } from "mapbox-gl";
import { PlaceCategory } from "../constants/overpassPlaceCategories";

class POI {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  category: PlaceCategory;
  marker: Marker;

  constructor(
    id: number,
    name: string,
    latitude: number,
    longitude: number,
    category: PlaceCategory
  ) {
    this.id = id;
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.category = category;

    /** CREATE ICON SYMBOL MARKER FROM CATEGORY */
    this.marker = new Marker().setLngLat([longitude, latitude]);
    // ADD MARKER TO MAP RIGHT HERE
  }

  getCoordinates(): string {
    return `Latitude: ${this.latitude}, Longitude: ${this.longitude}`;
  }
}

export default POI;
