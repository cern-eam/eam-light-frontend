import React from 'react';

const StatusBox = ({color}) => {

    let style = {
        float: 'left',
        width: '100%',
        maxWidth: 15,
        height: 15,
        marginRight: 5,
        borderRadius: 5,
        backgroundColor: color
    }

    return (<div style={style}/>)
}

export default StatusBox;