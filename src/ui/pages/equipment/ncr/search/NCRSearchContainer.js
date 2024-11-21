import { connect } from "react-redux";
import NCRSearch from "./NCRSearch";
import { handleError } from "../../../../../actions/uiActions";

const NCRSearchContainer = connect(null, {
  handleError,
})(NCRSearch);

export default NCRSearchContainer;
