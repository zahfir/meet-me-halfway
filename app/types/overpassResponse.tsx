/**
 * The `OverpassResponse` type represents the response returned by the Overpass API for a point of interest (POI) request.
 * It includes the center coordinates and tags associated with the POI.
 *
 * @typedef {Object} OverpassResponse
 * @property {Object} center - The center coordinates of the point of interest.
 * @property {number} center.lat - The latitude of the center coordinates.
 * @property {number} center.lon - The longitude of the center coordinates.
 * @property {OverpassTags} tags - The tags associated with the point of interest.
 *
 * @example
 * const response: OverpassResponse = {
 *   center: { lat: 40.785091, lon: -73.968285 },
 *   tags: {
 *     name: "Central Park",
 *     amenity: "park",
 *     operator: "NYC Parks",
 *   },
 * };
 */
export type OverpassResponse = {
  center: { lat: number; lon: number };
  tags: OverpassTags;
};

/**
 * The `OverpassTags` type represents the tags associated with a point of interest (POI) in the Overpass API response.
 * It includes a name and any additional key-value pairs representing other tags.
 *
 * @typedef {Object} OverpassTags
 * @property {string} name - The name of the point of interest.
 * @property {string} [key: string] - Additional key-value pairs representing other tags.
 *
 * @example
 * const tags: OverpassTags = {
 *   name: "Central Park",
 *   amenity: "park",
 *   operator: "NYC Parks",
 * };
 */
export type OverpassTags = {
  name: string;
  [key: string]: string;
};
