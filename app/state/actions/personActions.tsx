import useMapStore, { MapStore } from "@/app/state/useMapStore";
import Person from "@/app/models/Person";
import { LngLat } from "mapbox-gl";
import { createMarker, nextColor } from "@/app/utils/mapUtils";
import { SetStateFunction } from "@/app/state/stateTypes";
import MeetingArea from "@/app/models/MeetingArea";
import { fetchRouteClient } from "@/app/utils/clientRequests/fetchRouteClient";

/**
 * The `addPersonAction` function adds a person to the global state.people array.
 * If the person does not have a marker, it creates one with the next available color.
 *
 * @param {SetStateFunction} set - The function to update the global state.
 * @param {Person} person - The person to be added to the global state.
 *
 * @example
 * const addPerson = addPersonAction(set);
 * addPerson(new Person(address));
 *
 * @returns {void}
 */
export const addPersonAction = (set: SetStateFunction) => (person: Person) => {
  set((state: { people: Person[] }) => {
    if (!person) return {};

    const newPeople = [...state.people, person];

    if (!person.marker && useMapStore.getState().mapRef.current) {
      const nextAvailableMarkerColor = nextColor(newPeople);
      const coord = person.address.coord;
      person.marker = createMarker(coord, nextAvailableMarkerColor);
    }

    return {
      people: newPeople,
    };
  });
};

/**
 * The `removePersonAction` function removes a person from the global state.people array.
 * It also removes the person's marker and clears their route from the map.
 *
 * @param {SetStateFunction} set - The function to update the global state.
 * @param {Person} person - The person to be removed from the global state.
 *
 * @example
 * const removePerson = removePersonAction(set);
 * removePerson(person);
 *
 * @returns {void}
 */
export const removePersonAction =
  (set: SetStateFunction) => (person: Person) => {
    if (!person) return {};

    set((state: MapStore) => ({
      people: state.people.filter((p) => p !== person),
    }));

    if (person.marker) {
      person.marker.remove();
    }

    person.clearRouteFromMap(useMapStore.getState().mapRef.current!);
  };

/**
 * The `setUserLocationAction` function sets the user's location in the global state.
 * It also sets the map view state and meeting area if it hasn't been previously set
 *
 *
 * @param {SetStateFunction} set - The function to update the global state.
 * @param {LngLat} location - The user's location to be set in the global state.
 *
 * @example
 * const setUserLocation = setUserLocationAction(set);
 * setUserLocation(new LngLat(-77.0365, 38.8977));
 *
 * @returns {void}
 */
export const setUserLocationAction =
  (set: SetStateFunction) => (location: LngLat) => {
    set((state: MapStore) => {
      const { setMeetingArea } = state;

      // Meeting Area Initialization
      if (!state.meetingArea) {
        const marker = createMarker(location, "white");
        const meetingArea = new MeetingArea(location, marker);
        setMeetingArea(meetingArea);
        meetingArea.marker.addTo(state.mapRef.current!);
        meetingArea.initCircle();
      }

      return {
        userLocation: location,
        viewState: {
          longitude: location.lng,
          latitude: location.lat,
          zoom: 14,
        },
      };
    });
  };

/**
 * The `updatePersonRouteDataAction` function updates the route data for a person in the global state.
 * It fetches the route data from the API based on the person's address and the given centroid,
 * and then updates the person's route data, distance, and duration.
 *
 * @param {SetStateFunction} set - The function to update the global state.
 * @param {Person} person - The person whose route data is to be updated.
 * @param {LngLat} centroid - The centroid coordinates to calculate the route to.
 *
 * @example
 * const updatePersonRouteData = updatePersonRouteDataAction(set);
 * updatePersonRouteData(person, new LngLat(-77.0365, 38.8977));
 *
 * @returns {Promise<void>} A promise that resolves when the route data has been updated.
 */
export const updatePersonRouteDataAction =
  (set: SetStateFunction) =>
  async (person: Person, centroid: LngLat): Promise<void> => {
    if (!person) return;

    person.routeData = await fetchRouteClient(person.address.coord, centroid);
    person.routeDistance = undefined;
    person.routeDuration = undefined;

    set((state) => ({ people: state.people }));
  };
