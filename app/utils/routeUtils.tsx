import { Map } from "mapbox-gl";
import Person from "@/app/models/Person";
import { RefObject } from "react";

/**
 * The `setRouteOpacityOnHover` function sets the opacity of routes on the map when hovering over a person.
 * It highlights the route of the current person and dims the routes of other people.
 *
 * @param {boolean} isHover - A boolean indicating whether the current person is already being hovered over.
 * @param {Function} setIsHover - A function to update the hover state.
 * @param {RefObject<Map | null>} mapRef - A reference to the Mapbox map instance.
 * @param {Person[]} people - An array of people whose routes are displayed on the map.
 * @param {string} currentPersonId - The ID of the current person being hovered over.
 * @param {boolean} enter - A boolean indicating whether the hover event is entering or leaving.
 *
 * @example
 * setRouteOpacityOnHover(true, setIsHover, mapRef, people, person.id, true);
 *
 * @returns {void}
 */
export const setRouteOpacityOnHover = (
  isHover: boolean,
  setIsHover: (hover: boolean) => void,
  mapRef: RefObject<Map | null>,
  people: Person[],
  currentPersonId: string,
  enter: boolean
) => {
  if (enter && isHover) return;

  const map = mapRef.current;
  if (!map) {
    console.error("Map not found while highlighting route.");
    return;
  }

  setIsHover(enter);

  const opacity = enter ? 0.1 : 1;
  people.forEach((person) => {
    if (person.id !== currentPersonId) person.setRouteOpacity(map, opacity);
  });
};
