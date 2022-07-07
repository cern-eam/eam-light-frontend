import React from 'react';
import {isRequired, isHidden} from '../tools/input-tools'

const rootStyle = {
    margin: "8px",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
}

const divLabelStyle = {
    flex: "0 0 140px",
    fontSize: 14,
    margin: "5px 10px 5px 0px",
    //color: "rgb(0, 101, 152)",
    color: "#1a237e"
    //fontWeight: "bold"
}

const requiredStyle = {
    color: "red",
    fontWeight: "bold"
}

const EAMBaseInput = (props) => {

    const {elementInfo} = props;

    // Hide 
    if (isHidden(elementInfo)) {
        return React.Fragment;
    }

    // Disable
    if (false) {

    }

    return (<div style={rootStyle}>
        <div style ={divLabelStyle}>
            <span>{elementInfo.text}</span>
            {isRequired(elementInfo) && <span style={requiredStyle}>*</span>}
        </div>
        {props.children}
    </div>);
}

export default EAMBaseInput;