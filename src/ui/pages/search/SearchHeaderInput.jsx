import React, { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "./useDebouncedCallback";

const SearchHeaderInput = ({
  handleSearchInput,
  onKeyDown,
  value,
  children,
  isFetching,
}) => {
  const [searchText, setSearchText] = useState(value);
  const propagateChangeOfValue = useDebouncedCallback(
    (value) => handleSearchInput({ target: { value } }),
    200
  );

  useEffect(() => {
    setSearchText(value);
  }, [value]);

  const searchInput = useRef(null);
  useEffect(() => {
    searchInput.current.focus();
  }, []);

  const searchTextColor = propagateChangeOfValue.isPending() || isFetching
      ? "#737373"
      : "unset";

  const onChange = (event) => {
    setSearchText(event.target.value);
    propagateChangeOfValue(event.target.value);
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <input
        onChange={onChange}
        id="searchInputText"
        onKeyDown={onKeyDown}
        style={{
          color: searchTextColor,
        }}
        placeholder="Search for Equipment, Work Orders, Parts, ..."
        value={searchText}
        ref={(input) => {
          searchInput.current = input;
        }}
      />
      {children}
    </div>
  );
};

export default SearchHeaderInput;
