import React, {Component} from 'react';
import Settings from 'mdi-material-ui/Settings';

export default class ChecklistEquipment extends Component {

    mainStyle = {
        marginTop: 15,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    }

    settingsIconStyle = {
        height: 20,
        color: "#7d7d7d"
    }

    render() {
        return (
            <div style={this.mainStyle}>
                <Settings style={this.settingsIconStyle}/>
                {this.props.equipmentCode} — {this.props.equipmentDesc}
            </div>
        )
    }
}