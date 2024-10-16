import MeetingArea from "@/app/models/MeetingArea";
import {
  CategoryQueryMap,
  PlaceCategory,
} from "@/app/constants/overpassPlaceCategories";
import OVERPASS_URL from "@/app/constants/overpassUrl";

async function getAreaPOIs(meetingArea: MeetingArea): Promise<unknown[]> {
  if (!meetingArea) return [];

  const { lat, lng } = meetingArea.centroid;
  const r = meetingArea.radius * 1000;
  const placeCategories = meetingArea.placeCategories;

  const query = buildOverpassQuery(lat, lng, r, placeCategories);

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

    return data.elements || [];
  } catch (error) {
    console.error("Error fetching POIs from Overpass API:", error);
    return [];
  }
}

function buildOverpassQuery(
  lat: number,
  lng: number,
  r: number,
  categories: Set<PlaceCategory>
): string {
  let categoriesString: string = "";

  // Iterate over each category and create the sub-queries
  categories.forEach((category) => {
    const value = CategoryQueryMap[category];
    if (value) {
      categoriesString += `(nwr${value}(around:${r},${lat},${lng}););`;
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

export { getAreaPOIs as getPOIs };
