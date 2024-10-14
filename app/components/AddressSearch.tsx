import React, { useState, useEffect, FC } from "react";
import SearchIcon from "../assets/icons/searchIcon";
import CancelIcon from "../assets/icons/cancelIcon";
import "./AddressSearch.css";

// Debounce hook to delay API calls
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

interface AddressSearchProps {
  onAddressSelect: (selectedAddress: NominatimResult) => void;
}

// TypeScript component for address search with autocomplete and keyboard navigation
const AddressSearch: FC<AddressSearchProps> = ({ onAddressSelect }) => {
  const [query, setQuery] = useState<string>(""); // Search query text state
  const [results, setResults] = useState<NominatimResult[]>([]); // Search suggestions state
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1); // Track the highlighted item
  const debouncedQuery = useDebounce(query, 500); // Debounced query to limit API calls

  // Function to fetch address data from Nominatim
  const searchAddress = async (query: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5`
      );
      const data: NominatimResult[] = await response.json();
      // console.log("Nominatim Search Result:", data);
      setResults(data);
      setHighlightedIndex(-1);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // Fetch new data whenever the debounced query changes
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.trim()) {
      searchAddress(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) =>
        prevIndex < results.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      onAddressSelect(results[highlightedIndex]);
    }
  };

  const clearAddressSearch = () => {
    setQuery("");
    setResults([]);
  };

  const handleSelect = (selectedAddress: NominatimResult) => {
    clearAddressSearch();
    onAddressSelect(selectedAddress);
  };

  return (
    <div className="position-relative">
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
            className="input-group-text bg-transparent border-0 text-white"
            onClick={clearAddressSearch}
            style={{ cursor: "pointer", backgroundColor: "#1f1f1f" }}
          >
            <CancelIcon color="#ffffff" />
          </span>
        )}
      </div>

      {/* Render search suggestions */}
      {results.length > 0 && (
        <ul className="list-group w-100">
          {results.map((result, index) => (
            <li
              key={index}
              className={`list-group-item ${
                index === highlightedIndex ? "active" : ""
              }`}
              onClick={() => handleSelect(result)}
              style={{ cursor: "pointer" }}
            >
              {result.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressSearch;

export interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}
