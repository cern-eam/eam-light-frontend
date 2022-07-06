import TextField from "../components/TextField";

export const renderDatePickerInput = ({ inputRef, inputProps, InputProps }, isInvalidDate) => {
    let error = '';
    if (isInvalidDate) {
        error = "Wrong Date format";
    }

    let endAdornment = (<div style={{marginRight: 12, marginLeft: -8}}>{InputProps?.endAdornment}</div>)
    
    return (
      <TextField inputRef={inputRef} inputProps={inputProps} endAdornment={endAdornment} error={error}/>
    )
}