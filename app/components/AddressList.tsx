import React, { useState } from "react";
import { SearchBox } from "@mapbox/search-js-react";
import useMapStore from "@/app/state/useMapStore";
import { SearchBoxRetrieveResponse } from "@mapbox/search-js-core";
import { MAPBOX_ACCESS_TOKEN } from "@/app/page";

const AddressList: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const { addresses, addAddress } = useMapStore();

  const onRetrieve = (selectedAddress: SearchBoxRetrieveResponse) => {
    console.log("selected address", selectedAddress);
    addAddress(selectedAddress);
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

export interface AddressListProps {
  addresses: any[];
  setAddresses: any;
}

