import { LngLat } from "mapbox-gl";
import {create} from "zustand";
import { MapViewState } from "@/app/components/MapboxGL";
import { SearchBoxRetrieveResponse } from "@mapbox/search-js-core";

interface MapStore {
  userLocation: LngLat | null;
  viewState: MapViewState | null;
  addresses: SearchBoxRetrieveResponse[];
  setUserLocation: (location: LngLat) => void;
  setViewState: (state: MapViewState) => void;
  setAddresses: (addresses: SearchBoxRetrieveResponse[]) => void;
  addAddress: (address: SearchBoxRetrieveResponse) => void;
}

const useMapStore = create<MapStore>((set) => ({
  userLocation: null,
  viewState: null,
  addresses: [],
  setUserLocation: (location: LngLat) => set({ userLocation: location }),
  setViewState: (state: MapViewState) => set({ viewState: state }),
  setAddresses: (addresses: SearchBoxRetrieveResponse[]) => set({ addresses }),
  addAddress: (address: SearchBoxRetrieveResponse) =>
    set((state: MapStore) => ({
      addresses: [...state.addresses, address],
    })),
}));

export default useMapStore;
