import opening_hours from "opening_hours";

// Helper function to get the current open status and closing time
export const getOpenStatusAndClosingTime = (
  openingHours: string
): { isOpen: boolean; closingTime?: string } => {
  const oh = new opening_hours(openingHours);

  const isOpen = oh.getState();
  const nextChange = oh.getNextChange();

  // Format the next change as a time, if it exists
  const closingTime = nextChange
    ? nextChange.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : undefined;

  return { isOpen, closingTime };
};
