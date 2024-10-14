import { useEffect } from "react";
import mapboxgl, { LngLat, Map, LngLatBounds } from "mapbox-gl";

import useMapStore from "@/app/state/useMapStore";
import { createMarker, customFitBounds } from "@/app/utils/mapUtils";
import Person from "@/app/models/Person";
import MeetingArea from "../models/MeetingArea";
import { calculateCentroid } from "@/app/utils/meetingAreaUtils";
import { fetchMatchingRoute } from "../utils/mapMatchingUtils";

// Initializes Map instance
export const useInitializeMap = (
  mapContainerRef: React.MutableRefObject<HTMLDivElement | null>,
  mapRef: React.MutableRefObject<Map | null>,
  MAPBOX_ACCESS_TOKEN: string
) => {
  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
      });
      useMapStore.getState().setMapRef(mapRef);
    }
  }, [mapContainerRef.current]);
};

// Initializes program with user location
export const useUserLocation = (mapRef: React.RefObject<Map | null>) => {
  // Lift !userLocation check to up here
  const { setUserLocation, setViewState, setMeetingArea } = useMapStore();

  useEffect(() => {
    if (
      !useMapStore.getState().userLocation &&
      mapRef.current &&
      "geolocation" in navigator
    ) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        const location = new LngLat(longitude, latitude);
        setUserLocation(location);
        setViewState({
          longitude: location.lng,
          latitude: location.lat,
          zoom: 14,
        });
        // Create meeting area if it doesn't exist
        if (!useMapStore.getState().meetingArea) {
          setMeetingArea(
            new MeetingArea(location, createMarker(location, "white"))
          );
          useMapStore.getState().meetingArea?.marker.addTo(mapRef.current!);
        }
      });
    }
  }, [mapRef.current]);
};

export const useStateListener = (mapRef: React.RefObject<Map | null>) => {
  useEffect(() => {
    const unsubscribe = useMapStore.subscribe((state, prevState) => {
      if (!mapRef.current) return;

      // Change map to match viewState
      if (state.viewState !== prevState.viewState) {
        const { longitude, latitude, zoom } = state.viewState!;
        mapRef.current.setCenter([longitude, latitude]);
        mapRef.current.setZoom(zoom!);
      }

      if (state.people.length === 0) return;

      // Add marker for each person and extend camera bounds to include them
      if (state.people !== prevState.people) {
        const bounds = new LngLatBounds();
        state.people.forEach((person: Person) => {
          const coord = person.address.coord;
          bounds.extend([coord.lng, coord.lat]);
          person.marker?.addTo(mapRef.current!);
        });

        if (state.meetingArea && state.people.length > 1) {
          const centroid = calculateCentroid(state.people);
          state.meetingArea.centroid = centroid;
          state.meetingArea?.marker.setLngLat(centroid);

          if (state.meetingArea !== prevState.meetingArea) {
            console.log("Fetching routes...");
            if (state.meetingArea) {
              state.people.forEach(async (person: Person) => {
                const coord = person.address.coord;
                await fetchMatchingRoute([coord, centroid]);
              });
            }
          }
        }
        customFitBounds(mapRef, bounds);
      }
    }); // End subscribe

    return () => unsubscribe();
  }, [mapRef]);
};
