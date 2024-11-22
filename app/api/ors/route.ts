import { LngLat } from "mapbox-gl";

import { NextRequest, NextResponse } from "next/server";

/**
 * Fetches a route from the OpenRouteService API based on the provided start and end coordinates.
 * Throws an error if the environment variables ORS_API_KEY or ORS_BASE_URL are not set,
 * or if the fetch request fails.
 *
 * @param {LngLat} start - The starting coordinate.
 * @param {LngLat} end - The ending coordinate.
 * @returns {Promise<GeoJSON.FeatureCollection<GeoJSON.LineString>>}
 *          A promise that resolves to a GeoJSON FeatureCollection representing the route.
 *
 * @throws {Error} Throws an error if the environment variables are not set or if the fetch request fails.
 */
export const fetchRoute = async (
  start: LngLat,
  end: LngLat
): Promise<GeoJSON.FeatureCollection<GeoJSON.LineString> | undefined> => {
  const apiKey = process.env.ORS_API_KEY;
  const baseUrl = process.env.ORS_BASE_URL;
  const url = `${baseUrl}?api_key=${apiKey}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching route: ${response.statusText}`);
    }
    const data: GeoJSON.FeatureCollection<GeoJSON.LineString> =
      await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchRoute:", error);
    throw error;
  }
};

/**
 * Handles a POST request to fetch a route from the OpenRouteService API.
 * Expects a JSON body with `start` and `end` coordinates.
 * Returns a JSON response with the route data or an error response if the fetch fails.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse | Response>}
 *          A promise that resolves to a NextResponse with the route data or an error response.
 */
export const POST = async (
  request: NextRequest
): Promise<NextResponse | Response> => {
  try {
    const { start, end } = await request.json();
    const data = await fetchRoute(start, end);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.error();
  }
};
