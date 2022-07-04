import {useState, useEffect} from "react"

const useFetchSelectOptions = (autocompleteHandler, autocompleteHandlerParams = [], value, desc, options) => {
  
    const [fetchedOptions, setFetchedOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    // SELECT
    useEffect( () => {    
        // Don't proceed if the user has passed the list of options or no autocompleteHandler is defined
        if (options || !autocompleteHandler) {
            return;
        }
        
        autocompleteHandler(...autocompleteHandlerParams)
        .then(result => {
            let fetchedOptionsTemp = result.body.data;
            
            // Add value to list of options if it's not there
            if (value && !fetchedOptionsTemp.some(o => o.code === value)) {
                fetchedOptionsTemp.push({code: value, desc})
            }
            setFetchedOptions(fetchedOptionsTemp);
            setLoading(false);
        })
        .catch(error => {
            setLoading(false);
        }) 
    }, [...autocompleteHandlerParams, options]) // Execute only when it renders 

    
    // RETURN
    return [fetchedOptions, loading];
};

export default useFetchSelectOptions;