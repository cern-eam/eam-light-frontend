import { useEffect, useRef, useState } from "react";
import WS from "@/tools/WS";
import ErrorTypes from "eam-components/dist/enums/ErrorTypes";
import Ajax from "eam-components/dist/tools/ajax";
import useSnackbarStore from "@/state/useSnackbarStore";
import { useQuery } from "@tanstack/react-query";

const SEARCH_TYPES = {
  PART: {
    text: "Parts",
    value: "PART",
    code: "PART",
  },
  EQUIPMENT_TYPES: {
    text: "Equipment",
    value: "A,P,S,L",
    code: "EQUIPMENT",
  },
  JOB: {
    text: "Work Orders",
    value: "JOB",
    code: "JOB",
  },
};

export const INITIAL_STATE = {
  results: [],
  searchBoxUp: false,
  keyword: "",
  isFetching: false,
  redirectRoute: "",
  entityTypes: Object.values(SEARCH_TYPES).map((v) => v.value),
};

const prepareKeyword = (keyword) => {
  return keyword.replace("_", "\\_").replace("%", "\\%").toUpperCase();
};

const fetchSearchData = async (
  keyword,
  entityTypes = Object.values(SEARCH_TYPES).map((v) => v.value),
  cancelSourceCurrentToken = null
) => {
  if (!keyword) return [];

  const response = await WS.getSearchData(
    prepareKeyword(keyword),
    entityTypes,
    {
      cancelToken: cancelSourceCurrentToken,
    }
  );
  return response.body.data;
};

export default function useSearchResources(props) {
  const [keyword, setKeyword] = useState(INITIAL_STATE.keyword);
  const [redirectRoute, setRedirectRoute] = useState(
    INITIAL_STATE.redirectRoute
  );
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [entityTypes, setEntityTypes] = useState(INITIAL_STATE.entityTypes);
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["search-results", keyword, entityTypes],
    queryFn: () => fetchSearchData(keyword),
  });
  const cancelSource = useRef(null);

  const prevProps = useRef(props);
  const handleError = useSnackbarStore.getState().handleError;

  /**
   * Effect to reset all state when we change the location
   * e.g. clicking on the EAM Light logo in the top left corner
   */
  useEffect(() => {
    scrollWindowIfNecessary();
    if (prevProps.current.location !== props.location) {
      cancelSource.current && cancelSource.current.cancel();
      setKeyword(INITIAL_STATE.keyword);
      setEntityTypes(INITIAL_STATE.entityTypes);
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

  const fetchNewData = (keyword, entityTypes) => {
    setKeyword(keyword);
    setEntityTypes(entityTypes);
  };

  const searchBoxUp = keyword.length > 0;
  const noResultsAvailable = keyword.length > 0 && isSuccess && data.length < 1;

  return {
    state: {
      results: data,
      isError,
      isSuccess,
      searchBoxUp,
      noResultsAvailable,
      keyword,
      setKeyword,
      isFetching: isLoading,
      redirectRoute,
      setRedirectRoute,
      selectedItemIndex,
      setSelectedItemIndex,
    },
    actions: {
      fetchNewData,
    },
  };
}
