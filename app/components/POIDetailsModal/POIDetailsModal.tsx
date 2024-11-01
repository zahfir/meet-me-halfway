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

  const CategoryIcon: JSX.Element | undefined =
    selectedPOI?.createCategoryIcon(50);

  const smallIconSize = 24;
  const facility = selectedPOI?.facility();
  const FacilityIcon: JSX.Element | undefined = selectedPOI?.createFacilityIcon(
    facility,
    smallIconSize
  );

  const openStatus = isOpen
    ? closingTime
      ? `Open 'til ${closingTime}`
      : "Open 24/7"
    : "Closed now";

  return (
    <div
      className={`modal-container ${
        selectedPOI ? "modal-visible" : "modal-hidden"
      } d-flex gap-3 flex-column col-3 m-4 p-3
      bg-black text-white rounded-4`}
    >
      {/* HEADER */}
      <div className="d-flex">
        {/* ICON */}
        <div className="me-3">
          {CategoryIcon && (
            <div className="bg-primary p-2 d-inline-flex align-items-center justify-content-center rounded-circle">
              {CategoryIcon}
            </div>
          )}
        </div>
        {/* TEXT */}
        <div className="d-flex flex-column my-1 justify-content-evenly">
          <h5>{name}</h5>
          <div className="d-inline-flex">
            {!!distanceFromUser && distanceFromUser + " km"}
            <p className="mx-2 my-0 p-0">&bull;</p>
            <p className={`m-0 p-0 ${isOpen ? "text-success" : "text-danger"}`}>
              {openStatus}
            </p>
          </div>
        </div>
      </div>
      {/* MIDDLE BANNER */}
      {facility && (
        <div
          className="d-inline-flex p-2 border border-dark rounded-3"
          style={{ backgroundColor: "#1f1f1f" }}
        >
          <div className="d-inline-flex mx-2">
            {FacilityIcon} <div className="ms-2">{facility}</div>
            {/* MAYBE ICON CLUSTER (WHEELCHAIR, TOILET) */}
          </div>
        </div>
      )}
      <h5>{address}</h5>
      {/* MORE DETAILS BUTTON */}
      {website && (
        <a href={website} target="_blank" rel="noopener noreferrer">
          <button
            className="w-100 p-3 border border-dark rounded-3"
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
