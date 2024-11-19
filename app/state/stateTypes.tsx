import Person from "@/app/models/Person";
import { MapStore } from "./useMapStore";

/**
 * The `SetStateFunction` type represents a function used to update the global state in the `useMapStore` hook.
 * It can accept a partial state, a complete state, or a function that returns a partial or complete state.
 * The function can also replace the entire state if specified.
 *
 * @typedef {Function} SetStateFunction
 * @param {MapStore | Partial<MapStore> | ((state: MapStore) => MapStore | Partial<MapStore>)} partial - The partial or complete state to be set, or a function that returns the partial or complete state.
 * @param {boolean} [replace=false] - A boolean indicating whether to replace the entire state.
 *
 * @example
 * // Using SetStateFunction to update a partial state
 * const setState: SetStateFunction = useMapStore.getState().setState;
 * setState({ userLocation: new LngLat(-77.0365, 38.8977) });
 *
 * @example
 * // Using SetStateFunction to update the state with a function
 * setState((state) => ({
 *   people: [...state.people, new Person(address)],
 * }));
 *
 * @example
 * // Using SetStateFunction to replace the entire state
 * setState(newState, true);
 */
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
