import { LngLat, Marker } from "mapbox-gl";
import {
  CategoryIconMap,
  PlaceCategory,
} from "../constants/overpassPlaceCategories";
import useMapStore from "../state/useMapStore";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import POIMarker from "../components/POIMarker";

class POI {
  id: string;
  name: string;
  coord: LngLat;
  category: PlaceCategory;
  marker?: Marker;

  constructor(
    name: string,
    latitude: number,
    longitude: number,
    category: PlaceCategory
  ) {
    this.id = Math.random().toString(36).substring(2, 11);
    this.name = name;
    this.coord = new LngLat(longitude, latitude);
    this.category = category;
  }

  createMarkerOnMap() {
    const map = useMapStore.getState().mapRef.current;
    const element = <POIMarker category={this.category} />;
    const htmlMarkup = renderToStaticMarkup(element);
    const htmlElement = document.createElement("div");
    htmlElement.addEventListener("click", () => {
      // TODO SLIDE IN MODAL ON MARKER CLICK EVENT
      alert("Clicked");
    });
    htmlElement.innerHTML = htmlMarkup;

    if (map && element) {
      this.marker = new Marker({ element: htmlElement }).setLngLat(this.coord);
      this.marker.addTo(map);
    }
  }
}

export default POI;
