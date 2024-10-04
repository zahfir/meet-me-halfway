import { useEffect } from "react";
import mapboxgl, { LngLat, Map, LngLatBounds } from "mapbox-gl";
import useMapStore from "@/app/state/useMapStore";
import {
  buildMarker,
  customFitBounds,
  getAddressCoords,
} from "@/app/utils/mapUtils";
import { SearchBoxRetrieveResponse } from "@mapbox/search-js-core";

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
      if (mapRef.current) {
        // Change map to match viewState
        if (state.viewState !== prevState.viewState) {
          const { longitude, latitude, zoom } = state.viewState!;
          mapRef.current.setCenter([longitude, latitude]);
          mapRef.current.setZoom(zoom!);
        }
        // Remove existing markers
        mapRef.current._markers.forEach((marker) => marker.remove());

        if (state.addresses.length === 0) return;
        // Add new markers and fit markers in new bounds
        const markerColors = ["red", "blue", "green", "yellow", "purple"];
        const bounds = new LngLatBounds();
        state.addresses.forEach(
          (address: SearchBoxRetrieveResponse, i: number) => {
            const coord = getAddressCoords(address);
            bounds.extend([coord.lng, coord.lat]);

            buildMarker(
              mapRef.current!,
              coord,
              markerColors[i % markerColors.length]
            );
          }
        );
        customFitBounds(mapRef.current, bounds);
      }
    });

    return () => unsubscribe();
  }, [mapRef]);
};
