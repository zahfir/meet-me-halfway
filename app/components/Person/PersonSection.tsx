"use client";
import React from "react";
import useMapStore from "@/app/state/useMapStore";
import PersonListItem from "./PersonListItem";
import {
  createPOIObjectsFromResponse,
  getPOIs,
} from "@/app/api/overpassPlacesFetch";
import AddressSearch from "../AddressSearch/AddressSearch";
import { createPerson } from "@/app/utils/personUtils";
import Address from "@/app/models/Address";
import CategoryButtonRow from "@/app/components/PlaceCategoryButtons/CategoryButtonRow";
import { PlaceCategory } from "@/app/constants/overpassPlaceCategories";

const PersonSection: React.FC = () => {
  const { addPerson, clearPOIs } = useMapStore();
  const meeting = useMapStore((state) => state.meetingArea);

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
    if (!meeting) return;
    // CLEAR OLD POIS SOMEHOW
    clearPOIs(meeting);
    console.log("pois after click and clear", meeting.POIs);
    const pois = await getPOIs(meeting);
    /**
     * INSERT HERE HANDLER THAT CREATES POI OBJECTS FROM FETCHED DATA
     * AND UPDATES MEETING AREA STATE WITH POI OBJECTS ARRAY
     *  **/

    console.log(pois);
    const poiObjects = createPOIObjectsFromResponse(pois, meeting);
    console.log(poiObjects);
    poiObjects.forEach((poi) => {
      poi.createMarkerOnMap();
    });

    //ADD TO MEETING AREA AS WELL
    meeting.POIs = poiObjects;
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
    const meeting = useMapStore.getState().meetingArea;
    const categoryEntry = Object.values(PlaceCategory).find(
      (value) => value === categoryValue
    );
    if (!categoryEntry || !meeting) return;

    if (meeting.placeCategories.has(categoryEntry)) {
      meeting.placeCategories.delete(categoryEntry);
    } else {
      meeting.placeCategories.add(categoryEntry);
    }

    useMapStore.setState({ meetingArea: meeting });
    console.log("Meeting Area State:", useMapStore.getState().meetingArea);
  };

  return (
    <div className="row h-100">
      {/* List of People */}
      <div
        className="d-flex flex-column col-3 p-0 bg-black opacity-30"
        style={{
          opacity: 0.85,
          boxShadow: "4px 0px 8px rgba(0, 0, 0, 0.5)",
        }}
      >
        {buildPeopleList()}
        <AddressSearch onAddressSelect={onAddressSelect} />
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
