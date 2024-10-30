import React from "react";
import useMapStore from "@/app/state/useMapStore";
import "./POIDetailsModal.css";
import POI from "@/app/models/POI";
import { CategoryIconMap } from "@/app/constants/overpassPlaceCategories";

/**
 * POIDetailsModal component displays information about the selected POI.
 */

const POIDetailsModal: React.FC = () => {
  const selectedPOI: POI | null = useMapStore((state) => state.selectedPOI);
  const category = selectedPOI?.category;
  const size = 40;

  const IconComponent = category ? CategoryIconMap[category] : null;

  const RenderedIcon = IconComponent ? <IconComponent size={size} /> : null;

  return (
    <div
      className={`modal-container ${
        selectedPOI ? "modal-visible" : "modal-hidden"
      } d-flex flex-column col-3 m-4 p-3
      bg-black text-white rounded-4`}
    >
      <div className="d-flex">
        <div className="me-4">
          {category && (
            <div className="bg-primary p-2 d-inline-flex align-items-center justify-content-center rounded-circle">
              {RenderedIcon}
            </div>
          )}
        </div>
        <h5>{selectedPOI?.name}</h5>
        <p>more</p>
      </div>
      <p>more</p>
    </div>
  );
};

export default POIDetailsModal;
