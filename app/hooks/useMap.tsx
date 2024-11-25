import { useEffect, MutableRefObject, RefObject } from "react";
import mapboxgl, { LngLat, Map, LngLatBounds } from "mapbox-gl";

import useMapStore from "@/app/state/useMapStore";

import Person from "@/app/models/Person";

import { customFitBounds } from "@/app/utils/mapUtils";
import { calculateCentroid } from "@/app/utils/meetingAreaUtils";

import { fetchMapboxTokenClient } from "@/app/utils/clientRequests/fetchMapboxTokenClient";

/**
 * The `useInitMap` hook initializes a Mapbox map instance and sets the map reference in the global state.
 * It is intended to be used in a component that renders a Mapbox map.
 * This hook ensures that the map is initialized only once and sets up the necessary configurations.
 *
 * @param {MutableRefObject<HTMLDivElement | null>} mapContainerRef - A ref object pointing to the map container div.
 * @param {MutableRefObject<Map | null>} mapRef - A ref object to store the Mapbox map instance.
 *
 * @example
 * const mapContainerRef = useRef<HTMLDivElement | null>(null);
 * const mapRef = useRef<Map | null>(null);
 * useInitMap(mapContainerRef, mapRef);
 *
 * @returns {void}
 */
export const useInitMap = (
  mapContainerRef: MutableRefObject<HTMLDivElement | null>,
  mapRef: MutableRefObject<Map | null>
) => {
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current && mapContainerRef.current) {
        const token = await fetchMapboxTokenClient();
        if (!token) {
          console.error(
            "Mapbox token not available. Map initialization aborted."
          );
          return;
        }

        mapboxgl.accessToken = token;

        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/dark-v11",
        });

        mapRef.current?.on("load", () => {
          console.log("MAPBOX LOADED");
        });

        useMapStore.getState().setMapRef(mapRef);
      }
    };

    initMap();
  }, [mapContainerRef.current]);
};

/**
 * The `useUserLocation` hook initializes the user's location using the state action.
 *
 * @param {React.RefObject<Map | null>} mapRef - A ref object to the Mapbox map instance.
 *
 * @example
 * const mapRef = useRef<Map | null>(null);
 * useUserLocation(mapRef);
 *
 * @returns {void}
 */
export const useUserLocation = (mapRef: RefObject<Map | null>) => {
  const { setUserLocation } = useMapStore();

  useEffect(() => {
    if (
      !useMapStore.getState().userLocation &&
      mapRef.current &&
      "geolocation" in navigator
    ) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        const userLocation = new LngLat(longitude, latitude);
        setUserLocation(userLocation);
      });
    }
  }, [mapRef.current]);
};

/**
 * The `useStateListener` hook subscribes to the global state and updates the map based on state changes.
 * It handles view state updates, people updates, and meeting area updates.
 *
 * @param {RefObject<Map | null>} mapRef - A ref object to the Mapbox map instance.
 *
 * @example
 * const mapRef = useRef<Map | null>(null);
 * useStateListener(mapRef);
 *
 * @returns {void}
 */
export const useStateListener = (mapRef: RefObject<Map | null>) => {
  useEffect(() => {
    const unsubscribe = useMapStore.subscribe((state, prevState) => {
      if (!mapRef.current) return;
      // VIEW STATE
      if (state.viewState !== prevState.viewState) {
        const { longitude, latitude, zoom } = state.viewState!;
        mapRef.current.setCenter([longitude, latitude]);
        mapRef.current.setZoom(zoom!);
      }

      // PEOPLE
      if (state.people.length === 0) {
        state.meetingArea?.updateCircle(false);
        if (state.meetingArea) state.clearPOIs(state.meetingArea);
        state.selectedPOI?.handleMarkerClick();
        return;
      }

      if (state.people !== prevState.people) {
        const cameraBounds = new LngLatBounds();
        state.people.forEach((person: Person) => {
          const personCoordinate = person.address.coord;
          cameraBounds.extend([personCoordinate.lng, personCoordinate.lat]);
          person.marker?.addTo(mapRef.current!);
        });

        customFitBounds(mapRef, cameraBounds);

        // MEETING AREA
        if (state.meetingArea) {
          state.selectedPOI?.handleMarkerClick();

          const centroid: LngLat = calculateCentroid(state.people);
          const centroidHasChanged =
            centroid != prevState.meetingArea?.centroid;

          if (centroidHasChanged) {
            state.meetingArea.centroid = centroid;
            state.meetingArea.marker.setLngLat(centroid);
            state.meetingArea.updateCircle();

            // POI REFRESH
            state.clearPOIs(state.meetingArea);
            state.refreshPOIs(state.meetingArea);

            // ROUTE REFRESH
            state.people.forEach(async (person: Person) => {
              person.clearRouteFromMap(mapRef.current!);
              await state.updatePersonRouteData(
                person,
                state.meetingArea!.centroid
              );
              person.addRouteToMap(mapRef.current!);
            });
          }
        }
      }
    }); // End subscribe

    return () => unsubscribe();
  }, [mapRef]);
};
