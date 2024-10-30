import React from "react";
import {
  CategoryIconMap,
  PlaceCategory,
} from "@/app/constants/overpassPlaceCategories";

interface POIMarkerProps {
  category: PlaceCategory;
}

const POIMarker: React.FC<POIMarkerProps> = ({ category }) => {
  return (
    <button className="btn btn-light p-1 d-inline-flex align-items-center justify-content-center rounded-circle">
      {React.createElement(CategoryIconMap[category])}
    </button>
  );
};

export default POIMarker;
