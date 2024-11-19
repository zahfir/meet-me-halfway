import {
  fetchPOIs,
  createPOIObjectsFromResponse,
} from "@/app/api/overpass/overpassPlacesFetch";
import MeetingArea from "@/app/models/MeetingArea";
import { SetStateFunction } from "@/app/state/stateTypes";
import { OverpassResponse } from "@/app/types/overpassResponse";

/**
 * The `setMeetingAreaAction` function sets the meeting area in the global state.
 *
 * @param {SetStateFunction} set - The function to update the global state.
 * @param {MeetingArea} meetingArea - The meeting area to be set in the global state.
 *
 * @example
 * const setMeetingArea = setMeetingAreaAction(set);
 * setMeetingArea(new MeetingArea(centroid, marker));
 *
 * @returns {void}
 */
export const setMeetingAreaAction =
  (set: SetStateFunction) => (meetingArea: MeetingArea) => {
    set(() => ({ meetingArea }));
  };

/**
 * The `refreshPOIsAction` function fetches points of interest (POIs) for the given meeting area,
 * creates POI objects from the response, and updates the meeting area with the new POIs.
 *
 * @param {SetStateFunction} set - The function to update the global state.
 * @param {MeetingArea} meetingArea - The meeting area for which to fetch and refresh POIs.
 *
 * @example
 * const refreshPOIs = refreshPOIsAction(set);
 * refreshPOIs(meetingArea);
 *
 * @returns {Promise<void>} A promise that resolves when the POIs have been refreshed.
 */
export const refreshPOIsAction =
  (set: SetStateFunction) =>
  async (meetingArea: MeetingArea): Promise<void> => {
    if (!meetingArea) return;
    meetingArea.isOverpassLoading = true;

    const overpassResponses: OverpassResponse[] = await fetchPOIs(meetingArea);
    const poiObjects = createPOIObjectsFromResponse(
      overpassResponses,
      meetingArea
    );
    poiObjects.forEach((poi) => {
      poi.createMarkerOnMap();
    });

    meetingArea.POIs = poiObjects;
    meetingArea.isOverpassLoading = false;
    set(() => ({}));
  };

/**
 * The `clearPOIsAction` function clears all points of interest (POIs) from the given meeting area.
 * It removes the markers for each POI from the map and updates the meeting area.
 *
 * @param {MeetingArea} meetingArea - The meeting area from which to clear POIs.
 *
 * @example
 * const clearPOIs = clearPOIsAction();
 * clearPOIs(meetingArea);
 *
 * @returns {void}
 */
export const clearPOIsAction = () => (meetingArea: MeetingArea) => {
  if (!meetingArea) return {};

  const stalePOIs = meetingArea.POIs;
  stalePOIs.forEach((poi) => {
    if (poi.marker) {
      poi.marker.remove();
    }
  });

  meetingArea.POIs = [];
};
