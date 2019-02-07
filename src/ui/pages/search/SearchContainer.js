import { connect } from 'react-redux'
import Search from './Search'
import { handleError } from "../../../actions/uiActions";

const mapStateToProps = (state, ownProps) => {
  return {

  }
};

const SearchContainer = connect(
  mapStateToProps, {
      handleError
    }
)(Search);

export default SearchContainer
