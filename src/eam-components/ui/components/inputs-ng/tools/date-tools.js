import TextField from "../components/TextField";

export const renderDatePickerInput = ({ inputRef, inputProps, InputProps }, isInvalidDate, style) => {
    let errorText = '';
    if (isInvalidDate) {
        errorText = "Wrong Date format";
    }

    let endAdornment = (<div style={{marginRight: 12, marginLeft: -8}}>{InputProps?.endAdornment}</div>)
    
    return (
      <TextField style = {style}
                 inputRef={inputRef} 
                 inputProps={inputProps} 
                 endAdornment={endAdornment} errorText={errorText}/>
    )
}

export const onChangeHandler = (updateProperty, setIsInvalidDate, valueKey, newValue) => {
    try {
        if (newValue) {
            updateProperty(valueKey, newValue.toISOString())   
        } else {
            updateProperty(valueKey, '');
        }
        setIsInvalidDate(false);
    } catch {
        setIsInvalidDate(true)
    }
}