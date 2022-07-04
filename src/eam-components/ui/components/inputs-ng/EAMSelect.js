import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { Box } from '@mui/material';
import {areEqual, getElementKey, isRequired, renderOptionHandler, formatLabel} from './tools/input-tools'
import EAMBaseInput from './tools/EAMBaseInput';
import TextField from './tools/TextField';
import useFetchSelectOptions from './hooks/useFetchSelectOptions';

const autocompleteDivStyle = {
  flex: "1 1 auto",
  display: "flex"
}

const EAMSelect = React.memo((props) => {
   
  let {autocompleteHandler, 
    autocompleteHandlerParams, 
    value, 
    valueKey,
    descKey,
    desc,
    updateProperty,
    options, 
    elementInfo,
    renderValue} = props;

    let [inputValue, setInputValue] = useState("")
    let [fetchedOptions, loading] = useFetchSelectOptions(autocompleteHandler, autocompleteHandlerParams, value, desc, options)
  
    const getOptionLabelHandler = option => {
        if (typeof option === 'object') {
            return formatLabel(renderValue, option);
        }

        if (typeof option === 'string') {
            if (getOptions().some(o => o.code === option)) {
                return formatLabel(renderValue, getOptions().find(o => o.code === option));
            } else {
                return option;
            }
        }
    }

    const getOptions = () => {
      return options ?? fetchedOptions;
    }

    const onInputChangeHandler = (event, newInputValue) => {
        setInputValue(newInputValue);
        if (newInputValue !== value) {
         updateProperty(descKey, '');
        }
       }

    const isOptionEqualToValueHandler = (option, value) => {  
        if (value) {
            return option.code === value
        } else {
            return false;
        }
    }

    const onChangeHandler = (event, newValue, reason) => {
      if (reason === 'clear') {
        // Don't allow clearing the value if mandatory
        if (isRequired(elementInfo)) {
            return;
        }
        updateProperty(valueKey, '');
        updateProperty(descKey, '');
        return;
      }

      updateProperty(valueKey, newValue.code);
      updateProperty(descKey, newValue.desc);
    }


    const onCloseHandler = (event, reason) => {
        if (reason === 'blur' && inputValue) {
            if (getOptions().some(o => o.code === inputValue)) {
                let option = getOptions().find(o => o.code === inputValue);
                updateProperty(valueKey, option.code);
                updateProperty(descKey, option.desc);
            }
        }
      }

    return (
      <EAMBaseInput {...props}>
        <div style={autocompleteDivStyle}>
          <Autocomplete   
            // Options
            options={options || fetchedOptions} 
            getOptionLabel = {getOptionLabelHandler}
            renderOption = {renderOptionHandler.bind(null, renderValue)}
            // On change 
            onChange={onChangeHandler} 
            onInputChange={onInputChangeHandler}
            // Misc
            id={getElementKey(elementInfo)}
            value={value}
            isOptionEqualToValue={isOptionEqualToValueHandler}
            onClose={onCloseHandler}
            // Visuals 
            loading = {loading}
            size="small"
            fullWidth
            renderInput={(params) => <TextField hideDescription = {true} {...params}  {...props} />}
          />
        </div>
      </EAMBaseInput>
      );
}, areEqual);

EAMSelect.defaultProps = {
  
}

export default React.memo(EAMSelect, areEqual);