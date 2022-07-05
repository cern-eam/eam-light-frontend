import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import useFetchAutocompleteOptions from './hooks/useFetchAutocompleteOptions';
import {areEqual, getElementKey, renderOptionHandler} from './tools/input-tools'
import EAMBaseInput from './tools/EAMBaseInput';
import TextField from './tools/TextField';
import { saveHistory } from './tools/history-tools';

const autocompleteDivStyle = {
  flex: "1 1 auto",
  display: "flex"
}

const EAMAutocomplete = React.memo((props) => {
   
  let {autocompleteHandler, 
    autocompleteHandlerParams, 
    value, 
    valueKey,
    descKey,
    updateProperty,
    elementInfo,
    renderValue} = props;

    let [inputValue, setInputValue] = useState("")
    let [open, setOpen] = useState(false)
    let [fetchedOptions, loading] = useFetchAutocompleteOptions(autocompleteHandler, autocompleteHandlerParams, inputValue, value, open)
  
    const getOptionLabelHandler = option => {
        return option.code ?? option;
    }

    const onInputChangeHandler = (event, newInputValue) => {
     setInputValue(newInputValue);
     if (newInputValue !== value) {
      updateProperty(descKey, '');
     }
    }

    const onChangeHandler = (event, newValue, reason) => {
      if (reason === 'clear') {
        updateProperty(valueKey, '');
        updateProperty(descKey, '');
        return;
      }
      
      saveHistory(getElementKey(elementInfo), newValue.code, newValue.desc)
      updateProperty(valueKey, newValue.code);
      updateProperty(descKey, newValue.desc);
    }


    const onCloseHandler = (event, reason) => {
      setOpen(false)
      // Only to be fired when we blur and the inputValue is not empty 
      // (if the inputValue is empty onChangeHandler is fired with reason = 'clear')
      if (reason === 'blur' && inputValue?.trim()) {
        updateProperty(valueKey, inputValue);
        // TODO: validation (+ description)
      } 
    }

    return (
      <EAMBaseInput {...props}>
        <div style={autocompleteDivStyle}>
          <Autocomplete   
            // Options
            options={fetchedOptions} 
            getOptionLabel = {getOptionLabelHandler}
            renderOption = {renderOptionHandler.bind(null, renderValue)}
            // Open props
            open={open} 
            onOpen={() => setOpen(true)} 
            onClose={onCloseHandler}
            // On change 
            onChange={onChangeHandler} 
            onInputChange={onInputChangeHandler}
            // Misc
            id={getElementKey(elementInfo)}
            freeSolo = {true}
            value={value}
            openOnFocus
            //blurOnSelect
            // Visuals 
            loading = {loading}
            size="small"
            fullWidth
            renderInput={(params) => <TextField {...params}  {...props} />}
          />
        </div>
      </EAMBaseInput>
      );
}, areEqual);

EAMAutocomplete.defaultProps = {
  mode: "AUTOCOMPLETE" 
}

export default React.memo(EAMAutocomplete, areEqual);