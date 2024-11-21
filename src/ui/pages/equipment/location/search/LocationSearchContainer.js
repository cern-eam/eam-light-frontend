import { connect } from "react-redux";
import LocationSearch from "./LocationSearch";
import { handleError } from "../../../../../actions/uiActions";

const LocationSearchContainer = connect(null, {
    handleError
})(LocationSearch);

export default LocationSearchContainer;
