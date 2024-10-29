import MeetingArea from "@/app/models/MeetingArea";
import { SetStateFunction } from "@/app/state/stateTypes";

export const setMeetingAreaAction =
  (set: SetStateFunction) => (meetingArea: MeetingArea) => {
    set(() => ({ meetingArea }));
  };

export const clearPOIsAction =
  (set: SetStateFunction) => (meetingArea: MeetingArea) => {
    console.log("ENTERED CLEAR ACTION WITH MEETING AREA STATE:", meetingArea);
    if (!meetingArea) return {};

    const stalePOIs = meetingArea.POIs;
    console.log("stale", stalePOIs);
    stalePOIs.forEach((poi) => {
      console.log(poi);
      if (poi.marker) {
        poi.marker.remove();
      }
    });

    meetingArea.POIs = [];
  };
