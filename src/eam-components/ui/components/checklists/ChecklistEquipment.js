import React, {Component} from 'react';
import Cog from 'mdi-material-ui/Cog';

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
                <Cog style={this.settingsIconStyle}/>
                {this.props.equipmentCode} — {this.props.equipmentDesc}
            </div>
        )
    }
}