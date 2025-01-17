import { useEffect, useRef, useState } from "react";
const INITIAL_STATE = {
  results: [],
  searchBoxUp: false,
  keyword: "",
  isFetching: false,
  redirectRoute: "",
};

export default function useSearchResources(props) {
  const [results, setResults] = useState(INITIAL_STATE.results);
  const [searchBoxUp, setSearchBoxUp] = useState(INITIAL_STATE.searchBoxUp);
  const [keyword, setKeyword] = useState(INITIAL_STATE.keyword);
  const [isFetching, setIsFetching] = useState(INITIAL_STATE.isFetching);
  const [redirectRoute, setRedirectRoute] = useState(
    INITIAL_STATE.redirectRoute
  );
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

  const timeout = useRef(null);
  const cancelSource = useRef(null);
  const prevProps = useRef(props);

  useEffect(() => {
    scrollWindowIfNecessary();
    if (prevProps.current.location !== props.location) {
      debugger;
      cancelSource.current && cancelSource.current.cancel();
      setResults(INITIAL_STATE.results);
      setSearchBoxUp(INITIAL_STATE.searchBoxUp);
      setKeyword(INITIAL_STATE.keyword);
      setIsFetching(INITIAL_STATE.isFetching);
      setRedirectRoute(INITIAL_STATE.redirectRoute);
      setSelectedItemIndex(-1);
    }
    prevProps.current = props;
  }, [props.location]);

  const scrollWindowIfNecessary = () => {
    const selectedRow = document.getElementsByClassName("selectedRow")[0];

    if (!selectedRow) {
      return;
    }

    const rect = selectedRow.getBoundingClientRect();
    const margin = 230;
    const isInViewport =
      rect.top >= margin &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) - margin;

    if (!isInViewport) {
      selectedRow.scrollIntoView();
    }
  };

  return {
    state: {
      results,
      setResults,
      searchBoxUp,
      setSearchBoxUp,
      keyword,
      setKeyword,
      isFetching,
      setIsFetching,
      redirectRoute,
      setRedirectRoute,
      selectedItemIndex,
      setSelectedItemIndex,
    },
    ref: {
      timeout,
      cancelSource,
    },
  };
}
