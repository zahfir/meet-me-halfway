import React from "react";
import useMapStore from "@/app/state/useMapStore";
import "./POIDetailsModal.css";

/**
 * POIDetailsModal component displays information about the selected POI.
 */
interface POIDetailsModalProps {}

const POIDetailsModal: React.FC<POIDetailsModalProps> = ({}) => {
  const selectedPOI = useMapStore((state) => state.selectedPOI);

  return (
    <div
      className={`modal-container ${
        selectedPOI ? "modal-visible" : "modal-hidden"
      } d-flex flex-column col-3 m-4 p-3 bg-black text-white`}
    >
      <h2>Details</h2>
      <h3>more</h3>
    </div>
  );
};

export default POIDetailsModal;
