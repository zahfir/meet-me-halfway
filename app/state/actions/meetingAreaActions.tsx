import {
  getPOIs,
  createPOIObjectsFromResponse,
} from "@/app/api/overpassPlacesFetch";
import MeetingArea from "@/app/models/MeetingArea";
import { SetStateFunction } from "@/app/state/stateTypes";
import { OverpassResponse } from "@/app/types/overpassResponse";

export const setMeetingAreaAction =
  (set: SetStateFunction) => (meetingArea: MeetingArea) => {
    set(() => ({ meetingArea }));
  };

export const refreshPOIsAction =
  (set: SetStateFunction) =>
  async (meetingArea: MeetingArea): Promise<void> => {
    // console.log("REFRESH POI ACTION:", meetingArea);
    if (!meetingArea) return;

    const overpassResponses: OverpassResponse[] = await getPOIs(meetingArea);
    // console.log(overpassResponses);
    const poiObjects = createPOIObjectsFromResponse(
      overpassResponses,
      meetingArea
    );
    // console.log(poiObjects);
    poiObjects.forEach((poi) => {
      poi.createMarkerOnMap();
    });

    // UPDATE MEETING AREA
    meetingArea.POIs = poiObjects;
  };

export const clearPOIsAction =
  (set: SetStateFunction) => (meetingArea: MeetingArea) => {
    // console.log("CLEAR POI ACTION", meetingArea);
    if (!meetingArea) return {};

    const stalePOIs = meetingArea.POIs;
    stalePOIs.forEach((poi) => {
      if (poi.marker) {
        poi.marker.remove();
      }
    });

    meetingArea.POIs = [];
  };
