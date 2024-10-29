import { useEffect } from "react";
import mapboxgl, { LngLat, Map, LngLatBounds } from "mapbox-gl";

import useMapStore from "@/app/state/useMapStore";
import { createMarker, customFitBounds } from "@/app/utils/mapUtils";
import Person from "@/app/models/Person";
import MeetingArea from "../models/MeetingArea";
import { calculateCentroid } from "@/app/utils/meetingAreaUtils";
import { addRouteToMap, fetchRoute } from "../utils/routingUtils";

// Initializes Map instance
export const useInitMap = (
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

        // Meeting Area Initialization
        if (!useMapStore.getState().meetingArea) {
          const marker = createMarker(location, "white");
          const meetingArea = new MeetingArea(location, marker);
          setMeetingArea(meetingArea);
          meetingArea.marker.addTo(mapRef.current!);
          meetingArea.initCircle();
        }
      });
    }
  }, [mapRef.current]);
};

export const useStateListener = (mapRef: React.RefObject<Map | null>) => {
  useEffect(() => {
    const unsubscribe = useMapStore.subscribe((state, prevState) => {
      if (!mapRef.current) return;
      // VIEW STATE
      if (state.viewState !== prevState.viewState) {
        const { longitude, latitude, zoom } = state.viewState!;
        mapRef.current.setCenter([longitude, latitude]);
        mapRef.current.setZoom(zoom!);
      }

      if (state.people.length === 0) {
        console.log("No People. Hiding Circle.");
        state.meetingArea?.updateCircle(false);
        if (state.meetingArea) state.clearPOIs(state.meetingArea);
        return;
      }

      // Add marker for each person and extend camera bounds to include them
      if (state.people !== prevState.people) {
        const bounds = new LngLatBounds();
        state.people.forEach((person: Person) => {
          const coord = person.address.coord;
          bounds.extend([coord.lng, coord.lat]);
          person.marker?.addTo(mapRef.current!);
        });

        if (state.meetingArea) {
          if (state.people.length > 0) {
            const centroid: LngLat = calculateCentroid(state.people);
            if (centroid != prevState.meetingArea?.centroid) {
              console.log("Centroid change detected.");
              state.meetingArea.centroid = centroid;
              state.meetingArea.marker.setLngLat(centroid);
              state.meetingArea.updateCircle();

              if (state.meetingArea.POIs.length > 0)
                state.clearPOIs(state.meetingArea);

              // ROUTE REFRESH
              state.people.forEach(async (person: Person) => {
                person.clearRoute(mapRef.current!);
                const color = person.marker!._color;

                const route = await fetchRoute(
                  person.address.coord,
                  state.meetingArea!.centroid
                );
                const coordinates = route.features[0].geometry.coordinates;

                addRouteToMap(person.id, mapRef.current!, coordinates, color);
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
