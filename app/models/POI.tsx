import { LngLat, Marker } from "mapbox-gl";
import { PlaceCategory } from "../constants/overpassPlaceCategories";
import useMapStore from "../state/useMapStore";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import POIMarker from "../components/POIMarker";
import { distance } from "@/app/utils/mapUtils";
import { getOpenStatusAndClosingTime } from "@/app/utils/placesUtils";

class POI {
  id: string;
  name: string;
  coord: LngLat;
  category: PlaceCategory;
  marker?: Marker;
  tagsJson: { [key: string]: string };

  constructor(
    name: string,
    latitude: number,
    longitude: number,
    category: PlaceCategory,
    tagsJson: {}
  ) {
    this.id = Math.random().toString(36).substring(2, 11);
    this.name = name;
    this.coord = new LngLat(longitude, latitude);
    this.category = category;
    this.tagsJson = tagsJson;
  }

  /**
   * Handles POI marker clicks, including styling and global state updates
   * @returns void
   */
  private readonly handleMarkerClick = () => {
    const { selectedPOI, setSelectedPOI, clearSelectedPOI } =
      useMapStore.getState();

    if (selectedPOI) {
      const oldMarker = selectedPOI.marker?.getElement()
        ?.firstChild as HTMLElement;
      oldMarker.classList.add("btn-light");
      clearSelectedPOI();
      if (this === selectedPOI) return;
    }

    setSelectedPOI(this);
    const markerElement = this.marker?.getElement()?.firstChild as HTMLElement;
    markerElement.classList.remove("btn-light");
    markerElement.classList.add("btn-primary");
  };

  /**
   * Creates a MapboxGL marker (HTMLElement from <POIMarker/>), attaches a click event listener, and places it on the map
   */
  createMarkerOnMap() {
    const { mapRef } = useMapStore.getState();
    const map = mapRef.current;

    // JSX Element
    const element = <POIMarker category={this.category} />;
    const htmlMarkup = renderToStaticMarkup(element);

    // HTML Element
    const htmlElement = document.createElement("div");
    htmlElement.addEventListener("click", this.handleMarkerClick);
    htmlElement.innerHTML = htmlMarkup;

    // Place on Map
    if (map && element) {
      this.marker = new Marker({ element: htmlElement }).setLngLat(this.coord);
      this.marker.addTo(map);
    }
  }

  // isSelected = (): boolean => this === useMapStore.getState().selectedPOI;

  /**
   * Calculates distance from user location
   */
  distanceFromUser = (): number | undefined => {
    const userLocation = useMapStore.getState().userLocation;
    if (!userLocation) return;
    return distance(userLocation, this.coord);
  };

  /**
   * Extracts specific type of service/amenity/shop
   */

  /**
   * Returns "Closed now" and "Open 'til Xam/pm"
   */
  closingTimeToday = ():
    | { isOpen: boolean; closingTime?: string }
    | undefined => {
    const opening_hours = this.tagsJson["opening_hours"];
    if (!opening_hours) return;
    return getOpenStatusAndClosingTime(opening_hours);
  };

  /**
   * Extracts address
   */

  /**
   * Extracts website
   */
}

export default POI;
