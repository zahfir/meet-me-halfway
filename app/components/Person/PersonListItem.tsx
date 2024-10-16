"use client";
import { FC } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Person from "@/app/models/Person";
import useMapStore from "@/app/state/useMapStore";
import TrashIcon from "@/app/assets/icons/trashIcon";
import CarIcon from "@/app/assets/icons/carIcon";

interface PersonListItemProps {
  person: Person;
}

const PersonListItem: FC<PersonListItemProps> = ({ person }) => {
  const { removePerson } = useMapStore();
  const address = person.address.display_name;
  // WEIGHT SLIDER STATE
  // const [dragging, setDragging] = useState(false);
  // const [currentWeight, setCurrentWeight] = useState(person.weight);

  // const handleDrag = (e: MouseEvent) => {
  //   if (dragging) {
  //     const newWeight = computeNewWeight(currentWeight, e.movementX);
  //     setCurrentWeight(newWeight);
  //     updatePersonWeight(person.id, newWeight);
  //   }
  // };

  // SLIDER STYLING
  // const fillPercentage = Math.min(100, (currentWeight / 100) * 100);
  // const fillColorWithOpacity = person.marker?._color + "40";

  return (
    <li
      key={person.id}
      className="list-group-item text-white bg-transparent p-4 border-light border-opacity-25"
      // style={{
      //   background: `linear-gradient(to right, ${fillColorWithOpacity} ${fillPercentage}%, transparent ${fillPercentage}%)`,
      //   cursor: dragging ? "grabbing" : "grab",
      // }}
      // onMouseDown={() => setDragging(true)}
      // onMouseUp={() => setDragging(false)}
      // onMouseMove={(e) => handleDrag(e)}
    >
      <div className="d-flex align-items-center justify-content-between">
        {/* LEFT */}
        <div className="d-flex align-items-center ">
          {/* Mode of Transportation */}
          <span className="me-3">
            <CarIcon color={person.marker?._color} />
          </span>
          <div className="">
            {/* Address */}
            <strong>{address}</strong>
          </div>
        </div>

        {/* RIGHT */}
        <div className="d-flex align-items-center">
          {/* Weight Text */}
          {/* <small className="me-3 opacity-75">
            Weight {Math.round(currentWeight)}
          </small> */}

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
