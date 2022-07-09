import {useState, useEffect, useMemo, useRef} from "react"
import debounce from 'lodash/debounce';
import { fetchHistory } from "../tools/history-tools";

const useFetchAutocompleteOptions = (autocompleteHandler, autocompleteHandlerParams = [], inputValue, value, open, fieldId) => {
  
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const abortController = useRef(null);

    // AUTOCOMPLETE
    useEffect( () => {
        setOptions([])
        // Cancel the old request in the case it was still active
        abortController.current?.abort();

        // If there is a value and nothing new was typed do nothing 
        if (value && value === inputValue) {
            return;
        }

        if (!inputValue?.trim()) {
            if (!open) {
                return; // Don't proceed if the input is empty or there is no popup
            } else {
                setOptions(fetchHistory(fieldId)); // By focus on empty inputy fetch the history
                return;
            }
        }
        abortController.current = new AbortController();

        fetchOptionsDebounced(autocompleteHandlerParams, inputValue)
    }, [inputValue, value, open]) 

    // Memoizing as we always need the same instance of the function that remembers / debounces previous requests 
    const fetchOptionsDebounced = useMemo(
        () => debounce( (...args) => fetchOptions(...args), 200), []
    );

    const fetchOptions = (autocompleteHandlerParams, inputValue) => {
        setLoading(true);
        callHandler(...autocompleteHandlerParams, inputValue, { signal: abortController.current.signal })
    }

    // HELPER
    const callHandler = (...args) => {
        autocompleteHandler(...args)
        .then(result => {
            setOptions(result.body.data);
            setLoading(false);
        })
        .catch(error => {
            setLoading(false);
        }) 
    }

    return [options, loading];
};

export default useFetchAutocompleteOptions;