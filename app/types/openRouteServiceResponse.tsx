/**
 * The `RouteResponseType` type represents the response returned by the OpenRouteService API for a route request.
 * It is a GeoJSON FeatureCollection containing LineString features that represent the route.
 *
 * @typedef {GeoJSON.FeatureCollection<GeoJSON.LineString>} RouteResponseType
 *
 * @example
 * const routeResponse: RouteResponseType = {
 *   type: "FeatureCollection",
 *   features: [
 *     {
 *       type: "Feature",
 *       geometry: {
 *         type: "LineString",
 *         coordinates: [
 *           [-77.0365, 38.8977],
 *           [-77.0365, 38.8978],
 *           // More coordinates...
 *         ],
 *       },
 *       properties: {
 *         // Additional properties...
 *       },
 *     },
 *   ],
 * };
 */
export type RouteResponseType = GeoJSON.FeatureCollection<GeoJSON.LineString>;