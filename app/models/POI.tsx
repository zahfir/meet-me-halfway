import { LngLat, Marker } from "mapbox-gl";
import {
  CategoryIconMap,
  PlaceCategory,
} from "../constants/overpass/overpassPlaceCategories";
import useMapStore from "../state/useMapStore";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import POIMarker from "../components/POIMarker";
import { distance } from "@/app/utils/mapUtils";
import { getOpenStatusAndClosingTime } from "@/app/utils/placesUtils";
import {
  Facility,
  FacilityIconMap,
  FacilityResponseMap,
} from "../constants/overpass/Facility";

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
   * @returns a string facility in order of specificity
   */
  facilityKey = (): string | undefined => {
    const tags = this.tagsJson;
    if (tags["cuisine"]) return "cuisine";
    if (tags["amenity"]) return "amenity";
    if (tags["shop"]) return "shop";
  };

  facility = (): Facility | undefined => {
    const key = this.facilityKey();
    if (!key) return;
    const facility = this.tagsJson[key];
    return FacilityResponseMap[facility];
  };

  /**
   *
   * @param size The size of the icon
   * @returns Icon (JSX.Element) that is associated with this amenity/shop/cuisine
   */
  createFacilityIcon = (
    facility?: Facility,
    size: number = 24,
    color: string = "#ffffff"
  ): JSX.Element | undefined => {
    if (!facility) return;

    // COMPONENT
    const IconComponent = FacilityIconMap[facility];
    if (!IconComponent) return;

    // JSX ELEMENT
    return <IconComponent size={size} color={color} />;
  };

  /**
   *
   * @param size The size of the icon
   * @returns Icon as a JSX.Element that is associated with this.category
   */
  createCategoryIcon = (
    size: number = 40,
    color: string = "#ffffff"
  ): JSX.Element | undefined => {
    // COMPONENT
    const IconComponent = CategoryIconMap[this.category];
    if (!IconComponent) return;

    // JSX ELEMENT
    return <IconComponent size={size} color={color} />;
  };

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
  address = (): string | undefined => {
    const number = this.tagsJson["addr:housenumber"];
    const street = this.tagsJson["addr:street"];
    const postcode = this.tagsJson["addr:postcode"] ?? "";

    if (!number || !street) return;
    return number + " " + street + " " + postcode;
  };

  /**
   * Extracts website
   */
  website = (): string | undefined => this.tagsJson["website"];
}

export default POI;
