import { connect } from "react-redux";
import NCRSearch from "./NCRSearch";
import { handleError } from "../../../../../actions/uiActions";

function mapStateToProps(state) {
  return {
    ncrScreen:
      state.application.userData.screens[
        state.application.userData.assetScreen
      ],
  };
}

const NCRSearchContainer = connect(mapStateToProps, {
  handleError,
})(NCRSearch);

export default NCRSearchContainer;
