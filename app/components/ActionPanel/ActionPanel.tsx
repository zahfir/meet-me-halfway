"use client";
import React from "react";
import Image from "next/image";
import useMapStore from "@/app/state/useMapStore";

import PersonListItem from "@/app/components/ActionPanel/PersonListItem/PersonListItem";
import AddressSearch from "@/app/components/AddressSearch/AddressSearch";
import CategoryButtonRow from "@/app/components/PlaceCategoryButtons/CategoryButtonRow";
import RadiusSlider from "@/app/components/RadiusSlider";
import Spinner from "@/app/components/Basics/Spinner";

import { createPerson } from "@/app/utils/personUtils";
import Address from "@/app/models/Address";
import { PlaceCategory } from "@/app/constants/overpass/overpassPlaceCategories";
import logo from "@/app/assets/images/halfway-logo.png";

import "./ActionPanel.css";

/**
 * The `ActionPanel` component is a React functional component that renders the left panel of the application.
 * It includes a header with the app logo, an address search input, a list of people, and an area search section.
 *
 * The component interacts with the `useMapStore` state to manage people, meeting areas, and points of interest (POIs).
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
const ActionPanel: React.FC = () => {
  const { addPerson, clearPOIs, refreshPOIs } = useMapStore();
  const meetingArea = useMapStore((state) => state.meetingArea);
  const people = useMapStore((state) => state.people);
  const selectedPOI = useMapStore((state) => state.selectedPOI);

  const buildPeopleList = () => {
    return (
      <ul className="list-group m-0 p-0 border-0">
        {people.map((person) => (
          <PersonListItem key={person.id} person={person} />
        ))}
      </ul>
    );
  };

  const onAddressSelect = (address: Address) => {
    try {
      const person = createPerson(address);
      if (!person) return;

      addPerson(person);
    } catch (error) {
      console.error("Error creating person:", error);
    }
  };

  const onCategoryButtonClick = (categoryValue: string) => {
    const categoryEntry = Object.values(PlaceCategory).find(
      (value) => value === categoryValue
    );
    if (!categoryEntry || !meetingArea) return;

    if (meetingArea.placeCategories.has(categoryEntry)) {
      meetingArea.placeCategories.delete(categoryEntry);
    } else {
      meetingArea.placeCategories.add(categoryEntry);
    }

    useMapStore.setState({ meetingArea: meetingArea });
    selectedPOI?.handleMarkerClick();
    clearPOIs(meetingArea);
    refreshPOIs(meetingArea);
  };

  return (
    <div className="d-flex flex-column col-12 col-md-3 h-100">
      {/* LEFT PANEL */}
      <div
        className="person-section position-relative px-4 pb-4 d-flex flex-column p-0 bg-black bg-opacity-75 overflow-y-auto"
        style={{
          boxShadow: "4px 0px 8px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* HEADER */}
        <div className="m-2 py-2 d-flex justify-content-center align-items-center gap-2">
          <Image src={logo} alt="App Logo" width={60} height={60} />
          <h4 className="text-light">MEET ME HALFWAY</h4>
        </div>
        {/* PEOPLE LIST */}
        <AddressSearch onAddressSelect={onAddressSelect} />
        {buildPeopleList()}
      </div>
      {/* BOTTOM - AREA SEARCH */}
      <div className="p-4 position-relative bg-black d-flex flex-column gap-2 mt-auto">
        {meetingArea?.isOverpassLoading && (
          <div className="loading-spinner">
            <Spinner />
          </div>
        )}
        <div
          className={meetingArea?.isOverpassLoading ? "overlay-content" : ""}
        >
          <h5 className="text-light">Area Search</h5>
          <CategoryButtonRow onCategoryClick={onCategoryButtonClick} />
          <RadiusSlider
            min={1}
            max={10}
            step={1}
            defaultValue={meetingArea?.radius ?? 1}
          />
        </div>
      </div>
    </div>
  );
};

export default ActionPanel;
