import React, { CSSProperties } from "react";
import {
  CategoryIconMap,
  PlaceCategory,
} from "../constants/overpassPlaceCategories";
// import useMapStore from "../state/useMapStore";

interface POIMarkerProps {
  category: PlaceCategory;
}

const POIMarker: React.FC<POIMarkerProps> = ({ category }) => {
  const backgroundColor = "#fff";
  const containerStyle = {
    backgroundColor,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    padding: 8,
    cursor: "pointer",
  } as CSSProperties;

  return (
    <div style={containerStyle}>
      {React.createElement(CategoryIconMap[category])}
    </div>
  );
};

export default POIMarker;
