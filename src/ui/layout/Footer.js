import React from "react";
import { useTheme } from '@mui/material/styles';
import { isCernMode } from "ui/components/CERNMode";
import {version} from '../../../package.json'
import { useHistory } from "react-router";

const Footer = props => {

    const theme = useTheme();
    const history = useHistory();

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
            <span style={{marginLeft: 5, marginRight: 5}}>(<span style={{textDecorationLine: "underline", cursor: "pointer"}}  onClick={() => history.push("/releaseNotes")}>v{version}</span>)</span>
            {isCernMode && <a style={{color: "white", marginRight: 10}} href="mailto:eam.support@cern.ch">eam.support@cern.ch</a>}
        </div>
    )
}

export default Footer