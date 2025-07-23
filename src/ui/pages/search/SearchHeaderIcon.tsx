import * as React from "react";

const SearchHeaderIcon = ({ searchBoxUp }) => {
  return (
    <>
      <img
        src="images/eamlight_logo.png"
        alt="EAM Light Logo"
        style={{ paddingLeft: 20, paddingRight: 10 }}
      />
      <div
        id="searchBoxLabelGreeting"
        className={
          searchBoxUp
            ? "searchBoxLabelGreetingSearch"
            : "searchBoxLabelGreetingHome"
        }
      >
        <span
          className="FontLatoBlack Fleft Fs30 DispBlock"
          style={{ color: "#02a2f2" }}
        >
          Welcome to EAM Light
        </span>
      </div>
    </>
  );
};

export default SearchHeaderIcon;
