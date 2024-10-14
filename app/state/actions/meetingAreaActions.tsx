import MeetingArea from "@/app/models/MeetingArea";
import { SetStateFunction } from "@/app/state/stateTypes";

export const setMeetingAreaAction =
  (set: SetStateFunction) => (meetingArea: MeetingArea) => {
    set(() => ({ meetingArea }));
  };
