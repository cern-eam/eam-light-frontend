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
        let error = '';
        if (isInvalidDate) {
                error = "Wrong Date format";
        }
        console.log('is invalid', isInvalidDate)
        let endAdornment = (<div style={{marginRight: 12, marginLeft: -8}}>{InputProps?.endAdornment}</div>)
        
        return (
          <TextField inputRef={inputRef} inputProps={inputProps} endAdornment={endAdornment} error={error}/>
        )
}

export const formatLabel = (renderValue, option) => {
   return renderValue ? renderValue(option) :  `${option.code} - ${option.desc}`
}
