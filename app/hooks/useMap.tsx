import { useEffect } from "react";
import mapboxgl, { LngLat, Map, LngLatBounds } from "mapbox-gl";

import useMapStore from "@/app/state/useMapStore";
import { customFitBounds, getAddressCoords } from "@/app/utils/mapUtils";
import Person from "@/app/models/Person";

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
      console.log(mapRef.current._mapId);
    }
  }, [mapContainerRef.current]);
};

export const useUserLocation = (mapRef: React.RefObject<Map | null>) => {
  const { setUserLocation, setViewState } = useMapStore();

  useEffect(() => {
    if (
      mapRef.current &&
      "geolocation" in navigator &&
      !useMapStore.getState().userLocation
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
      const bounds = new LngLatBounds();
      state.people.forEach((person: Person, _: number) => {
        const coord = getAddressCoords(person.address);
        bounds.extend([coord.lng, coord.lat]);
        person.marker?.addTo(mapRef.current!);
      });

      customFitBounds(mapRef.current, bounds);
    });

    return () => unsubscribe();
  }, [mapRef]);
};
