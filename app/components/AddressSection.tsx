"use client";
import React, { useState } from "react";
import { SearchBox } from "@mapbox/search-js-react";
import useMapStore from "@/app/state/useMapStore";
import { SearchBoxRetrieveResponse } from "@mapbox/search-js-core";
import { MAPBOX_ACCESS_TOKEN } from "@/app/page";
import AddressListItem from "./AddressListItem";

const AddressSection: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const { addresses, addAddress, removeAddress } = useMapStore();

  const handleAddressSelect = (selectedAddress: SearchBoxRetrieveResponse) => {
    addAddress(selectedAddress);
    setSearchText("");
  };

  const handleAddressDelete = (address: SearchBoxRetrieveResponse) => {
    removeAddress(address);
    buildAddressList(useMapStore.getState().addresses);
  };

  const handleSearchChange = (newValue: string) => {
    setSearchText(newValue);
  };

  const buildListItem = (address: SearchBoxRetrieveResponse) => {
    return (
      <li
        key={address.features[0].properties.full_address}
        className="list-group-item"
      >
        <AddressListItem
          address={address}
          onDelete={() => handleAddressDelete(address)}
          markerColor="red"
        />
      </li>
    );
  };

  const buildAddressList = (addresses: SearchBoxRetrieveResponse[]) => {
    // const names = addresses.map(
    //   (address) => address.features[0].properties.name
    // );
    return (
      <ul className="list-group">
        {addresses.map((address, index) => buildListItem(address))}
      </ul>
    );
  };

  return (
    <div className="row h-100">
      <div
        className="position-relative col-3 p-3"
        style={{ backgroundColor: "black", opacity: 0.85 }}
      >
        {buildAddressList(addresses)}
      </div>

      <div className="col-3 p-2">
        <SearchBox
          accessToken={MAPBOX_ACCESS_TOKEN}
          value={searchText}
          placeholder="Add locations"
          onChange={handleSearchChange}
          onRetrieve={handleAddressSelect}
          theme={{
            variables: {
              border: "1px solid #333333",
              borderRadius: "6px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
              colorBackground: "#1f1f1f",
              colorBackgroundHover: "#333333",
              colorBackgroundActive: "#000000",
              colorText: "#ffffff",
              padding: "1em",
            },
            cssText: `
              .Input:hover { opacity: 0.85; }
              .Input { color: #ffffff; }
              .Input:focus { color: #ffffff; }
            `,
          }}
        />
      </div>
    </div>
  );
};

export default AddressSection;

export interface AddressListProps {
  addresses: any[];
  setAddresses: any;
}
