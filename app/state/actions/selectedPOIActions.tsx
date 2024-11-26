import POI from "@/app/models/POI";
import { SetStateFunction } from "@/app/state/stateTypes";

export const setSelectedPOIAction = (set: SetStateFunction) => (poi: POI) => {
  set(() => ({ selectedPOI: poi }));
};

export const clearSelectedPOIAction = (set: SetStateFunction) => () => {
  set(() => ({ selectedPOI: null }));
};
