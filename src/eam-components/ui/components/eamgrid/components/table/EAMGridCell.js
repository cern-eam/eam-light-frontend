import React from 'react';
import {withStyles} from "@material-ui/core/styles/index";

const styles = {
    searchRowCell: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "stretch",
        borderRight: "1px solid #d3d3d3",
        boxSizing: "border-box",
        "-moz-box-sizing": "border-box",
        "-webkit-box-sizing": "border-box",
        width: "100px",
        minWidth: "100px"
    },
    searchRowCellContent: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "left"
    }
};

const EAMGridCell = props => {

    const { classes, children, style = {'width': '80px', 'minWidth': '80px'} } = props;

    return  <div className={classes.searchRowCell} style={style}>
                <div className={classes.searchRowCellContent}>
                    {
                        children
                    }
                </div>
            </div>
};

export default withStyles(styles)(EAMGridCell);