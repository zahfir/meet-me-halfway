import {
  CategoryIconMap,
  PlaceCategory,
} from "@/app/constants/overpass/overpassPlaceCategories";
import useMapStore from "@/app/state/useMapStore";
import React from "react";

/**
 * CategoryButtonRow component takes a callback function to handle category button toggles.
 * This callback function takes the string value of the PlaceCategory enum.
 */
interface CategoryButtonRowProps {
  onCategoryClick: (category: string) => void;
}

const CategoryButtonRow: React.FC<CategoryButtonRowProps> = ({
  onCategoryClick,
}) => {
  const meetingArea = useMapStore((state) => state.meetingArea);
  const allCategories: string[] = Object.values(PlaceCategory);

  const getButtonColor = (category: string): string => {
    if (
      meetingArea &&
      meetingArea.placeCategories.has(category as PlaceCategory)
    ) {
      return "btn-primary";
    }
    return "btn-light";
  };

  return (
    <fieldset className="d-flex gap-2">
      {Array.from(allCategories).map((category) => (
        <button
          key={category}
          type="button"
          className={`btn rounded ${getButtonColor(category)}`}
          onClick={() => onCategoryClick(category)}
        >
          {
            // Dynamically render the icon based on the category value
            React.createElement(CategoryIconMap[category as PlaceCategory])
          }
        </button>
      ))}
    </fieldset>
  );
};

export default CategoryButtonRow;
