// import { useEffect, useState } from "react";

// export function useCustomFieldOptions(fetcher, code) {
//   const [options, setOptions] = useState([]);

//   useEffect(() => {
//     fetcher(code).then((response) => {
//       setOptions(response.body.data);
//     });
//   }, [fetcher, code]);

//   return options;
// }
import { useEffect, useState } from 'react';
import { useCustomFieldOptionsStore } from './useCustomFieldOptionsStore';

export function useCustomFieldOptions(fetcher, code) {
  const { cache, setCache } = useCustomFieldOptionsStore();
  const [options, setOptions] = useState(cache[code] || []);

  useEffect(() => {
    
    if (!cache[code]) {
      fetcher(code).then((response) => {
        const data = response.body.data;
        setCache(code, data);
        setOptions(data);
      });
    }
  }, [code]);

  return cache[code] || options;
}