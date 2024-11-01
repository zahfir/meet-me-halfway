import opening_hours from "opening_hours";

// Helper function to get the current open status and closing time
export const getOpenStatusAndClosingTime = (
  openingHours: string
): { isOpen: boolean; closingTime?: string } => {
  const oh = new opening_hours(openingHours);

  const isOpen = oh.getState();
  const nextChange = oh.getNextChange();

  const closingTime = nextChange ? formatClosingTime(nextChange) : undefined;

  return { isOpen, closingTime };
};

const formatClosingTime = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const ampm = hours >= 12 ? "pm" : "am";
  const formattedHour = hours % 12 === 0 ? 12 : hours % 12;

  // Return formatted time based on whether minutes are non-zero
  return minutes === 0
    ? `${formattedHour}${ampm}`
    : `${formattedHour}:${minutes.toString().padStart(2, "0")}${ampm}`;
};
