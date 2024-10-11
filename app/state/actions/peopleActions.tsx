import useMapStore, { MapStore } from "@/app/state/useMapStore";
import Person from "@/app/models/Person";
import { LngLat } from "mapbox-gl";
import {
  createMarker,
  getAddressCoords,
  nextColor,
} from "@/app/utils/mapUtils";

export const addPersonAction = (set: any) => (person: Person) => {
  set((state: MapStore) => {
    const newPeople = [...state.people, person];

    if (!person.marker && useMapStore.getState().mapRef.current) {
      const availableColor = nextColor(newPeople);
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

export const setPersonWeightAction = (set: any) => (id: string, weight: number) => {
  set((state: MapStore) => {
    const person = state.people.find((p) => p.id === id);

    if (person) {
      person.weight = weight;
    }

    return {
      people: [...state.people],
    };
  });
}

export const setUserLocationAction = (set: any) => (location: LngLat) => {
  set(() => ({ userLocation: location }));
};
