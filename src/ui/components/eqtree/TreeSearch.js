// @flow
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ExpandLess from '@material-ui/core-icons/ExpandLess';
import ExpandMore from '@material-ui/core-icons/ExpandMore';
import './TreeSearch.css';

type Props = {
  searchFocusIndex: number,
  searchFoundCount: number,
  onClickPrevMatch: void => void,
  onClickNextMatch: void => void,
  onFilterChange: string => void
};

type State = {
  searchPhrase: string,
  appliedSearchPhrase: ?string,
  navigationVisible: boolean
};

const ICON_BUTTON_STYLE = {
  width: '24px',
  height: '24px'
};

export default class TreeSearch extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchPhrase: '',
      appliedSearchPhrase: undefined,
      navigationVisible: false
    };
  }

  // $FlowIgnore
  handleSearchSubmit(event) {
    event.preventDefault();
    const searchPhrase = this.state.searchPhrase;
    if (searchPhrase) {
      if (this.state.appliedSearchPhrase === searchPhrase) {
        if (this.props.searchFoundCount > 0) {
          this.props.onClickNextMatch();
        }
      } else {
        this.setState({
          navigationVisible: !!searchPhrase,
          appliedSearchPhrase: searchPhrase
        });
        this.props.onFilterChange(searchPhrase);
      }
    }
  }

  render() {
    const matchIndex = this.props.searchFocusIndex + 1;
    const matchCount = this.props.searchFoundCount;
    const disabledResultNavigation = matchCount === 0;

    const PreviousResultButton = () => (
      <Tooltip enterDelay={500} title="Previous result">
        <div className="treeSearchNavigationComponent">
          <IconButton onClick={this.props.onClickPrevMatch} disabled={disabledResultNavigation}
                      style={ICON_BUTTON_STYLE}>
            <ExpandLess/>
          </IconButton>
        </div>
      </Tooltip>
    );

    const NextResultButton = () => (
      <Tooltip enterDelay={500} title="Next result">
        <div className="treeSearchNavigationComponent">
          <IconButton onClick={this.props.onClickNextMatch} disabled={disabledResultNavigation}
                      style={ICON_BUTTON_STYLE}>
            <ExpandMore/>
          </IconButton>
        </div>
      </Tooltip>
    );

    const SearchResultLabel = () => (
      disabledResultNavigation ?
        <span className="treeSearchNavigationMessage">Phrase not found</span> :
        <span className="treeSearchNavigationMessage">{matchIndex} of {matchCount} match{matchCount > 1 && 'es'}</span>
    );

    const SearchResultPanel = () => (
      this.state.navigationVisible &&
      <div className="treeSearchNavigationPanel">
        <PreviousResultButton/>
        <NextResultButton/>
        <SearchResultLabel/>
      </div>
    );

    return (
      <div className='treeSearchPanel'>
        <form onSubmit={this.handleSearchSubmit.bind(this)}>
          <TextField
            label="Search..."
            value={this.state.searchPhrase}
            onChange={event => this.setState({searchPhrase: event.target.value})}
          />
          <SearchResultPanel/>
        </form>
      </div>
    );
  }
}
