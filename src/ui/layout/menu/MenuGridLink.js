import React from 'react'
import {Link} from 'react-router-dom'

const MenuGridLink = (props) => {

    const spanStyle = {
        display: "block",
        fontSize: 13,
        marginTop: 5
    }

    const linkStyle = {
        textAlign: "left",
        marginTop: 5
    }

    return (
        <li>
            <Link to={"/grid?gridName=" + props.grid.code} style={linkStyle}>
                <span style={{...spanStyle, display: 'inline', paddingLeft: 5}}>{props.grid.desc}</span>
            </Link>
        </li>
    )
}

export default MenuGridLink;