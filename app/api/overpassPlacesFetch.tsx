import MeetingArea from "@/app/models/MeetingArea";
import {
  CategoryQueryMap,
  CategoryResponseMap,
  PlaceCategory,
} from "@/app/constants/overpassPlaceCategories";
import OVERPASS_URL from "@/app/constants/overpassUrl";
import POI from "../models/POI";
import { OverpassResponse, OverpassTags } from "../types/overpassResponse";

async function getAreaPOIs(
  meetingArea: MeetingArea
): Promise<OverpassResponse[]> {
  if (!meetingArea) return [];

  const { lat, lng } = meetingArea.centroid;
  const r = meetingArea.radius * 1000;
  const placeCategories = meetingArea.placeCategories;

  const query = buildQuery(lat, lng, r, placeCategories);

  try {
    const response = await fetch(OVERPASS_URL, {
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
}

function createPOIObjectsFromResponse(
  responses: OverpassResponse[],
  meetingArea: MeetingArea
): POI[] {
  if (!responses || !meetingArea) return [];

  const POIs: POI[] = [];
  const selectedCategories = Array.from(meetingArea?.placeCategories);

  // Create a POI for each json object
  responses.forEach((json) => {
    const center = json.center;
    const tags = json.tags;

    const name = tags.name;

    const category = getPlaceCategoryFromResponse(tags, selectedCategories);
    if (!category) return [];

    const poi = new POI(name, center.lat, center.lon, category, tags);
    POIs.push(poi);
  });

  return POIs;
}

function getPlaceCategoryFromResponse(
  tags: OverpassTags,
  selectedCategories: PlaceCategory[]
): PlaceCategory | undefined {
  const category = selectedCategories.find((category) => {
    const mapping = CategoryResponseMap[category];
    const key = mapping[0]; // e.g. 'amenity'
    const value = mapping[1]; // e.g. 'restaurant'

    return key in tags && tags[key] === value;
  });

  return category;
}

function buildQuery(
  lat: number,
  lng: number,
  r: number,
  categories: Set<PlaceCategory>
): string {
  let categoriesString: string = "";

  // Iterate over each category and create the sub-queries
  categories.forEach((category) => {
    const categoryQuery = CategoryQueryMap[category];
    if (categoryQuery) {
      categoriesString += `(way${categoryQuery}(around:${r},${lat},${lng}););`;
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
}

export { getAreaPOIs as getPOIs, createPOIObjectsFromResponse };
