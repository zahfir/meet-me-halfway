import RestaurantIcon from "@/app/assets/icons/restaurantIcon";
import DrinksIcon from "@/app/assets/icons/drinkIcon";
import ShoppingIcon from "@/app/assets/icons/shoppingIcon";

export enum PlaceCategory {
  restaurant = "restaurant",
  drinks = "drinks",
  shopping = "shopping",
}

export const CategoryQueryMap: { [key in PlaceCategory]: string } = {
  [PlaceCategory.restaurant]: "[amenity=restaurant]",
  [PlaceCategory.drinks]: "[amenity=bar]",
  [PlaceCategory.shopping]: "[building=retail]",
};

/**
 * Maps place categories to their key, value pairs as seen in overpass json responses
 */
export const CategoryResponseMap: { [key in PlaceCategory]: string[] } = {
  [PlaceCategory.restaurant]: ["amenity", "restaurant"],
  [PlaceCategory.drinks]: ["amenity", "bar"],
  [PlaceCategory.shopping]: ["building", "retail"],
};

export const CategoryIconMap: {
  [value in PlaceCategory]: React.ComponentType;
} = {
  [PlaceCategory.restaurant]: RestaurantIcon,
  [PlaceCategory.drinks]: DrinksIcon,
  [PlaceCategory.shopping]: ShoppingIcon,
};
