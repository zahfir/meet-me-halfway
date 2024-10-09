import MeetingArea from "@/app/models/MeetingArea";

export const setMeetingAreaAction =
  (set: any) => (meetingArea: MeetingArea) => {
    set(() => ({ meetingArea }));
  };
