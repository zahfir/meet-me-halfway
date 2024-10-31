import { IconProps } from "./overpassPlaceCategories";
import DrinksIcon from "@/app/assets/icons/PlaceCategoryIcons/drinkIcon";
import RestaurantIcon from "@/app/assets/icons/PlaceCategoryIcons/restaurantIcon";

export enum Amenity {
  fast_food = "Fast Food",
  cafe = "Cafe",
}

export const AmenityResponseMap: { [key: string]: Amenity } = {
  fast_food: Amenity.fast_food,
  cafe: Amenity.cafe,
};

export const AmenityIconMap: {
  [key in Amenity]: React.ComponentType<IconProps>;
} = {
  [Amenity.fast_food]: RestaurantIcon,
  [Amenity.cafe]: DrinksIcon,
};
