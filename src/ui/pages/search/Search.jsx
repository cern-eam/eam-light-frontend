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

import useSnackbarStore from "@/state/useSnackbarStore";
import useSearchResources from "./useSearchResources";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SearchHeaderFilters from "./SearchHeaderFilters";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function Search(props) {
  const {
    state: {
      results,
      redirectRoute,
      searchBoxUp,
      keyword,
      entityTypes,
      isFetching,
      selectedItemIndex,
      noResultsAvailable,
    },
    actions: {
      setKeyword,
      setEntityTypes,
      setRedirectRoute,
      updateQueryKeys,
      setSelectedItemIndex,
    },
  } = useSearchResources(props);

  const { handleError } = useSnackbarStore();
  /*
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
        .catch(handleError);
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

  if (redirectRoute) {
    return <Redirect to={redirectRoute} />;
  }

  const selectedItemCode = !!results?.[selectedItemIndex]
    ? results[selectedItemIndex].code
    : null;

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
        setKeyword={setKeyword}
        searchBoxUp={searchBoxUp}
        updateQueryKeys={updateQueryKeys}
        isFetching={isFetching}
        onKeyDown={onKeyDown}
        tryToGoToResult={tryToGoToResult}
        showTypes={searchBoxUp}
      >
        {searchBoxUp ? (
          <SearchHeaderFilters
            entityTypes={entityTypes}
            setEntityTypes={setEntityTypes}
          />
        ) : null}
      </SearchHeader>
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

const QueryWrapperSearch = (props) => (
  <QueryClientProvider client={queryClient}>
    <Search {...props}></Search>
  </QueryClientProvider>
);

export default QueryWrapperSearch;
