import useMapStore, { MapStore } from "@/app/state/useMapStore";
import Person from "@/app/models/Person";
import { LngLat } from "mapbox-gl";
import { createMarker, getAddressCoords } from "@/app/utils/mapUtils";
import markerColors from "../constants/markerColors";

export const addPersonAction = (set: any) => (person: Person) => {
  set((state: MapStore) => {
    const newPeople = [...state.people, person];

    if (!person.marker && useMapStore.getState().mapRef.current) {
      const usedColors = newPeople.map((p) => p.marker?._color);
      const availableColor =
        markerColors.find((color) => !usedColors.includes(color)) ??
        markerColors[0];
      const coord = getAddressCoords(person.address);

      person.marker = createMarker(coord, availableColor);
    }

    return {
      people: newPeople,
    };
  });
};

export const removePersonAction = (set: any) => (person: Person) => {
  set((state: MapStore) => ({
    people: state.people.filter((p) => p !== person),
  }));

  if (person.marker) {
    person.marker.remove();
  }
};

export const setUserLocationAction = (set: any) => (location: LngLat) => {
  set(() => ({ userLocation: location }));
};
