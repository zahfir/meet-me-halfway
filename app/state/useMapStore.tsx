import { LngLat, Map } from "mapbox-gl";
import { create } from "zustand";
import { MapViewState } from "@/app/components/MapboxGL";

import Person from "@/app/models/Person";
import {
  addPersonAction,
  removePersonAction,
  setPersonWeightAction,
  setUserLocationAction,
} from "@/app/state/actions/personActions";

import MeetingArea from "../models/MeetingArea";
import { setMeetingAreaAction } from "@/app/state/actions/meetingAreaActions";

export interface MapStore {
  // State
  mapRef: React.RefObject<Map | null>;
  userLocation: LngLat | null;
  viewState: MapViewState | null;
  people: Person[];
  meetingArea: MeetingArea | null;
  // Actions
  setMapRef: (mapRef: React.RefObject<Map | null>) => void;
  setUserLocation: (location: LngLat) => void;
  setViewState: (state: MapViewState) => void;
  addPerson: (person: Person) => void;
  removePerson: (person: Person) => void;
  updatePersonWeight: (id: string, weight: number) => void;
  setMeetingArea: (meetingArea: MeetingArea) => void;
}

const useMapStore = create<MapStore>()((set) => ({
  mapRef: { current: null },
  userLocation: null,
  viewState: null,
  people: [],
  meetingArea: null,
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
}));

export default useMapStore;
