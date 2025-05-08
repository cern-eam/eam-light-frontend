import React, { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const SearchHeaderInput = ({
  handleSearchInput,
  onKeyDown,
  value,
  children,
  isFetching,
}) => {
  const [searchText, setSearchText] = useState(value);
  const propagateChangeOfValue = useDebouncedCallback(
    () => handleSearchInput({ target: { value: searchText } }),
    200
  );

  useEffect(propagateChangeOfValue, [searchText]);

  useEffect(() => {
    setSearchText(value);
  }, [value]);

  const searchInput = useRef(null);
  useEffect(() => {
    searchInput.current.focus();
  }, []);

  const searchTextColor =
    (value === searchText && isFetching) || value !== searchText
      ? "#737373"
      : "unset";

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <input
        onChange={({ target: { value } }) => setSearchText(value)}
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
