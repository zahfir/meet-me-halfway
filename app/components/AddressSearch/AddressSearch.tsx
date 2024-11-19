import React, { useState, useEffect, FC } from "react";

import { fetchAddressSuggestions } from "@/app/api/nominatimAddressFetch";
import { NominatimResult } from "@/app/types/nominatimResponse";
import { isValidNominatimResult } from "@/app/validation/NominatimValidator";

import Spinner from "@/app/components/Basics/Spinner";
import AddressSearchListItemContent from "./AddressSearchListItemContent/AddressSearchListItemContent";

import Address from "@/app/models/Address";
import useDebounce from "@/app/hooks/useSearch";

import SearchIcon from "@/app/assets/icons/ActionPanelIcons/searchIcon";
import CancelIcon from "@/app/assets/icons/ActionPanelIcons/cancelIcon";

import "./AddressSearch.css";

interface AddressSearchProps {
  onAddressSelect: (selectedAddress: Address) => void;
}

/**
 * The `AddressSearch` component is a React functional component that allows users to search for addresses using an input field.
 * It fetches address suggestions from an API and displays them in a dropdown list.
 * Users can select an address from the suggestions, which triggers the `onAddressSelect` callback.
 *
 * The component manages the search query, address suggestions, and input focus state.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {function} props.onAddressSelect - A callback function that is called when an address is selected from the suggestions.
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <AddressSearch onAddressSelect={(selectedAddress) => console.log(selectedAddress)} />
 *
 * @state {string} query - The current search query entered by the user.
 * @state {Address[]} searchSuggestions - An array of address suggestions fetched from the API.
 * @state {number} highlightedIndex - The index of the currently highlighted suggestion in the dropdown list.
 * @state {boolean} isInputFocused - A boolean indicating whether the input field is focused.
 * @state {boolean} isLoading - A boolean indicating whether the component is currently fetching address suggestions.
 * @state {string} debouncedQuery - The debounced version of the search query to limit the number of API calls.
 */
const AddressSearch: FC<AddressSearchProps> = ({ onAddressSelect }) => {
  const [query, setQuery] = useState<string>("");
  const [searchSuggestions, setSearchSuggestions] = useState<Address[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const iconSize = "1.5rem";
  const searchIconColor = "#888888";

  const searchAddress = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await fetchAddressSuggestions(query);
      const data: NominatimResult[] = await response.json();

      const validAddresses = data
        .filter((result: NominatimResult) => isValidNominatimResult(result))
        .map((result: NominatimResult) => new Address(result));

      setSearchSuggestions(validAddresses);
      setHighlightedIndex(-1);
      setIsLoading(false);
    } catch (error) {
      console.error("Error searching address:", error);
    }
  };

  // Debounce queries to prevent API spamming
  useEffect(() => {
    if (debouncedQuery?.trim()) {
      searchAddress(debouncedQuery);
    } else {
      setSearchSuggestions([]);
    }
  }, [debouncedQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) =>
        prevIndex < searchSuggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      handleSelect(searchSuggestions[highlightedIndex]);
    }
  };

  const clearAddressSearch = () => {
    setQuery("");
    setSearchSuggestions([]);
  };

  const handleSelect = (selectedAddress: Address) => {
    clearAddressSearch();
    onAddressSelect(selectedAddress);
  };

  const onSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsLoading(true);
  };

  return (
    <div className="position-relative mt-1">
      {/* INPUT */}
      <div className="input-group bg-dark border rounded-4 border-dark border-2">
        {/* Leading Icon */}
        <span className="input-group-text bg-transparent border-0 m-2">
          {isInputFocused && query && isLoading ? (
            <Spinner
              color={searchIconColor}
              width={iconSize}
              height={iconSize}
            />
          ) : (
            <SearchIcon
              color={searchIconColor}
              width={iconSize}
              height={iconSize}
            />
          )}
        </span>

        <input
          type="text"
          placeholder="Add locations"
          value={query}
          onChange={onSearchFieldChange}
          className="form-control text-white px-0 m-0 bg-transparent border-0"
          onKeyDown={handleKeyDown}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          style={{
            outline: "none",
            boxShadow: "none",
          }}
        />
        {/* Clear Search Field Button */}
        {query && (
          <span
            className="input-group-text bg-transparent text-white border-0"
            style={{ cursor: "pointer" }}
          >
            <button
              type="button"
              className="btn btn-outline-dark m-0 p-0 border-0"
              onClick={clearAddressSearch}
            >
              <CancelIcon color="#ffffff" />
            </button>
          </span>
        )}
      </div>

      {/* List */}
      {isInputFocused && query && !isLoading && (
        <ul className="list-group bg-dark w-100 mt-2 py-2 px-2">
          {/* List items */}
          {searchSuggestions.length > 0 ? (
            searchSuggestions.map((address, index) => {
              const isHighlighted = index === highlightedIndex;
              const active = isHighlighted ? "active" : "";
              const backgroundColor = isHighlighted ? "#111111" : "#1f1f1f";
              return (
                <li
                  key={index}
                  className={`list-group-item pe-auto text-white border-0 ${active}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(address)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: backgroundColor,
                  }}
                >
                  <AddressSearchListItemContent address={address} />
                </li>
              );
            })
          ) : (
            <li className="list-group-item bg-dark text-white border-0">
              <strong>No such places found...</strong>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AddressSearch;
