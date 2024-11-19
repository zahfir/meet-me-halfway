import {
  CategoryIconMap,
  PlaceCategory,
} from "@/app/constants/overpass/overpassPlaceCategories";
import useMapStore from "@/app/state/useMapStore";
import React from "react";

interface CategoryButtonRowProps {
  onCategoryClick: (category: string) => void;
}

/**
 * The `CategoryButtonRow` component renders a row of buttons, each representing a category.
 * When a button is clicked, it triggers a callback function to handle the category toggle.
 *
 * Props:
 * - onCategoryClick: A callback function that is called when a category button is clicked.
 *   This function receives the string value of the selected PlaceCategory enum as its argument.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {function} props.onCategoryClick - A callback function that handles category button toggles.
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <CategoryButtonRow onCategoryClick={(category) => console.log(category)} />
 */
const CategoryButtonRow: React.FC<CategoryButtonRowProps> = ({
  onCategoryClick,
}) => {
  const meetingArea = useMapStore((state) => state.meetingArea);
  const allCategories: string[] = Object.values(PlaceCategory);

  const getButtonColor = (category: string): string => {
    if (meetingArea?.placeCategories?.has(category as PlaceCategory)) {
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
