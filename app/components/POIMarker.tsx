import React from "react";
import {
  CategoryIconMap,
  PlaceCategory,
} from "@/app/constants/overpass/overpassPlaceCategories";

interface POIMarkerProps {
  category: PlaceCategory;
}

/**
 * POIMarker component renders a button with an icon representing a point of interest (POI) category.
 *
 * @component
 * @param {POIMarkerProps} props - The properties for the POIMarker component.
 * @param {PlaceCategory} props.category - The category of the place which determines the icon to be displayed.
 * @returns {JSX.Element} A button element containing the icon for the specified category.
 */
const POIMarker: React.FC<POIMarkerProps> = ({ category }) => {
  return (
    <button className="btn btn-light p-1 d-inline-flex align-items-center justify-content-center rounded-circle">
      {React.createElement(CategoryIconMap[category])}
    </button>
  );
};

export default POIMarker;
