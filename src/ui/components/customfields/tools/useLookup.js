import { useEffect, useRef, useState } from 'react';
import { cfCodeDesc } from '../../../../tools/WSCustomFields';

function useLookup(code) {
  const cacheRef = useRef({});
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!code) return;

    if (cacheRef.current[code]) {
      console.log('cached', code)
      setOptions(cacheRef.current[code]);
    } else {
      console.log('fetching', code)
      cfCodeDesc(code).then((response) => {
        cacheRef.current[code] = response.body.data;
        setOptions(response.body.data);
      });
    }
  }, [code]);

  return options;
}

export default useLookup
