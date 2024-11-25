import POI from "@/app/models/POI";
import { SetStateFunction } from "@/app/state/stateTypes";

export const setSelectedPOIAction = (set: SetStateFunction) => (poi: POI) => {
  set(() => ({ selectedPOI: poi }));
};

// may not need this -- may fold into above if closing the modal has little side effects
export const clearSelectedPOIAction = (set: SetStateFunction) => () => {
  set(() => ({ selectedPOI: null }));
};
