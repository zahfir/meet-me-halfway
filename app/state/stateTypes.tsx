import Person from "../models/Person";
import { MapStore } from "./useMapStore";

type SetStateFunction = {
  (
    partial:
      | MapStore
      | Partial<MapStore>
      | ((state: MapStore) => MapStore | Partial<MapStore>),
    replace?: false
  ): void;
  (state: MapStore | ((state: MapStore) => MapStore), replace: true): void;
  (arg0: (state: { people: Person[] }) => { people: Person[] }): void;
};

export type { SetStateFunction };
