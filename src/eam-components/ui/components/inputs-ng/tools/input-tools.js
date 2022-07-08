import isEqual from 'lodash/isEqual';
import { Box } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

export const isRequired = (elementInfo) =>
        elementInfo &&
        (elementInfo.attribute === 'R' || elementInfo.attribute === 'S');

export const isHidden = (elementInfo) => elementInfo && elementInfo.attribute === 'H';

export const isUpperCase = (elementInfo) => elementInfo && elementInfo.characterCase === 'uppercase';

export const areEqual = (prevProps, nextProps) => {
    return prevProps.value === nextProps.value &&
           prevProps.desc === nextProps.desc &&
           prevProps.disabled === nextProps.disabled &&
           prevProps.elementInfo.readonly === nextProps.elementInfo.readonly &&
           isEqual(prevProps.autocompleteHandlerParams, nextProps.autocompleteHandlerParams) &&
           isEqual(prevProps.options, nextProps.options) &&
           isEqual(prevProps.renderDependencies, nextProps.renderDependencies);
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


export const formatLabel = (renderValue, option) => {
        if (renderValue) {
                return renderValue(option);
        }

        if (option.code === option.desc) {
                return option.code;
        }

        // { code: "Long Shutdown", desc: null }
        if (!option.desc) {
                return option.code
        }

        return `${option.code} - ${option.desc}`;
}


export const updateCodeDesc = (updateProperty, valueKey, value, descKey, desc, onChangeValue) => {
        updateProperty(valueKey, value);

        if (descKey) {
                updateProperty(descKey, desc);
        }

        onChangeValue?.(value)
}