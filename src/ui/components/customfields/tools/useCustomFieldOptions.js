import { useEffect, useState } from "react";

export function useCustomFieldOptions(fetcher, code) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetcher(code).then((response) => {
      setOptions(response.body.data);
    });
  }, [fetcher, code]);

  return options;
}