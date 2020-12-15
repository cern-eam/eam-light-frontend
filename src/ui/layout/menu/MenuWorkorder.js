import React from 'react'
import {Link} from 'react-router-dom'
import BellIcon from 'mdi-material-ui/Bell'
import {format} from 'date-fns'

const MenuWorkorder = (props) => {

    const spanStyle = {
        display: "block",
        fontSize: 13,
        marginTop: 5
    }

    const iconColors = {
        'Haute': 'red',
        'Moyenne': 'orange',
        'Basse': 'green'
    }

    const iconStyle = {
        width: 18,
        height: 18,
        color: iconColors[props.wo.priority] ? iconColors[props.wo.priority] : 'green'
    }

    const linkStyle = {
        textAlign: "left",
        marginTop: 5
    }

    if (props.wo.opened) {
        linkStyle.borderLeft = '3px solid #00aaff'
    } else {
        linkStyle.borderLeft = '3px solid rgb(40,40,40)'
    }

    return (
        <li>
            <Link to={"/workorder/" + props.wo.number} style={linkStyle}>
                <BellIcon style={iconStyle}/>
                <span style={{...spanStyle, display: 'inline', paddingLeft: 5}}>{props.wo.number}</span>
                <span style={{...spanStyle, color: "#ffffff"}}>{props.wo.desc}</span>
                <span style={spanStyle}>Eqp.: {props.wo.object}</span>
                <span style={spanStyle}>Department: {props.wo.mrc}</span>
                {props.wo.schedulingStartDate && <span style={spanStyle}>Scheduled Start: {format(new Date(props.wo.schedulingStartDate), 'dd-MMM-yyyy')}</span>}
            </Link>
        </li>
    )
}

export default MenuWorkorder;