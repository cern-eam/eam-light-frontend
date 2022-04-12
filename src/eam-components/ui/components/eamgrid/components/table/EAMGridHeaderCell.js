import React from 'react';
import withStyles from '@mui/styles/withStyles';

const styles = {
    headerCellContainer: {
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #d3d3d3",
        boxSizing: "border-box",
        "-moz-box-sizing": "border-box",
        "-webkit-box-sizing": "border-box",
        overflow: "hidden"
    },
    headerCell: {
        width: "100%",
        minHeight: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#a5a5a5",
        paddingLeft: "5px",
        boxSizing: "border-box",
        "-moz-box-sizing": "border-box",
        "-webkit-box-sizing": "border-box"
    }
};

const EAMGridHeaderCell = props => {

    const { classes, children, style = {'width': '80px', 'minWidth': '80px'} } = props;

    return  <div className={classes.headerCellContainer} style={style}>
                <div className={classes.headerCell}>
                    {
                        children
                    }
                </div>
            </div>
};

export default withStyles(styles)(EAMGridHeaderCell);