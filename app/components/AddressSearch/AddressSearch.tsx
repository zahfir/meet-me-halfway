import React, { useState, useEffect, FC } from "react";
import SearchIcon from "../../assets/icons/searchIcon";
import CancelIcon from "../../assets/icons/cancelIcon";
import "./AddressSearch.css";
import { NominatimResult } from "../../types/nominatimJSONResponseType";
import { fetchAddressSuggestions } from "../../utils/nominatimUtils";
import AddressSearchListItemContent from "./AddressSearchListItemContent";
import Address from "@/app/models/Address";
import useDebounce from "@/app/hooks/useSearch";

interface AddressSearchProps {
  onAddressSelect: (selectedAddress: Address) => void;
}

const AddressSearch: FC<AddressSearchProps> = ({ onAddressSelect }) => {
  const [query, setQuery] = useState<string>("");
  const [searchSuggestions, setSearchSuggestions] = useState<Address[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const debouncedQuery = useDebounce(query, 500);

  const searchAddress = async (query: string) => {
    try {
      const response = await fetchAddressSuggestions(query);
      const data: NominatimResult[] = await response.json();
      const suggestedAddresses = data.map((result) => new Address(result));
      setSearchSuggestions(suggestedAddresses);
      setHighlightedIndex(-1);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // Debounce queries to prevent API spamming
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.trim()) {
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

  return (
    <div className="position-relative mt-1">
      {/* Search Input with Icons */}
      <div className="input-group" style={{ backgroundColor: "#1f1f1f" }}>
        {/* Leading Search Icon */}
        <span className="input-group-text bg-transparent border-0 m-2">
          <SearchIcon color="#888888" />
        </span>
        <input
          type="text"
          placeholder="Add locations"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-control text-white px-0 m-0 border-0 rounded-0"
          onKeyDown={handleKeyDown}
          style={{
            backgroundColor: "#1f1f1f",
            outline: "none",
            boxShadow: "none",
          }}
        />
        {query && (
          <span
            className="input-group-text bg-transparent text-white border-0"
            onClick={clearAddressSearch}
            style={{ cursor: "pointer", backgroundColor: "#1f1f1f" }}
          >
            <CancelIcon color="#ffffff" />
          </span>
        )}
      </div>

      {/* List of suggestions */}
      {searchSuggestions.length > 0 && (
        <ul
          className="list-group w-100 mt-2 py-2 px-2"
          style={{ backgroundColor: "#1f1f1f" }}
        >
          {searchSuggestions.map((address, index) => (
            <li
              key={index}
              className={`list-group-item text-white border-0 ${
                index === highlightedIndex ? "active" : ""
              }`}
              onClick={() => handleSelect(address)}
              style={{
                cursor: "pointer",
                backgroundColor:
                  index === highlightedIndex ? "#111111" : "#1f1f1f",
              }}
            >
              <AddressSearchListItemContent address={address} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressSearch;
