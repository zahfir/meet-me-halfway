import React from "react";
import useMapStore from "@/app/state/useMapStore";
import "./POIDetailsModal.css";
import POI from "@/app/models/POI";
import CancelIcon from "@/app/assets/icons/ActionPanelIcons/cancelIcon";

/**
 * POIDetailsModal component displays detailed information about a selected Point of Interest (POI).
 * It shows the POI's name, address, website, open status, distance from the user, and facility information.
 * The modal also includes a close button to hide the details.
 *
 * @component
 * @returns {JSX.Element} The rendered POIDetailsModal component.
 */
const POIDetailsModal: React.FC = () => {
  const selectedPOI: POI | null = useMapStore((state) => state.selectedPOI);

  const { name } = selectedPOI ?? {};
  const address = selectedPOI?.address();
  const website = selectedPOI?.website();
  const { isOpen, closingTime } = selectedPOI?.closingTimeToday() ?? {};
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

  const visibility = selectedPOI ? "modal-visible" : "modal-hidden";

  return (
    <div
      className={`modal-container ${visibility} d-flex gap-3 flex-column col-11 col-md-3 m-4 p-3
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
        {/* CLOSE BUTTON */}
        <button
          className="btn btn-dark p-0 align-self-start ms-auto"
          onClick={selectedPOI?.handleMarkerClick}
        >
          <CancelIcon />
        </button>
      </div>
      {/* MIDDLE BANNER */}
      {facility && (
        <div className="d-inline-flex bg-dark p-2 border border-dark rounded-3">
          <div className="d-inline-flex mx-2">
            {FacilityIcon} <div className="ms-2">{facility}</div>
          </div>
        </div>
      )}
      <h5>{address}</h5>
      {/* MORE DETAILS BUTTON */}
      {website && (
        <a href={website} target="_blank" rel="noopener noreferrer">
          <button className="w-100 p-3 bg-dark border border-dark rounded-3">
            <h5>More Details</h5>
          </button>
        </a>
      )}
    </div>
  );
};

export default POIDetailsModal;
