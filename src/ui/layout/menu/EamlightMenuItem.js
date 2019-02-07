import React, { Component } from 'react';
import { Link } from 'react-router-dom'

export default class EamlightMenuItem extends Component {

    render() {
        if (this.props.onClick) {
            return (
                <li style={{marginTop: 15}}>
                    <a href="#foo" onClick={this.props.onClick}>
                        {this.props.icon}
                        <span>{this.props.label}</span>
                    </a>
                </li>
            )
        }

        return (
            <li style={{marginTop: 15}}>
                <Link to={"/" + this.props.link} >
                    {this.props.icon}
                    <span>{this.props.label}</span>
                </Link>
            </li>
        )
    }
}