import CoffeeIcon from "@/app/assets/icons/FacilityIcons/coffeeIcon";
import { IconProps } from "./overpassPlaceCategories";
import RestaurantIcon from "@/app/assets/icons/PlaceCategoryIcons/restaurantIcon";
import PizzaIcon from "@/app/assets/icons/FacilityIcons/pizzaIcon";

/**
 * Facilities is the parent of high-level service tags (e.g. "amenity" and "shop"),
 * that may hold values like "cafe" and "beauty".
 */

export enum Facility {
  // Amenities
  fast_food = "Fast Food",
  cafe = "Cafe",
  // Cuisines
  pizza = "Pizza",
}

/**
 * Maps Overpass responses to Facility
 */
export const FacilityResponseMap: { [key: string]: Facility } = {
  fast_food: Facility.fast_food,
  cafe: Facility.cafe,
  pizza: Facility.pizza,
};

/**
 * Maps Facility to Icon Component
 */
export const FacilityIconMap: {
  [key in Facility]: React.ComponentType<IconProps>;
} = {
  [Facility.fast_food]: RestaurantIcon,
  [Facility.cafe]: CoffeeIcon,
  [Facility.pizza]: PizzaIcon,
};
