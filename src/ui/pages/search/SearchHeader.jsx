import * as React from "react";
import FontIcon from "@mui/material/Icon";
import EAMCheckbox from "eam-components/dist/ui/components/inputs-ng/EAMCheckbox";
import EAMBarcodeScanner from "eam-components/dist/ui/components/inputs-ng/components/EAMBarcodeScanner";

const SEARCH_TYPES = {
  PART: {
    text: "Parts",
    value: "PART",
    code: "PART",
  },
  EQUIPMENT_TYPES: {
    text: "Equipment",
    value: "A,P,S,L",
    code: "EQUIPMEN",
  },
  JOB: {
    text: "Work Orders",
    value: "JOB",
    code: "JOB",
  },
};

const searchIconStyle = {
  color: "#02a2f2",
  fontSize: 25,
  position: "absolute",
  right: -4,
  top: 5,
};

export default class SearchHeader extends React.Component {
  state = {
    searchOn: Object.values(SEARCH_TYPES).map((v) => v.value),
    isPhoneScreen: false,
  };

  componentDidMount() {
    this.searchInput.focus();
  }

  renderTypeCheckbox(searchType) {
    const { searchOn, setState } = this.state;
    return (
      <EAMCheckbox
        key={searchType.code}
        label={searchType.text}
        value={searchOn.includes(searchType.value).toString()}
        rootStyle={{ flex: "0 1 auto" }}
        onChange={() => {
          this.setState(
            (prevState) => {
              const prevSearchOn = prevState.searchOn;

              return {
                searchOn: prevSearchOn.includes(searchType.value)
                  ? prevSearchOn.filter((val) => val !== searchType.value)
                  : [...prevSearchOn, searchType.value],
              };
            },
            () =>
              this.handleSearchInput({
                target: { value: this.props.keyword },
              })
          );
        }}
      />
    );
  }

  renderIcon = () => (
    <>
      <img
        src="images/eamlight_logo.png"
        alt="EAM Light Logo"
        style={{ paddingLeft: 20, paddingRight: 10 }}
      />
      <div
        id="searchBoxLabelGreeting"
        className={
          this.props.searchBoxUp
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

  renderInput = () => {
    const entityTypes = this.state.searchOn.join(",");
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          onInput={this.handleSearchInput.bind(this)}
          id="searchInputText"
          onKeyDown={this.props.onKeyDown}
          value={this.props.keyword}
          style={{ textTransform: "uppercase" }}
          ref={(input) => {
            this.searchInput = input;
          }}
        />
        <EAMBarcodeScanner
          onChange={(value) => this.props.fetchDataHandler(value, entityTypes)}
        />
      </div>
    );
  };

  renderFilters = () => {
    const { showTypes } = this.props;
    return (
      <>
        {showTypes && (
          <div
            className="searchTypes"
            style={
              this.state.isPhoneScreen
                ? { flexDirection: "column", height: "auto" }
                : {}
            }
          >
            {Object.values(SEARCH_TYPES).map(
              this.renderTypeCheckbox.bind(this)
            )}
          </div>
        )}
        <label id="searchPlaceHolder">
          {!this.props.keyword &&
            "Search for Equipment, Work Orders, Parts, ..."}
        </label>
      </>
    );
  };

  render() {
    return (
      <div
        id="searchBox"
        className={
          this.props.searchBoxUp
            ? "searchBox searchBoxSearch"
            : "searchBox searchBoxHome"
        }
        ref={(searchBoxDiv) => (this.searchBoxDiv = searchBoxDiv)}
        style={
          this.props.searchBoxUp && this.state.isPhoneScreen
            ? { height: "fit-content", paddingTop: "5px", paddingBottom: "5px" }
            : {}
        }
      >
        {this.props.searchBoxUp && this.state.isPhoneScreen ? (
          <div
            id="searchBoxInput"
            className="searchBoxInputSearch"
            style={{ width: "100%" }}
          >
            {this.renderInput()}
            <div
              id="searchBoxLabel"
              className="searchBoxLabelHome"
              style={{ justifyContent: "left" }}
            >
              {this.renderIcon()}
              {this.renderFilters()}
            </div>
          </div>
        ) : (
          <>
            <div id="searchBoxLabel" className="searchBoxLabelHome">
              {this.renderIcon()}
            </div>
            <div
              id="searchBoxInput"
              className={
                this.props.searchBoxUp
                  ? "searchBoxInputSearch"
                  : "searchBoxInputHome"
              }
            >
              {this.renderInput()}
              {this.renderFilters()}
            </div>
          </>
        )}
      </div>
    );
  }

  handleSearchInput = (event) => {
    this.props.fetchDataHandler(
      event.target.value,
      this.state.searchOn.join(",")
    );
  };
}
