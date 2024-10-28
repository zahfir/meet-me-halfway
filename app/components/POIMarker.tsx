import React from "react";
import {
  CategoryIconMap,
  PlaceCategory,
} from "../constants/overpassPlaceCategories";
import useMapStore from "../state/useMapStore";

interface POIMarkerProps {
  lat: number;
  lon: number;
  category: PlaceCategory;
}

const POIMarker: React.FC<POIMarkerProps> = ({ lat, lon, category }) => {
  const meetingArea = useMapStore((state) => state.meetingArea);
  const allCategories: string[] = Object.values(PlaceCategory);

  return (
    <div>
      {
        // Dynamically render the icon based on the category value
        React.createElement(CategoryIconMap[category])
      }
    </div>
  );
};

export default POIMarker;
