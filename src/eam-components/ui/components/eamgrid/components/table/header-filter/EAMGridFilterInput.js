import React, { Component } from 'react';

export default class EAMGridFilterInput extends Component {

    inputStyle = {
        width: "100%",
        flex: "1 1 auto",
        border: "1px solid #ced4da",
        borderLeftWidth: 0,
        paddingLeft: "5px",
        height: 27,
        fontSize: 16,
        transition: "border-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        borderRadius: 4,
        backgroundColor: "#fff",
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        zIndex: 20
    }


    render() {
        return (
            <input disabled={this.props.inputDisabled}
                   style={this.inputStyle}
                   value={this.props.value}
                   onChange={this.props.onChange}
                   onKeyPress = {this.props.onKeyPress}
                   onClick={this.props.onClick}/>
        )
    }
}
