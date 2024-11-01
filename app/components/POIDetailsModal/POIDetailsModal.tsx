import React from "react";
import useMapStore from "@/app/state/useMapStore";
import "./POIDetailsModal.css";
import POI from "@/app/models/POI";

/**
 * POIDetailsModal component displays information about the selected POI.
 */

const POIDetailsModal: React.FC = () => {
  const selectedPOI: POI | null = useMapStore((state) => state.selectedPOI);
  const { name } = selectedPOI ?? {};
  const { isOpen, closingTime } = selectedPOI?.closingTimeToday() ?? {};
  const address = selectedPOI?.address();
  const website = selectedPOI?.website();
  const distanceFromUser = selectedPOI?.distanceFromUser()?.toFixed(1) ?? false;

  // ICON
  const CategoryIcon: JSX.Element | undefined =
    selectedPOI?.createCategoryIcon();

  return (
    <div
      className={`modal-container ${
        selectedPOI ? "modal-visible" : "modal-hidden"
      } d-flex flex-column col-3 m-4 p-3
      bg-black text-white rounded-4`}
    >
      {/* HEADER */}
      <div className="d-flex">
        {/* ICON */}
        <div className="me-4">
          {CategoryIcon && (
            <div className="bg-primary p-2 d-inline-flex align-items-center justify-content-center rounded-circle">
              {CategoryIcon}
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
      {/* MIDDLE BANNER */}
      <div
        className="my-3 p-2 border border-dark rounded-3"
        style={{ backgroundColor: "#1f1f1f" }}
      >
        Misc Tags Go Here
      </div>
      <h5>{address}</h5>
      {/* MORE DETAILS BUTTON */}
      {website && (
        <a href={website} target="_blank" rel="noopener noreferrer">
          <button
            className="w-100 mt-3 p-3 border border-dark rounded-3"
            style={{ backgroundColor: "#1f1f1f" }}
          >
            <h5>More Details</h5>
          </button>
        </a>
      )}
    </div>
  );
};

export default POIDetailsModal;
