"use client";
import React from "react";
import useMapStore from "@/app/state/useMapStore";
import PersonListItem from "./PersonListItem";
import AddressSearch from "../AddressSearch/AddressSearch";
import { createPerson } from "@/app/utils/personUtils";
import Address from "@/app/models/Address";
import CategoryButtonRow from "@/app/components/PlaceCategoryButtons/CategoryButtonRow";
import { PlaceCategory } from "@/app/constants/overpass/overpassPlaceCategories";
import Image from "next/image";
import logo from "@/app/assets/images/halfway-logo.jpg";
import RadiusSlider from "../RadiusSlider";

const PersonSection: React.FC = () => {
  const { addPerson, clearPOIs, refreshPOIs } = useMapStore();
  const meetingArea = useMapStore((state) => state.meetingArea);

  const buildPeopleList = () => {
    const people = useMapStore.getState().people;
    return (
      <ul className="list-group m-0 p-0 border-0">
        {people.map((person) => (
          <PersonListItem key={person.id} person={person} />
        ))}
      </ul>
    );
  };

  const onFindClick = async () => {
    if (!meetingArea) return;
    clearPOIs(meetingArea);
    await refreshPOIs(meetingArea);
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
    clearPOIs(meetingArea);
    refreshPOIs(meetingArea);
  };

  return (
    <div className="row h-100">
      {/* LEFT PANEL */}
      <div
        className="px-4 d-flex flex-column col-3 p-0 bg-black opacity-30"
        style={{
          opacity: 0.85,
          boxShadow: "4px 0px 8px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* HEADER */}
        <div className="m-2 py-2 d-flex justify-content-center align-items-center gap-2">
          <Image
            src={logo}
            alt="App Logo"
            width={50}
            height={50}
            style={{ borderRadius: "50%" }}
          />
          <h4 className="text-light">MEET ME HALFWAY</h4>
        </div>
        {buildPeopleList()}
        <AddressSearch onAddressSelect={onAddressSelect} />
        <RadiusSlider
          min={1}
          max={50}
          step={1}
          defaultValue={meetingArea?.radius ?? 1}
        />
        <button className="btn btn-primary mt-auto" onClick={onFindClick}>
          Find
        </button>
      </div>
      <div className="col-3 p-2">
        <CategoryButtonRow onCategoryClick={onCategoryButtonClick} />
      </div>
    </div>
  );
};

export default PersonSection;
