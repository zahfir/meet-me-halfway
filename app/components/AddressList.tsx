import React, { useState } from "react";
import { AddressListProps } from "@/app/types/AddressListTypes";
import { SearchBox } from "@mapbox/search-js-react";
import { SearchBoxRetrieveResponse } from "@mapbox/search-js-core";

import { MAPBOX_ACCESS_TOKEN } from "@/app/page";

const AddressList: React.FC<AddressListProps> = ({
  addresses,
  setAddresses,
}) => {
  const [searchText, setSearchText] = useState("");

  const onRetrieve = (selectedAddress: SearchBoxRetrieveResponse) => {
    console.log("selected address", selectedAddress);
    setAddresses([...addresses, selectedAddress]);
    setSearchText("");
  };

  const handleSearchChange = (newValue: string) => {
    setSearchText(newValue);
  };

  const buildListItem = (label: string) => {
    return (
      <li
        key={label}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        {label}
      </li>
    );
  };

  const buildAddressList = (addresses: SearchBoxRetrieveResponse[]) => {
    const names = addresses.map(
      (address) => address.features[0].properties.name
    );
    return (
      <ul className="list-group">
        {names.map((address, index) => buildListItem(address))}
      </ul>
    );
  };

  return (
    <div className="address-list">
      {buildAddressList(addresses)}

      <SearchBox
        accessToken={MAPBOX_ACCESS_TOKEN}
        
        value={searchText}
        placeholder="Choose starting location"
        onChange={handleSearchChange}
        onRetrieve={onRetrieve}
        theme={{
          variables: {
            unit: "1rem",
            border: "1px solid black",
            boxShadow: "0 0 0 1px black",

          },

        }}
      />
    </div>
  );
};

export default AddressList;
