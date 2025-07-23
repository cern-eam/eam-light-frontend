import React, { useEffect, useRef, useState, useMemo } from "react";
import debounce from "lodash/debounce";

const SearchHeaderInput = ({
  handleSearchInput,
  onKeyDown,
  value,
  children,
  isFetching,
}) => {
  const [searchText, setSearchText] = useState(value);
  const propagateChangeOfValue = useMemo(
    () =>
      debounce((value) => handleSearchInput({ target: { value } }), 200, {
        leading: false,
        trailing: true,
      }),
    []
  );

  useEffect(() => {
    setSearchText(value);
  }, [value]);

  const searchInput = useRef(null);
  useEffect(() => {
    searchInput.current.focus();
  }, []);

  const searchTextColor =
    isFetching || value !== searchText ? "#737373" : "unset";
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
          transition: "color 0.2s ease-in-out",
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
