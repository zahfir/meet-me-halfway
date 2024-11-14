"use client";
import { FC, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Person from "@/app/models/Person";
import useMapStore from "@/app/state/useMapStore";
import TrashIcon from "@/app/assets/icons/PersonSectionIcons/trashIcon";
import CarIcon from "@/app/assets/icons/PersonSectionIcons/carIcon";
import { setRouteOpacityOnHover } from "@/app/utils/routeUtils";

interface PersonListItemProps {
  person: Person;
}

const PersonListItem: FC<PersonListItemProps> = ({ person }) => {
  const { removePerson } = useMapStore();
  const people = useMapStore((state) => state.people);
  const mapRef = useMapStore((state) => state.mapRef);

  const [isHover, setIsHover] = useState(false);

  const address = person.address;
  const addressLineOne =
    address.formattedAddressLineOne || address.display_name.split(",")[0];
  const addressLineTwo = address.formattedAddressLineTwo;

  const { distance, duration } = person.getRouteSummary();

  const handleMouseHover = (enter: boolean) => {
    setRouteOpacityOnHover(
      isHover,
      setIsHover,
      mapRef,
      people,
      person.id,
      enter
    );
  };

  return (
    <li
      key={person.id}
      className="list-group-item text-white bg-transparent p-4 border-0"
      onMouseEnter={() => handleMouseHover(true)}
      onMouseLeave={() => handleMouseHover(false)}
    >
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center ">
          {/* Mode of Transportation */}
          <span className="me-3">
            <CarIcon color={person.marker?._color} />
          </span>
          <div className="d-flex flex-column">
            {/* MIDDLE */}
            <strong>{addressLineOne}</strong>
            {addressLineTwo && (
              <label className="fw-light">{addressLineTwo}</label>
            )}
            {duration && distance ? (
              <div className="d-inline-flex">
                <strong className="me-2">Route:</strong>
                <label>{" " + duration + " mins"}</label>
                <label className="mx-2 my-0 p-0">&bull;</label>
                <label>{distance + " km"}</label>
              </div>
            ) : (
              people.length > 1 && <label>Route not available</label>
            )}
          </div>
        </div>
        <div className="d-flex align-items-center">
          {/* Delete button */}
          <button
            onClick={() => removePerson(person)}
            className="btn btn-link p-0"
          >
            <TrashIcon className="text-danger" />
          </button>
        </div>
      </div>
    </li>
  );
};

export default PersonListItem;
