import React from "react";
import { useTheme } from '@mui/material/styles';
import { isCernMode } from "ui/components/CERNMode";
import {version} from '../../../package.json'

const Footer = props => {

    const theme = useTheme();

    const style = {
        backgroundColor: theme.palette.primary.main,
        height: 30,
        color: "white",
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        zIndex: 1250 // snackbar has 1400
    }

    return (
        <div style={style}>
            <span style={{fontWeight: 900}}>EAM Light</span>
            <span style={{marginLeft: 5, marginRight: 5}}>(v{version})</span>
            {isCernMode && <a style={{color: "white", marginRight: 10}} href="mailto:eam.support@cern.ch">eam.support@cern.ch</a>}
        </div>
    )
}

export default Footer