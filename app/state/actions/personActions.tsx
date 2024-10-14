import useMapStore, { MapStore } from "@/app/state/useMapStore";
import Person from "@/app/models/Person";
import { LngLat } from "mapbox-gl";
import { createMarker, nextColor } from "@/app/utils/mapUtils";
import { SetStateFunction } from "@/app/state/stateTypes";

export const addPersonAction = (set: SetStateFunction) => (person: Person) => {
  set((state: { people: Person[] }) => {
    if (!person) return {};

    const newPeople = [...state.people, person];

    if (!person.marker && useMapStore.getState().mapRef.current) {
      const nextAvailableMarkerColor = nextColor(newPeople);
      const coord = person.address.coord;
      person.marker = createMarker(coord, nextAvailableMarkerColor);
    }

    return {
      people: newPeople,
    };
  });
};

export const removePersonAction =
  (set: SetStateFunction) => (person: Person) => {
    if (!person) return {};

    set((state: MapStore) => ({
      people: state.people.filter((p) => p !== person),
    }));

    if (person.marker) {
      person.marker.remove();
    }
  };

export const setPersonWeightAction =
  (set: SetStateFunction) => (id: string, weight: number) => {
    set((state: MapStore) => {
      const person = state.people.find((p) => p.id === id);

      if (person) {
        person.weight = weight;
      }

      return {
        people: [...state.people],
      };
    });
  };

export const setUserLocationAction =
  (set: SetStateFunction) => (location: LngLat) => {
    set(() => ({ userLocation: location }));
  };
