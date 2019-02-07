import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import BellIcon from 'mdi-material-ui/Bell'

export default class EamlightMenuWorkorder extends Component {

    spanStyle = {
        display: "block",
        fontSize: 13,
        marginTop: 5
    }


    computeIconStyle() {
        let iconStyle = {
            width: 18,
            height: 18
        }

        switch (this.props.wo.priority) {
            case "H":
                iconStyle.color = 'red'
                break;
            case "M":
                iconStyle.color = 'orange'
                break;
            case "L":
                iconStyle.color = 'green'
                break;
            default:
                iconStyle.color = 'green'
        }

        return iconStyle
    }


    render() {
        let linkStyle = {
            textAlign: "left",
            marginTop: 5
        }

        if (this.props.wo.opened) {
            linkStyle.borderLeft = '3px solid #00aaff'
        } else {
            linkStyle.borderLeft = '3px solid rgb(40,40,40)'
        }

        return (
            <li>
                <Link to={"/workorder/" + this.props.wo.number} style={linkStyle}>
                    <BellIcon style={this.computeIconStyle()}/>
                    <span style={{...this.spanStyle, display: 'inline', paddingLeft: 5}}>{this.props.wo.number}</span>
                    <span style={{...this.spanStyle, color: "#ffffff"}}>{this.props.wo.desc}</span>
                    <span style={this.spanStyle}>Equipment: {this.props.wo.object}</span>
                    <span style={this.spanStyle}>Department: {this.props.wo.mrc}</span>
                </Link>
            </li>
        )
    }

}