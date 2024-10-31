import { NominatimResult } from "@/app/types/nominatimResponse";

export const isValidNominatimResult = (
  nominatimResult: NominatimResult
): boolean => {
  const { display_name, lon, lat } = nominatimResult;
  return !!(display_name && lat && lon);
};
