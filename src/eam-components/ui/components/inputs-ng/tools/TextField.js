import React from 'react';
import AutocompleteDescription from './AutocompleteDescription';
import EAMBarcodeScanner from './EAMBarcodeScanner';
import EAMLink from './EAMLink';

const inputStyle = {
    display: "block",
    width: "calc(100% - 18px)",
    padding: "7px 8px",
    fontSize: "15px",
    lineHeight: 1.5,
    color: "#495057",
    backgroundClip: "padding-box",
    border: "1px solid #ced4da",
    borderRadius: "0.25rem",
    transition: "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
    backgroundColor: "#fdfdfd",
}

const divInputStyle = {
    flex: "1 1 auto",
    position: "relative"
}

const divInputContainerStyle = {
    flex: "1 1 auto",
    display: "flex",
    alignItems: "center",
    minWidth: "310px"
}

const divAdornmentStyle = {
    position: "absolute",
    right: "1px",
    top: "1px",
    width: "70px",
    height: "36px", // TODO: use the width of the input container 
    backgroundColor: "#f2f2f2",
    zIndex: 999,
    borderTopRightRadius: "0.25rem",
    borderBottomRightRadius: "0.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
}

const TextField = (props) => {

    let {desc, value, valueKey, barcodeScanner, updateProperty, link, inputProps, hideDescription, endAdornment} = props;

    return (
        <div style={divInputContainerStyle}>
            <div style={divInputStyle} ref={props.InputProps?.ref}>
                <input style={inputStyle} type="text" {...inputProps} />
                {!hideDescription &&<AutocompleteDescription
                    description = {desc}
                    value = {value}
                />}
                {endAdornment && <div style={divAdornmentStyle}>{endAdornment}</div>}
            </div>
            {barcodeScanner && <EAMBarcodeScanner updateProperty={updateProperty} valueKey = {valueKey}/>}
            {link && <EAMLink link = {link} value = {value}/>}
        </div>
    )

}

export default TextField;