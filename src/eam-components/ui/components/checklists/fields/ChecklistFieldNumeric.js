import React, {useState, useEffect} from 'react';

const inputStyle = {
    width: "1%",
    flex: "1 1 auto",
    padding: "5px 10px",
    fontSize: 16,
    transition: "border-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    borderRadius: 4,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    zIndex: 20,
    backgroundColor: "#fff"
}

const labelUOMStyle = {
    color: "black",
    fontSize: 15,
    color: "#495057",
    textAlign: "center",
    whiteSpace: "nowrap",
    backgroundColor: "#e9ecef",
    border: "1px solid #ced4da",
    paddingLeft: 4,
    paddingRight: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    marginLeft: -1,
    zIndex: 10,
    display: "flex",
    alignItems: "center"
}

const outerStyle = {
    margin: 5,
    marginLeft: 17,
    display: "flex"
};

const OK_BORDER = "solid 1px #ced4da";
const ERROR_BORDER = "solid 1px #f44336";

const ChecklistFieldNumeric = props => {
    const { value, UOM, handleChange, minimumValue, maximumValue, showError, disabled } = props;
    const stringValue = value === null ? '' : '' + value;

    const [inputValue, setInputValue] = useState(stringValue);
    const [lastUpdatedValue, setUpdatedValue] = useState(stringValue);
    const [border, setBorder] = useState(OK_BORDER);
    const [numericLimitError, setNumericLimitError] = useState(false);

    useEffect(() => {
        if(stringValue !== inputValue) {
            setInputValue(stringValue);
        }
    }, [stringValue]);

    const changed = lastUpdatedValue !== inputValue;
    useEffect(() => {
        if (!isNaN(inputValue)) {
            const floatValue = parseFloat(inputValue);
            let numericLimitErrorDetected = true;
            if(typeof minimumValue === 'number' && floatValue < minimumValue) {
                setNumericLimitError(`Minimum value is ${minimumValue}${UOM}`);
            } else if(typeof maximumValue === 'number' && floatValue > maximumValue) {
                setNumericLimitError(`Maximum value is ${maximumValue}${UOM}`);
            } else {
                setNumericLimitError(false);
                numericLimitErrorDetected = false;
            }

            if (changed && numericLimitErrorDetected) {
                showError(numericLimitError);
            }
        }
    }, [inputValue, numericLimitError, changed, showError]);

    return <>
        <div style={outerStyle}>
            <input style={{...inputStyle, border: border}}
                disabled={disabled}
                onChange={event => setInputValue(event.target.value)}
                value={inputValue}
                disabled={disabled}
                onBlur={() => {
                    if (!changed) {
                        return;
                    }

                    if (!isNaN(inputValue)) {
                        setBorder(OK_BORDER);
                        setUpdatedValue(inputValue);
                        handleChange(inputValue, () => setUpdatedValue(lastUpdatedValue));
                    } else setBorder(ERROR_BORDER);
                }}/>
            <div style={labelUOMStyle}>{UOM}</div>
        </div>
        {numericLimitError && <p style={{color: 'red', marginLeft: '20px'}}>{numericLimitError}</p>}
    </>;
};

export default ChecklistFieldNumeric;