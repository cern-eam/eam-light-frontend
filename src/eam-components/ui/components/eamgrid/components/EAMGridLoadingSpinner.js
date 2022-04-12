import React, { Component } from 'react';
import BlockUi from 'react-block-ui';

export default class DataGridLoadingSpinner extends Component {

    blockUiStyle = {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }

    blockUiStyleDiv = {
        display: "flex",
        height: 60,
        alignItems: "flex-end"
    }

    render() {
        return (
            <div>
                {
                    this.props.isloading &&
                    <BlockUi tag="div" blocking={true} style={this.blockUiStyle}>
                        <div style={this.blockUiStyleDiv}></div>
                    </BlockUi>
                }
            </div>
        );
    }
}