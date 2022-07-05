import isEqual from 'lodash/isEqual';
import { Box } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import TextField from './TextField';

export const isRequired = (elementInfo) =>
        elementInfo &&
        (elementInfo.attribute === 'R' || elementInfo.attribute === 'S');

export const isHidden = (elementInfo) => elementInfo && elementInfo.attribute === 'H';

export const isUpperCase = (elementInfo) => elementInfo && elementInfo.characterCase === 'uppercase';

export const areEqual = (prevProps, nextProps) => {
    return prevProps.value === nextProps.value &&
           prevProps.desc === nextProps.desc &&
           isEqual(prevProps.autocompleteHandlerParams, nextProps.autocompleteHandlerParams) &&
           isEqual(prevProps.options, nextProps.options);
}

export const getElementKey = (elementInfo) => {
        return typeof elementInfo.xpath === 'string' ? elementInfo.xpath : elementInfo.text + elementInfo.elementId;
}

export const renderOptionHandler = (renderValue, props, option) => (
        <Box component="li" {...props}>
                {option.type === 'H' &&<HistoryIcon style={{color: "#cfcfcf", 
                                                            margin: "0px 6px 0px -10px",
                                                            fontSize: 17,
                                                            alignItems: "center" }}/>}
         {formatLabel(renderValue, option)}
         </Box>)


export const renderDatePickerInput = ({ inputRef, inputProps, InputProps }, isInvalidDate) => {
        console.log('is invalid', isInvalidDate)
        let endAdornment = (<div style={{marginRight: 12, marginLeft: -8}}>{InputProps?.endAdornment}</div>)
        
        return (
          <TextField inputRef={inputRef} inputProps={inputProps} endAdornment={endAdornment} error={isInvalidDate}/>
        )
}

export const formatLabel = (renderValue, option) => {
   return renderValue ? renderValue(option) :  `${option.code} - ${option.desc}`
}


export const saveHistory = (key, value, desc) => {
        console.log("save history", key, value, desc);
}

export const fetchHistory = (key) => {
        return [
            {code: "A", desc: "A - Desc", type: "H"},
            {code: "B", desc: "B - Desc", type: "H"},
            {code: "C", desc: "C - Desc", type: "H"},
            {code: "D", desc: "D - Desc", type: "H"}
        ]
}