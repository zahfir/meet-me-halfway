import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Person from "@/app/models/Person";
import useMapStore from "@/app/state/useMapStore";

interface PersonListItemProps {
  person: Person;
}

const PersonListItem: React.FC<PersonListItemProps> = ({ person }) => {
  const { removePerson } = useMapStore();
  const address = person.address.features[0].properties.address;
  return (
    <div className="d-flex justify-content-between align-items-center w-100">
      <span>{address}</span>
      <button
        onClick={() => removePerson(person)}
        className="btn btn-dark btn-sm"
      >
        X
      </button>
    </div>
  );
};

export default PersonListItem;
