import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { SearchBoxRetrieveResponse } from "@mapbox/search-js-core";

interface AddressListItemProps {
  address: SearchBoxRetrieveResponse;
  onDelete: (deleted_addr: SearchBoxRetrieveResponse) => void;
  markerColor: string;
}

const AddressListItem: React.FC<AddressListItemProps> = ({
  address,
  onDelete,
  markerColor,
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center w-100">
      <span>{address.features[0].properties.address}</span>
      <button onClick={() => onDelete(address)} className="btn btn-dark btn-sm">
        X
      </button>
    </div>
  );
};

export default AddressListItem;
