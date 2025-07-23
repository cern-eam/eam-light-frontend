import { useEffect, useRef, useState } from "react";
import WS from "@/tools/WS";
import Ajax from "eam-components/dist/tools/ajax";
import useSnackbarStore from "@/state/useSnackbarStore";

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

const ONE_MINUTE = 60000;
/**
 * Custom solution to imitate the behavior of a @tanstack/react-query cache per keyword and entityTypes
 */
export const useQueryResults = ({
  keyword,
  entityTypes
}) => {
  const [cancelToken, setCancelToken] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const cacheRef = useRef(new Map());
  const { handleError } = useSnackbarStore();


  useEffect(() => {
    const queryKey = JSON.stringify([keyword, entityTypes]);

    if (cacheRef.current.has(queryKey)) {
      setData(cacheRef.current.get(queryKey));
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        if (cancelToken) cancelToken.cancel();
        const source = Ajax.getAxiosInstance().CancelToken.source();
        setCancelToken(source);
        const result = await fetchSearchData(keyword, entityTypes, source.token);
        setData(result);
        setCancelToken(null);
        cacheRef.current.set(queryKey, result);
      } catch (err) {
        handleError(err);
        setIsError(true);
      } finally {
        setIsLoading(false);
     
      }
    };

    fetchData();

    const timeoutId = setTimeout(() => {
      cacheRef.current.delete(queryKey);
    }, ONE_MINUTE);

    return () => clearTimeout(timeoutId);
  }, [keyword, entityTypes]);

  return { data, isLoading, isSuccess: !isLoading && !isError };
};