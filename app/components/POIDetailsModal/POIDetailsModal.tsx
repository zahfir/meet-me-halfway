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
  const { name, category } = selectedPOI ?? {};
  const { isOpen, closingTime } = selectedPOI?.closingTimeToday() ?? {};
  const address = selectedPOI?.address();
  const website = selectedPOI?.website();

  const distanceFromUser = selectedPOI?.distanceFromUser()?.toFixed(1) ?? false;

  // ICON
  const iconSize = 40;
  // Replace this with a short circuiting function
  const IconComponent = category ? CategoryIconMap[category] : null;
  const RenderedIcon = IconComponent ? <IconComponent size={iconSize} /> : null;

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
        <div className="d-flex flex-column justify-content-center">
          <h5 className="m-0">{name}</h5>
          <span className="d-flex">
            {!!distanceFromUser && (
              <p className="my-0">{distanceFromUser} km</p>
            )}
            {isOpen !== undefined && (
              <>
                <p className="mx-2 my-0">&middot;</p>
                <p
                  className={`my-0 ${isOpen ? "text-success" : "text-danger"}`}
                >
                  {isOpen ? `Open 'til ${closingTime}` : "Closed now"}
                </p>
              </>
            )}
          </span>
        </div>
      </div>
      <div
        className="my-3 p-2 border border-dark rounded-3"
        style={{ backgroundColor: "#1f1f1f" }}
      >
        Misc Tags Go Here
      </div>
      <h5>{address}</h5>
      {website && (
        <a href={website} target="_blank" rel="noopener noreferrer">
          {/* TODO STYLE THIS BUTTON */}
          <button>More Details</button>
        </a>
      )}
    </div>
  );
};

export default POIDetailsModal;
