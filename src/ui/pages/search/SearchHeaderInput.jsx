import React, { useEffect, useRef, useState } from "react";

const SearchHeaderInput = ({
  handleSearchInput,
  onKeyDown,
  value,
  isFetching,
  children,
}) => {
  const [searchText, setSearchText] = useState(value);
  const [searchTextColor, setSearchTextColor] = useState("unset");

  const searchInput = useRef(null);

  useEffect(() => {
    handleSearchInput({ target: { value: searchText } });
  }, [searchText]);

  useEffect(() => {
    searchInput.current.focus();
  }, []);

  const previousValue = useRef(value);
  useEffect(() => {
    if (previousValue.current !== value && isFetching) {
      setSearchTextColor("#737373");
    }

    if (!isFetching) setSearchTextColor("unset");
    previousValue.current = value;
  }, [isFetching]);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <input
        onChange={({ target: { value } }) => setSearchText(value)}
        id="searchInputText"
        style={{ color: searchTextColor }}
        onKeyDown={onKeyDown}
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
