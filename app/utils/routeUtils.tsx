import { Map } from "mapbox-gl";
import Person from "@/app/models/Person";

export const setRouteOpacityOnHover = (
  isHover: boolean,
  setIsHover: (hover: boolean) => void,
  mapRef: React.RefObject<Map | null>,
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
