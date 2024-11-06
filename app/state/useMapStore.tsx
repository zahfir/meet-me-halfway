import { LngLat, Map } from "mapbox-gl";
import { create } from "zustand";
import { MapViewState } from "@/app/components/MapboxGL";

// MODELS
import Person from "@/app/models/Person";
import MeetingArea from "@/app/models/MeetingArea";
import POI from "@/app/models/POI";

// ACTIONS
import {
  addPersonAction,
  removePersonAction,
  setPersonWeightAction,
  setUserLocationAction,
  updatePersonRouteDataAction,
} from "@/app/state/actions/personActions";
import {
  clearPOIsAction,
  refreshPOIsAction,
  setMeetingAreaAction,
} from "@/app/state/actions/meetingAreaActions";
import {
  setSelectedPOIAction,
  clearSelectedPOIAction,
} from "@/app/state/actions/selectedPOIActions";

export interface MapStore {
  // State
  mapRef: React.RefObject<Map | null>;
  userLocation: LngLat | null;
  viewState: MapViewState | null;
  people: Person[];
  meetingArea: MeetingArea | null;
  selectedPOI: POI | null;
  // Actions
  setMapRef: (mapRef: React.RefObject<Map | null>) => void;
  setUserLocation: (location: LngLat) => void;
  setViewState: (state: MapViewState) => void;
  addPerson: (person: Person) => void;
  removePerson: (person: Person) => void;
  updatePersonWeight: (id: string, weight: number) => void;
  setMeetingArea: (meetingArea: MeetingArea) => void;
  clearPOIs: (meetingArea: MeetingArea) => void;
  setSelectedPOI: (poi: POI) => void;
  clearSelectedPOI: () => void;
  refreshPOIs: (meetingArea: MeetingArea) => Promise<void>;
  updatePersonRouteData: (person: Person, centroid: LngLat) => Promise<void>;
}

const useMapStore = create<MapStore>()((set) => ({
  mapRef: { current: null },
  userLocation: null,
  viewState: null,
  people: [],
  meetingArea: null,
  selectedPOI: null,
  // Map actions
  setMapRef: (mapRef: React.RefObject<Map | null>) => set(() => ({ mapRef })),
  setUserLocation: (location: LngLat) => setUserLocationAction(set)(location),
  setViewState: (newViewState: MapViewState) =>
    set(() => ({
      viewState: newViewState,
    })),
  // People actions
  addPerson: (person: Person) => addPersonAction(set)(person),
  removePerson: (person: Person) => removePersonAction(set)(person),
  updatePersonWeight: (id: string, weight: number) =>
    setPersonWeightAction(set)(id, weight),
  // Meeting area actions
  setMeetingArea: (meetingArea: MeetingArea) =>
    setMeetingAreaAction(set)(meetingArea),
  clearPOIs: (meetingArea: MeetingArea) => clearPOIsAction(set)(meetingArea),
  setSelectedPOI: (poi: POI) => setSelectedPOIAction(set)(poi),
  clearSelectedPOI: () => clearSelectedPOIAction(set)(),
  refreshPOIs: (meetingArea: MeetingArea) =>
    refreshPOIsAction(set)(meetingArea),
  updatePersonRouteData: (person: Person, centroid: LngLat) =>
    updatePersonRouteDataAction(set)(person, centroid),
}));

export default useMapStore;
