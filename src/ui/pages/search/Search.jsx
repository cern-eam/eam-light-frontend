import React, {Component} from 'react';
import SearchResults from './SearchResults'
import './Search.css'
import InfiniteScroll from 'react-infinite-scroll-component';
import WS from '../../../tools/WS'
import SearchHeader from "./SearchHeader";
import {Redirect} from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import KeyCode from 'eam-components/dist/enums/KeyCode'
import ErrorTypes from "eam-components/dist/enums/ErrorTypes";
import Ajax from 'eam-components/dist/tools/ajax'
import useSnackbarStore from '../../../state/useSnackbarStore';

const INITIAL_STATE = {
    results: [],
    searchBoxUp: false,
    keyword: '',
    isFetching: false,
    redirectRoute: '',
}

class Search extends Component {
    constructor(props) {
        super(props);
        this.handleError = useSnackbarStore.getState().handleError;
    }

    state = INITIAL_STATE;

    componentDidUpdate(prevProps) {
        this.scrollWindowIfNecessary();
        if (prevProps.location !== this.props.location) {
            this.setState(INITIAL_STATE);
            this.cancelSource && this.cancelSource.cancel();
        }
    }

    render() {
        if (!!this.state.redirectRoute) {
            return (
                <Redirect to={this.state.redirectRoute}/>
            );
        }

        return (
            <div id="searchContainer"
                    className={this.state.searchBoxUp ? "searchContainer searchContainerSearch" : "searchContainer searchContainerHome"}>
                <SearchHeader keyword={this.state.keyword} searchBoxUp={this.state.searchBoxUp}
                                fetchDataHandler={this.fetchNewData.bind(this)}
                                onKeyDown={this.onKeyDown.bind(this)}
                                tryToGoToResult={this.tryToGoToResult.bind(this)}
                                showTypes={this.state.searchBoxUp}
                />
                <div id="searchResults"
                        className={this.state.searchBoxUp ? "searchResultsSearch" : "searchResultsHome"}>
                    <div className="linearProgressBox">
                        {this.state.isFetching && <LinearProgress className="linearProgress"/>}
                    </div>
                    <div className="searchScrollBox">
                        {(!this.state.isFetching && this.state.results.length === 0 && this.state.keyword) ?
                            <div className="searchNoResults">No results found.</div> :
                            <InfiniteScroll height="calc(100vh - 180px)">
                                <SearchResults data={this.state.results} keyword={this.state.keyword}
                                                selectedItemCode={!!this.state.results[this.state.selectedItemIndex] ? this.state.results[this.state.selectedItemIndex].code : null}/>
                            </InfiniteScroll>
                        }

                    </div>
                </div>
            </div>
        )
    }

    /**
     * Handles the moving of arrows
     * @param event
     */
    onKeyDown(event) {
        switch (event.keyCode) {
            case KeyCode.DOWN: {
                this.handleSearchArrowDown();
                break;
            }

            case KeyCode.UP: {
                this.handleSearchArrowUp();
                break;
            }

            case KeyCode.ENTER: {
                this.tryToGoToResult();
                break;
            }
        }
    }

    tryToGoToResult() {
        // if only one result, enter sends you to the result
        if (this.state.results.length === 1) {
            this.setState({
                redirectRoute: this.state.results[0].link
            });

            return;
        }

        // redirects to the record selected with arrows
        if (this.state.selectedItemIndex >= 0 && this.state.selectedItemIndex < this.state.results.length) {
            this.setState({
                redirectRoute: this.state.results[this.state.selectedItemIndex].link
            });

            return;
        }

        // if enter pressed and there is a record
        // with the code exactly matching the keyword
        // redirect to this record
        if (this.state.results.length > 0) {
            this.state.results.forEach(result => {
                if (result.code === this.state.keyword) {
                    this.setState({
                        redirectRoute: result.link
                    });

                    return;
                }
            })
        }

        if (this.state.keyword) {
            // try to get single result
            WS.getSearchSingleResult(this.state.keyword)
                .then(response => {
                    if (response.body && response.body.data) {
                        this.setState({
                            redirectRoute: response.body.data.link
                        });
                    }
                }).catch(console.error);
        }
    }

    handleSearchArrowDown() {
        if (this.state.selectedItemIndex !== this.state.results.length - 1) {
            this.setState({
                selectedItemIndex: ++this.state.selectedItemIndex
            });
        } else {
            this.setState({
                selectedItemIndex: 0
            });
        }
    }

    handleSearchArrowUp() {
        if (this.state.selectedItemIndex > 0) {
            this.setState(() => ({
                selectedItemIndex: --this.state.selectedItemIndex
            }));
        } else {
            this.setState(() => ({
                selectedItemIndex: this.state.results.length - 1
            }));
        }
    }

    scrollWindowIfNecessary() {
        let selectedRow = document.getElementsByClassName("selectedRow")[0];

        if (!selectedRow) {
            return;
        }

        let rect = selectedRow.getBoundingClientRect();
        const margin = 230;
        const isInViewport = rect.top >= margin &&
            rect.bottom <= ((window.innerHeight || document.documentElement.clientHeight) - margin);

        if (!isInViewport) {
            selectedRow.scrollIntoView();
        }
    }

    fetchNewData(keyword, entityTypes) {
        if (!!this.cancelSource) {
            this.cancelSource.cancel();
        }

        if (!keyword) {
            this.setState({
                results: [],
                keyword,
                isFetching: false
            })
            return;
        }

        this.cancelSource = Ajax.getAxiosInstance().CancelToken.source();

        this.setState({
            searchBoxUp: true,
            keyword,
            isFetching: true
        });


        clearTimeout(this.timeout);
        this.timeout = setTimeout(() =>
            (WS.getSearchData(this.prepareKeyword(keyword), entityTypes, {
                cancelToken: this.cancelSource.token
            }).then(response => {
                this.cancelSource = null;

                this.setState({
                    results: response.body.data,
                    selectedItemIndex: -1,
                    isFetching: false
                });


            }).catch(error => {
                if (error.type !== ErrorTypes.REQUEST_CANCELLED) {
                    this.setState({
                        isFetching: false
                    });

                    this.handleError(error);
                }
            })), 200);
    }

    prepareKeyword(keyword) {
        return keyword.replace("_", "\\_").replace("%", "\\%").toUpperCase();
    }

}

export default Search