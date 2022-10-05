import React from "react";
import { useTheme } from '@mui/material/styles';
import { isCernMode } from "ui/components/CERNMode";

const Footer = props => {

    const theme = useTheme();

    const style = {
        backgroundColor: theme.palette.primary.main,
        height: 30,
        color: "white",
        display: "flex",
        justifyContent: "end",
        alignItems: "center"
    }

    return (
        <div style={style}>
            <span style={{fontWeight: 900}}>EAM Light</span>
            <span style={{marginLeft: 5, marginRight: 5}}>(v3.0.1)</span>
            {isCernMode && <a style={{color: "white", marginRight: 10}} href="mailto:EAM.Support@cern.ch">EAM.Support@cern.ch</a>}
        </div>
    )
}

export default Footer