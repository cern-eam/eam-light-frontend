import React from 'react'
import InfoIcon from '@material-ui/icons/Info';
import { Typography, withStyles } from '@material-ui/core';

const styles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        color: '#737373'
    },
    icon: {
        padding: theme.spacing()
    }
})

const SimpleEmptyState = (props) => {
    const { message, style, iconStyle, classes } = props;
    return (
        <div className={classes.root} style={style}>
            <InfoIcon className={classes.icon} style={iconStyle}/>
            <Typography variant="caption">{message}</Typography>
        </div>
    )
}

export default withStyles(styles)(SimpleEmptyState);
