import {useState, useEffect, useMemo, useRef} from "react"
import debounce from 'lodash/debounce';
import axios from 'axios/index';
import { fetchHistory } from "../tools/history-tools";

const useFetchAutocompleteOptions = (autocompleteHandler, autocompleteHandlerParams = [], inputValue, value, open) => {
  
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
                setOptions(fetchHistory()); // By focus on empty inputy fetch the history
                return;
            }
        }

        abortController.current = new AbortController();

        fetchOptionsDebounced(inputValue, value, open)
    }, [inputValue, value, open]) 

    const fetchOptionsDebounced = useMemo(
        () => debounce( (...args) => fetchOptions(...args), 200), []
    );

    const fetchOptions = (inputValue, value, open) => {
        setLoading(true);
        callHandler(inputValue, { signal: abortController.current.signal })
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