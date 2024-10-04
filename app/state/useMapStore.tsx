import { LngLat } from "mapbox-gl";
import { create } from "zustand";
import { MapViewState } from "@/app/components/MapboxGL";
import { SearchBoxRetrieveResponse } from "@mapbox/search-js-core";

interface MapStore {
  // State
  userLocation: LngLat | null;
  viewState: MapViewState | null;
  addresses: SearchBoxRetrieveResponse[]; // make this a Set for faster ops
  // Actions
  setUserLocation: (location: LngLat) => void;
  setViewState: (state: MapViewState) => void;
  setAddresses: (addresses: SearchBoxRetrieveResponse[]) => void;
  addAddress: (address: SearchBoxRetrieveResponse) => void;
  removeAddress: (address: SearchBoxRetrieveResponse) => void;
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
  removeAddress: (address: SearchBoxRetrieveResponse) =>
    removeAddress(set)(address),
}));

const setLoc = (set: any) => (location: LngLat) => {
  set(() => ({ userLocation: location }));
};

const removeAddress =
  (set: any) => (deleted_addr: SearchBoxRetrieveResponse) => {
    set((state: MapStore) => ({
      addresses: state.addresses.filter(
        (addr) =>
          addr.features[0].properties.name !==
          deleted_addr.features[0].properties.name
      ),
    }));
    console.log("deleted address", deleted_addr);
  };

export default useMapStore;
