import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import {areEqual, getElementKey, isRequired, renderOptionHandler, formatLabel, updateCodeDesc} from './tools/input-tools'
import EAMBaseInput from './components/EAMBaseInput';
import TextField from './components/TextField';
import useFetchSelectOptions from './hooks/useFetchSelectOptions';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const autocompleteDivStyle = {
  flex: "999 1 auto",
  display: "flex"
}

const EAMSelect = (props) => {
   
  let {autocompleteHandler, autocompleteHandlerParams, 
    value, valueKey, descKey, desc,
    updateProperty, onChangeValue,
    options, optionsTransformer,
    elementInfo,
    renderValue, endTextAdornment} = props;

    let [inputValue, setInputValue] = useState("")
    let [fetchedOptions, loading] = useFetchSelectOptions(autocompleteHandler, autocompleteHandlerParams, value, desc, options, optionsTransformer)
  
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
        if (newInputValue !== value && descKey) {
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
        updateCodeDesc(updateProperty, valueKey, '', descKey, '', onChangeValue);
        return;
      }

      updateCodeDesc(updateProperty, valueKey, newValue.code, descKey, newValue.desc, onChangeValue);

      // Don't bubble up any events (won't trigger a save when we select something by pressing enter)
      event.stopPropagation();
      event.preventDefault();
    }


    const onCloseHandler = (event, reason) => {
      if (reason === 'blur' && inputValue) {
        if (getOptions().some(o => o.code === inputValue)) {
            let option = getOptions().find(o => o.code === inputValue);
            updateCodeDesc(updateProperty, valueKey, option.code, descKey, option.desc, onChangeValue);
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
            value={value === undefined ? '' : value} 
            isOptionEqualToValue={isOptionEqualToValueHandler}
            onClose={onCloseHandler}
            // Visuals 
            loading = {loading}
            size="small"
            fullWidth
            componentsProps={{
              paper: {
                sx: {
                  marginTop: "2px"
                }
              }
            }}
            renderInput={(params) => <TextField hideDescription = {true} {...params} {...props} 
                                                endAdornment={<KeyboardArrowDownIcon style={{marginRight: endTextAdornment? 76 : 6,
                                                                                             marginLeft: endTextAdornment ? -100 : -30, 
                                                                                             zIndex: 999,
                                                                                             color: "#acacac",
                                                                                             pointerEvents: "none"}}/>}/>}
          />
        </div>
      </EAMBaseInput>
      );
};

EAMSelect.defaultProps = {
  
}

export default React.memo(EAMSelect, areEqual);