"use client";
import React, { useState } from "react";
import { SearchBox } from "@mapbox/search-js-react";
import useMapStore from "@/app/state/useMapStore";
import { SearchBoxRetrieveResponse } from "@mapbox/search-js-core";
import { MAPBOX_ACCESS_TOKEN } from "@/app/page";
import PersonListItem from "./PersonListItem";
import Person from "@/app/models/Person";

const PersonSection: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const { addPerson } = useMapStore();

  const createPerson = (selectedAddress: SearchBoxRetrieveResponse) => {
    return new Person(selectedAddress);
  };

  const handleAddressSelect = (selectedAddress: SearchBoxRetrieveResponse) => {
    const person = createPerson(selectedAddress);
    addPerson(person);
    setSearchText("");
  };

  const handleSearchChange = (newValue: string) => {
    setSearchText(newValue);
  };

  const buildListItem = (person: Person) => {
    return (
      <li
        key={person.address.features[0].properties.address}
        className="list-group-item"
      >
        <PersonListItem person={person} />
      </li>
    );
  };

  const buildPeopleList = () => {
    const people = useMapStore.getState().people;
    return (
      <ul className="list-group">
        {people.map((person, _) => buildListItem(person))}
      </ul>
    );
  };

  return (
    <div className="row h-100">
      {/* List of People */}
      <div
        className="position-relative col-3 p-3"
        style={{ backgroundColor: "black", opacity: 0.85 }}
      >
        {buildPeopleList()}
      </div>
      {/* Search Box */}
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

export default PersonSection;
