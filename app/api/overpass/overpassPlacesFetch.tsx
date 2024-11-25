import MeetingArea from "@/app/models/MeetingArea";
import {
  CategoryQueryMap,
  CategoryResponseMap,
  PlaceCategory,
} from "@/app/constants/overpass/overpassPlaceCategories";
import POI from "@/app/models/POI";
import { OverpassResponse, OverpassTags } from "@/app/types/overpassResponse";

/**
 * Fetches Points of Interest (POIs) from the Overpass API based on the meeting area.
 *
 * @param {MeetingArea} meetingArea - The meeting area containing the centroid, radius, and place categories.
 * @returns {Promise<OverpassResponse[]>} A promise that resolves to an array of OverpassResponse objects.
 *                                        Returns an empty array if the meeting area is not provided or if an error occurs.
 * @throws {Error} If the fetch request fails.
 */
const fetchPOIs = async (
  meetingArea: MeetingArea
): Promise<OverpassResponse[]> => {
  if (!meetingArea) return [];

  const url = process.env.NEXT_PUBLIC_OVERPASS_URL;
  if (!url) return [];

  const { lat, lng } = meetingArea.centroid;
  const r = meetingArea.radius * 1000;
  const placeCategories = meetingArea.placeCategories;

  const query = buildQuery(lat, lng, r, placeCategories);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ data: query }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching POIs: ${response.statusText}`);
    }

    const data = await response.json();

    return (data.elements as OverpassResponse[]) || [];
  } catch (error) {
    console.error("Error fetching POIs from Overpass API:", error);
    return [];
  }
};

/**
 * Creates an array of POI objects from the Overpass API response.
 *
 * @param {OverpassResponse[]} responses - The array of responses from the Overpass API.
 * @param {MeetingArea} meetingArea - The meeting area containing the place categories.
 * @returns {POI[]} An array of POI objects. Returns an empty array if the responses or meeting area are not provided.
 */
const createPOIObjectsFromResponse = (
  responses: OverpassResponse[],
  meetingArea: MeetingArea
): POI[] => {
  if (!responses || !meetingArea) return [];

  const POIs: POI[] = [];
  const selectedCategories = Array.from(meetingArea?.placeCategories);

  // Create a POI for each json object
  responses.forEach((json) => {
    const { tags, center } = json;
    const name = tags.name;
    const category = getPlaceCategoryFromResponse(tags, selectedCategories);
    if (!category) return [];

    const poi = new POI(name, center.lat, center.lon, category, tags);
    POIs.push(poi);
  });

  return POIs;
};

/**
 * Determines the place category from the Overpass API response tags.
 *
 * @param {OverpassTags} tags - The tags from the Overpass API response.
 * @param {PlaceCategory[]} selectedCategories - The currently selected place categories.
 * @returns {PlaceCategory | undefined} The matching place category, or undefined if no match is found.
 */
const getPlaceCategoryFromResponse = (
  tags: OverpassTags,
  selectedCategories: PlaceCategory[]
): PlaceCategory | undefined => {
  const category = selectedCategories.find((category) => {
    const mapping = CategoryResponseMap[category];
    const key = mapping[0]; // e.g. 'amenity'
    const value = mapping[1]; // e.g. 'restaurant'

    return key in tags && tags[key] === value;
  });

  return category;
};

/**
 * Builds the Overpass API query string based on the provided parameters.
 *
 * @param {number} lat - The latitude of the center point.
 * @param {number} lng - The longitude of the center point.
 * @param {number} r - The radius around the center point in meters.
 * @param {Set<PlaceCategory>} categories - The set of place categories to include in the query.
 * @returns {string} The Overpass API query string.
 */
const buildQuery = (
  lat: number,
  lng: number,
  r: number,
  categories: Set<PlaceCategory>
): string => {
  let categoriesString: string = "";

  // Iterate over each category and create the sub-queries
  categories.forEach((category) => {
    const categoryQuery = CategoryQueryMap[category];
    if (categoryQuery) {
      categoriesString += `(way${categoryQuery}(around:${r},${lat},${lng})[name];);`;
    }
  });

  // Wrap all sub-queries in the union block
  return `
    [out:json];
    (
      ${categoriesString}
    );
    out center;
  `;
};

export { fetchPOIs, createPOIObjectsFromResponse };
