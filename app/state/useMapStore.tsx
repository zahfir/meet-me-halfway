import { LngLat, Map } from "mapbox-gl";
import { create } from "zustand";
import { MapViewState } from "@/app/components/MapboxGL";
import Person from "@/app/models/Person";
import {
  addPersonAction,
  removePersonAction,
  setUserLocationAction,
} from "@/app/state/actions";

export interface MapStore {
  // State
  mapRef: React.RefObject<Map | null>;
  userLocation: LngLat | null;
  viewState: MapViewState | null;
  people: Person[];
  // Actions
  setMapRef: (mapRef: React.RefObject<Map | null>) => void;
  setUserLocation: (location: LngLat) => void;
  setViewState: (state: MapViewState) => void;
  addPerson: (person: Person) => void;
  removePerson: (person: Person) => void;
}

const useMapStore = create<MapStore>()((set) => ({
  mapRef: { current: null },
  userLocation: null,
  viewState: null,
  people: [],
  setMapRef: (mapRef: React.RefObject<Map | null>) => set(() => ({ mapRef })),
  setUserLocation: (location: LngLat) => setUserLocationAction(set)(location),
  setViewState: (newViewState: MapViewState) =>
    set(() => ({
      viewState: newViewState,
    })),
  addPerson: (person: Person) => addPersonAction(set)(person),
  removePerson: (person: Person) => removePersonAction(set)(person),
}));

export default useMapStore;
