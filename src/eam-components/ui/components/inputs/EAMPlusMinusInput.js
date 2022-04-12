import React from 'react';
import {TRECIcon} from 'eam-components/ui/components/icons/index';

class EAMPlusMinusInput extends React.Component {

    equipmentDivStyle = {
        width: "80%",
        display: "flex",
        alignItems: "center"
    }

    equipmentColumnStyle = {
        width: "70%",
        flexDirection: "row",
        padding: "20px",
        display: "flex",
        minWidth: "350px",
        maxWidth: "830px",
        flexWrap: "wrap"
    }

    iconContainerStyle = {
        fontSize: "50px",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "10px"
    }

    iconStyle = {
        margin: "10px",
        color: "#2196F3",
        cursor: "pointer"
    }

    render() {
        return (
            <React.Fragment>
                <div style={this.equipmentColumnStyle}>
                    <div style={this.equipmentDivStyle}>
                        {this.props.children}
                    </div>
                    <div style={this.iconContainerStyle}>
                        <TRECIcon
                            icon="fa fa-plus"
                            style={this.iconStyle}
                            onClick={this.props.handlePlusClick}
                        />
                        <TRECIcon
                            icon="fa fa-minus"
                            style={this.iconStyle}
                            onClick={this.props.handleMinusClick}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default EAMPlusMinusInput;