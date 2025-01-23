import { useEffect, useRef, useState } from "react";
import WS from "@/tools/WS";
import Ajax from "eam-components/dist/tools/ajax";
import useSnackbarStore from "@/state/useSnackbarStore";
import { useQuery } from "@tanstack/react-query";
import { INITIAL_STATE } from "./consts";

const prepareKeyword = (keyword) => {
  return keyword.replace("_", "\\_").replace("%", "\\%").toUpperCase();
};

const fetchSearchData = async (keyword, entityTypes, cancelToken) => {
  if (!keyword) return [];

  const response = await WS.getSearchData(
    prepareKeyword(keyword),
    entityTypes,
    {
      cancelToken,
    }
  );
  return response.body.data;
};

export default function useSearchResources(props) {
  const [keyword, setKeyword] = useState(INITIAL_STATE.keyword);
  const [redirectRoute, setRedirectRoute] = useState(
    INITIAL_STATE.redirectRoute
  );
  const [searchBoxUp, setSearchBoxUp] = useState(INITIAL_STATE.searchBoxUp);
  const [selectedItemIndex, setSelectedItemIndex] = useState(
    INITIAL_STATE.selectedItemIndex
  );
  const [entityTypes, setEntityTypes] = useState(INITIAL_STATE.entityTypes);
  const [cancelToken, setCancelToken] = useState(null);

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["search-results", keyword, entityTypes],
    queryFn: async () => {
      if (cancelToken) cancelToken.cancel();
      const source = Ajax.getAxiosInstance().CancelToken.source();
      setCancelToken(source);
      const result = await fetchSearchData(keyword, entityTypes, source.token);
      setCancelToken(null);
      return result;
    },
  });

  const { handleError } = useSnackbarStore();
  useEffect(() => {
    if (isError) handleError(error);
  }, [error, isError]);

  useEffect(() => {
    if (keyword.length > 0) setSearchBoxUp(true);
  }, [keyword]);

  const prevProps = useRef(props);
  /**
   * Effect to reset all state when we change the location
   * e.g. clicking on the EAM Light logo in the top left corner
   */
  useEffect(() => {
    scrollWindowIfNecessary();
    if (prevProps.current.location !== props.location) {
      setKeyword(INITIAL_STATE.keyword);
      setEntityTypes(INITIAL_STATE.entityTypes);
      setSearchBoxUp(INITIAL_STATE.searchBoxUp);
      setRedirectRoute(INITIAL_STATE.redirectRoute);
      setSelectedItemIndex(INITIAL_STATE.selectedItemIndex);
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

  const updateQueryKeys = (keyword, entityTypes) => {
    setKeyword(keyword);
    setEntityTypes(entityTypes);
  };

  const noResultsAvailable = keyword.length > 0 && isSuccess && data.length < 1;

  return {
    state: {
      results: data,
      entityTypes,
      searchBoxUp,
      noResultsAvailable,
      keyword,
      isFetching: isLoading,
      redirectRoute,
      selectedItemIndex,
    },
    actions: {
      setKeyword,
      setEntityTypes,
      setRedirectRoute,
      updateQueryKeys,
      setSelectedItemIndex,
    },
  };
}
