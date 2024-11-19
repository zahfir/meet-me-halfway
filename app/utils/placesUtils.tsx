import opening_hours from "opening_hours";

/**
 * The `getOpenStatusAndClosingTime` function determines if a place is currently open
 * and calculates the next closing time based on the provided opening hours.
 *
 * @param {string} openingHours - The opening hours string in the format used by the `opening_hours` library.
 *
 * @example
 * const { isOpen, closingTime } = getOpenStatusAndClosingTime("Mo-Fr 08:00-18:00");
 *
 * 
 * @returns {{ isOpen: boolean; closingTime?: string }} 
 * An object containing the open status and the next closing time (if available).
 */
export const getOpenStatusAndClosingTime = (
  openingHours: string
): { isOpen: boolean; closingTime?: string } => {
  const oh = new opening_hours(openingHours);

  const isOpen = oh.getState();
  const nextChange = oh.getNextChange();

  const closingTime = nextChange ? formatClosingTime(nextChange) : undefined;

  return { isOpen, closingTime };
};

/**
 * The `formatClosingTime` function formats a Date object into a human-readable time string (e.g., "3pm" or "3:30pm").
 *
 * @param {Date} date - The Date object representing the closing time.
 *
 * @example
 * const formattedTime = formatClosingTime(new Date());
 *
 * @returns {string} The formatted closing time string.
 */
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
