import { LngLat } from "mapbox-gl";
import { create } from "zustand";
import { MapViewState } from "@/app/components/MapboxGL";
import { SearchBoxRetrieveResponse } from "@mapbox/search-js-core";

interface MapStore {
  // State
  userLocation: LngLat | null;
  viewState: MapViewState | null;
  addresses: SearchBoxRetrieveResponse[];
  // Actions
  setUserLocation: (location: LngLat) => void;
  setViewState: (state: MapViewState) => void;
  setAddresses: (addresses: SearchBoxRetrieveResponse[]) => void;
  addAddress: (address: SearchBoxRetrieveResponse) => void;
}

const useMapStore = create<MapStore>()((set) => ({
  userLocation: null,
  viewState: null,
  addresses: [],
  setUserLocation: (location: LngLat) => setLoc(set)(location),
  setViewState: (newViewState: MapViewState) =>
    set(() => ({
      viewState: newViewState,
    })),
  setAddresses: (addresses: SearchBoxRetrieveResponse[]) => set({ addresses }),
  addAddress: (address: SearchBoxRetrieveResponse) =>
    set((state: MapStore) => ({
      addresses: [...state.addresses, address],
    })),
}));

const setLoc = (set: any) => (location: LngLat) => {
  set(() => ({ userLocation: location }));
};

export default useMapStore;
