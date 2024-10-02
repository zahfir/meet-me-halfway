import { ViewStateChangeEvent } from "react-map-gl";

export interface MapBoxProps {
  viewState: MapViewState | undefined;
  onMove: (e: ViewStateChangeEvent) => void;
  addressCoords: any[];
}
export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom?: number;
}
