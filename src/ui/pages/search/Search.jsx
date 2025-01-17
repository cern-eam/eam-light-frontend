import * as React from "react";
import SearchResults from "./SearchResults";
import SearchResult from "./SearchResult";
import "./Search.css";
import InfiniteScroll from "react-infinite-scroll-component";
import WS from "@/tools/WS";
import SearchHeader from "./SearchHeader";
import { Redirect } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import KeyCode from "eam-components/dist/enums/KeyCode";
import ErrorTypes from "eam-components/dist/enums/ErrorTypes";
import Ajax from "eam-components/dist/tools/ajax";
import useSnackbarStore from "@/state/useSnackbarStore";
import useSearchResources from "./useSearchResources";

const prepareKeyword = (keyword) => {
  return keyword.replace("_", "\\_").replace("%", "\\%").toUpperCase();
};

function Search(props) {
  const {
    state: {
      results,
      setResults,
      redirectRoute,
      setRedirectRoute,
      searchBoxUp,
      setSearchBoxUp,
      keyword,
      setKeyword,
      isFetching,
      setIsFetching,
      selectedItemIndex,
      setSelectedItemIndex,
    },
    ref: { timeout, cancelSource },
  } = useSearchResources(props);

  const handleError = useSnackbarStore.getState().handleError;
  /**
   * Handles the moving of arrows
   * @param event
   */
  const onKeyDown = (event) => {
    switch (event.keyCode) {
      case KeyCode.DOWN: {
        handleSearchArrowDown();
        break;
      }

      case KeyCode.UP: {
        handleSearchArrowUp();
        break;
      }

      case KeyCode.ENTER: {
        tryToGoToResult();
        break;
      }
    }
  };

  const tryToGoToResult = () => {
    // if only one result, enter sends you to the result
    if (results.length === 1) {
      setRedirectRoute(results[0].link);
      return;
    }

    // redirects to the record selected with arrows
    if (selectedItemIndex >= 0 && selectedItemIndex < results.length) {
      setRedirectRoute(results[selectedItemIndex].link);

      return;
    }

    // if enter pressed and there is a record
    // with the code exactly matching the keyword
    // redirect to this record
    if (results.length > 0) {
      results.forEach((result) => {
        if (result.code === keyword) {
          setRedirectRoute(result.link);
          return;
        }
      });
    }

    if (keyword) {
      // try to get single result
      WS.getSearchSingleResult(keyword)
        .then((response) => {
          if (response.body && response.body.data) {
            setRedirectRoute(response.body.data.link);
          }
        })
        .catch(console.error);
    }
  };

  const handleSearchArrowDown = () => {
    if (selectedItemIndex !== results.length - 1) {
      setSelectedItemIndex(selectedItemIndex + 1);
      return;
    }
    setSelectedItemIndex(0);
  };

  const handleSearchArrowUp = () => {
    if (selectedItemIndex > 0) {
      setSelectedItemIndex(selectedItemIndex - 1);
      return;
    }
    setSelectedItemIndex(results.length - 1);
  };

  const fetchNewData = (keyword, entityTypes) => {
    if (!!cancelSource.current) cancelSource.current?.cancelSource?.cancel();

    if (!keyword) {
      setResults([]);
      setKeyword(keyword);
      setIsFetching(false);
      return;
    }

    cancelSource.current = Ajax.getAxiosInstance().CancelToken.source();

    setSearchBoxUp(true);
    setKeyword(keyword);
    setIsFetching(true);

    clearTimeout(timeout.current);
    timeout.current = setTimeout(
      () =>
        WS.getSearchData(prepareKeyword(keyword), entityTypes, {
          cancelToken: cancelSource.current?.token,
        })
          .then((response) => {
            cancelSource.current = null;
            setResults(response.body.data);
            setSelectedItemIndex(-1);
          })
          .catch((error) => {
            if (error.type !== ErrorTypes.REQUEST_CANCELLED) handleError(error);
          })
          .finally(() => setIsFetching(false)),
      200
    );
  };

  if (redirectRoute) {
    return <Redirect to={redirectRoute} />;
  }

  const selectedItemCode = !!results[selectedItemIndex]
    ? results[selectedItemIndex].code
    : null;

  const noResultsAvailable = !isFetching && results.length === 0 && keyword;

  return (
    <div
      id="searchContainer"
      className={
        searchBoxUp
          ? "searchContainer searchContainerSearch"
          : "searchContainer searchContainerHome"
      }
    >
      <SearchHeader
        keyword={keyword}
        searchBoxUp={searchBoxUp}
        fetchDataHandler={fetchNewData}
        isFetching={isFetching}
        onKeyDown={onKeyDown}
        tryToGoToResult={tryToGoToResult}
        showTypes={searchBoxUp}
      />
      <div
        id="searchResults"
        className={searchBoxUp ? "searchResultsSearch" : "searchResultsHome"}
      >
        <div className="linearProgressBox">
          {isFetching ? <LinearProgress className="linearProgress" /> : null}
        </div>
        <div className="searchScrollBox">
          {noResultsAvailable ? (
            <div className="searchNoResults">No results found.</div>
          ) : (
            <InfiniteScroll height="calc(100vh - 180px)">
              <SearchResults
                data={results}
                selectedItemCode={selectedItemCode}
                renderResult={({ isSelected, item }) => (
                  <SearchResult
                    keyword={keyword}
                    selected={isSelected}
                    data={item}
                  />
                )}
              />
            </InfiniteScroll>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
