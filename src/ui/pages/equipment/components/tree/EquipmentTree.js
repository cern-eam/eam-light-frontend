import React, {Component} from 'react';
import EAMTree from '../../../../../ui/components/eqtree/EAMTree';

class EquipmentTree extends Component {


    treeDivStyle= {
        height: "calc(100% - 56px)",
        backgroundColor: 'white',
        width: "100%"
    }


    headerStyle = {
        fontWeight: 500,
        paddingLeft: 10,
        display: "flex",
        height: 50,
        alignItems: "center",
        backgroundColor: "#fafafa",
        boxShadow: "0 1px 0 rgba(0, 0, 0, 0.06), 0 2px 0 rgba(0, 0, 0, 0.075), 0 3px 0 rgba(0, 0, 0, 0.05), 0 4px 0 rgba(0, 0, 0, 0.015)"
    }

    render() {
        return (

            <div style={{height: "100%"}}>
                {
                this.props.hideHeader ? null
                    : <div style={this.headerStyle}>
                        <div>Equipment Tree</div>
                    </div>
                }
                <div style={this.treeDivStyle}>
                    <EAMTree code={this.props.equipmentCode}
                             history={this.props.history}/>
                </div>
            </div>

        )
    }
}

export default EquipmentTree