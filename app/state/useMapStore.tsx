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

/**
 * The `MapStore` interface defines the structure of the global state for the map application.
 *
 * @interface MapStore
 * @property {React.RefObject<Map | null>} mapRef - A reference to the Mapbox map instance.
 * @property {LngLat | null} userLocation - The user's current location.
 * @property {MapViewState | null} viewState - The current view state of the map.
 * @property {Person[]} people - An array of people on the map.
 * @property {MeetingArea | null} meetingArea - The current meeting area on the map.
 * @property {POI | null} selectedPOI - The currently selected point of interest (POI).
 * @property {Function} setMapRef - Sets the map reference in the global state.
 * @property {Function} setUserLocation - Sets the user's location in the global state.
 * @property {Function} setViewState - Sets the view state of the map in the global state.
 * @property {Function} addPerson - Adds a person to the global state.
 * @property {Function} removePerson - Removes a person from the global state.
 * @property {Function} setMeetingArea - Sets the meeting area in the global state.
 * @property {Function} clearPOIs - Clears all points of interest (POIs) from the meeting area.
 * @property {Function} setSelectedPOI - Sets the selected POI in the global state.
 * @property {Function} clearSelectedPOI - Clears the selected POI from the global state.
 * @property {Function} refreshPOIs - Fetches and refreshes POIs for the meeting area.
 * @property {Function} updatePersonRouteData - Updates the route data for a person in the global state.
 */
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
  setMeetingArea: (meetingArea: MeetingArea) => void;
  clearPOIs: (meetingArea: MeetingArea) => void;
  setSelectedPOI: (poi: POI) => void;
  clearSelectedPOI: () => void;
  refreshPOIs: (meetingArea: MeetingArea) => Promise<void>;
  updatePersonRouteData: (person: Person, centroid: LngLat) => Promise<void>;
}

/**
 * The `useMapStore` hook creates and manages the global state for the map application using Zustand.
 * It includes state variables for the map reference, user location, view state, people, meeting area, and selected POI.
 * It also provides actions to update these state variables.
 *
 * @returns {MapStore} The global state and actions for the map application.
 *
 * @example
 * const mapStore = useMapStore();
 * const userLocation = mapStore.userLocation;
 * mapStore.setUserLocation(new LngLat(-77.0365, 38.8977));
 */
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
  // Meeting area actions
  setMeetingArea: (meetingArea: MeetingArea) =>
    setMeetingAreaAction(set)(meetingArea),
  setSelectedPOI: (poi: POI) => setSelectedPOIAction(set)(poi),
  clearSelectedPOI: () => clearSelectedPOIAction(set)(),
  refreshPOIs: (meetingArea: MeetingArea) =>
    refreshPOIsAction(set)(meetingArea),
  clearPOIs: (meetingArea: MeetingArea) => clearPOIsAction()(meetingArea),
  updatePersonRouteData: (person: Person, centroid: LngLat) =>
    updatePersonRouteDataAction(set)(person, centroid),
}));

export default useMapStore;
