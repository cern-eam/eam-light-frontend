import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import useFetchAutocompleteOptions from './hooks/useFetchAutocompleteOptions';
import {areEqual, getElementKey, renderOptionHandler, updateCodeDesc} from './tools/input-tools'
import EAMBaseInput from './components/EAMBaseInput';
import TextField from './components/TextField';
import { saveHistory } from './tools/history-tools';

const autocompleteDivStyle = {
  flex: "999 1 auto",
  display: "flex"
}

const EAMAutocomplete = (props) => {
   
  let {autocompleteHandler, autocompleteHandlerParams, 
       value, valueKey, descKey,
       updateProperty, elementInfo, renderValue, onChangeValue} = props;

    let [inputValue, setInputValue] = useState("")
    let [open, setOpen] = useState(false)
    let [fetchedOptions, loading] = useFetchAutocompleteOptions(autocompleteHandler, autocompleteHandlerParams, inputValue, value, open, getElementKey(elementInfo))
  
    const getOptionLabelHandler = option => {
        return option.code ?? option;
    }

    const onInputChangeHandler = (event, newInputValue) => {
     setInputValue(newInputValue);
     if (newInputValue !== value && descKey) {
      updateProperty(descKey, '');
     }
    }

    const onChangeHandler = (event, newValue, reason) => {
      if (reason === 'clear') {
        // Case handled by the onCloseHandler as we don't want to fire the change event before blurying 
        return;
      }
      
      saveHistory(getElementKey(elementInfo), newValue.code, newValue.desc)
      updateCodeDesc(updateProperty, valueKey, newValue.code, descKey, newValue.desc, onChangeValue);

      // Don't bubble up any events (won't trigger a save when we select something by pressing enter)
      event.stopPropagation();
      event.preventDefault();
    }


    const onCloseHandler = (event, reason) => {
      setOpen(false)
      // Only to be fired when we blur and the inputValue is different than the original value
      if (reason === 'blur' && inputValue !== value) {
          // TODO: validation if inputValue is not empty 
          updateCodeDesc(updateProperty, valueKey, inputValue, descKey, '', onChangeValue); 
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
            filterOptions={x => x}
            id={getElementKey(elementInfo)}
            freeSolo = {true}
            value={value === undefined ? '' : value}
            openOnFocus
            //blurOnSelect
            // Visuals 
            componentsProps={{
              paper: {
                sx: {
                  marginTop: "2px"
                }
              }
            }}
            loading = {loading}
            size="small"
            fullWidth
            renderInput={(params) => <TextField {...params}  {...props} />}
            
          />
        </div>
      </EAMBaseInput>
      );
};

EAMAutocomplete.defaultProps = {
  
}

export default React.memo(EAMAutocomplete, areEqual);