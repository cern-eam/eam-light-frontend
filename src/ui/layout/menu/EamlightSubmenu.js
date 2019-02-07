import React, { Component } from 'react';

export default class EamlightSubmenu extends Component {

    render() {
        return (
            <ul className="layout-tab-submenu" id={this.props.id}>
                <li>
                    {this.props.header}
                    <ul>
                        {this.props.children}
                    </ul>
                </li>
            </ul>
        )
    }
}