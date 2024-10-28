import { LngLat, Marker } from "mapbox-gl";
import {
  CategoryIconMap,
  PlaceCategory,
} from "../constants/overpassPlaceCategories";
import useMapStore from "../state/useMapStore";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

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
    // TODO SLIDE IN MODAL ON MARKER CLICK EVENT
    // https://stackoverflow.com/questions/31448397/how-to-add-click-listener-on-marker-in-mapbox-gl-js
    console.log("in createMarkeronmap");
    const map = useMapStore.getState().mapRef.current;
    const element = React.createElement(CategoryIconMap[this.category]);
    const htmlMarkup = renderToStaticMarkup(element);
    const htmlElement = document.createElement("div");
    htmlElement.innerHTML = htmlMarkup;

    if (map && element) {
      this.marker = new Marker({ element: htmlElement }).setLngLat(this.coord);
      this.marker.addTo(map);
    }
  }
}

export default POI;
