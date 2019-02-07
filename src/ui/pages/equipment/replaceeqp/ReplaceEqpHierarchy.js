import React from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import EAMInput from "eam-components/dist/ui/components/muiinputs/EAMInput";
import EAMCheckbox from "eam-components/dist/ui/components/muiinputs/EAMCheckbox";
import WSEquipment from "../../../../tools/WSEquipment";
import EISTable from 'eam-components/dist/ui/components/table';

class ReplaceEqpHierarchy extends React.Component {

    headers = ['Type', 'Equipment', 'Dependent', 'Cost Roll Up'];
    propCodes = ['childTypeDesc', 'childCode', 'dependent', 'costRollUp'];
    linksMap = new Map([['childCode', {linkType: 'fixed', linkValue: 'equipment/', linkPrefix: '/'}]]);

    state = {
        children: []
    };

    componentWillReceiveProps(newProps) {
        //Check if there is equipment
        if (newProps.equipment && newProps.equipment !== this.props.equipment) {
            //Fetch children
            WSEquipment.getEquipmentChildren(newProps.equipment.code).then(response => {
                this.setState(() => ({children: response.body.data}));
            }).catch(error => {
                console.log(error);
            })
        }
    }

    renderAssetData = () => {
        if (!this.props.equipment.hierarchyAssetCode) {
            return <div/>;
        }
        return (
            <div>
                <EAMInput elementInfo={{...this.props.equipmentLayout.fields['parentasset'], readonly: true}}
                          value={this.props.equipment.hierarchyAssetCode}
                          valueKey="hierarchyAssetCode"/>

                <EAMCheckbox
                    elementInfo={{...this.props.equipmentLayout.fields['dependentonparentasset'], readonly: true}}
                    value={this.props.equipment.hierarchyAssetDependent}
                    valueKey="hierarchyAssetDependent"/>

                <EAMCheckbox
                    elementInfo={{...this.props.equipmentLayout.fields['costrollupparentasset'], readonly: true}}
                    value={this.props.equipment.hierarchyAssetCostRollUp}
                    valueKey="hierarchyAssetCostRollUp"/>
            </div>);
    };

    renderPositionData = () => {
        if (!this.props.equipment.hierarchyPositionCode) {
            return <div/>;
        }
        return (
            <div>
                <EAMInput elementInfo={{...this.props.equipmentLayout.fields['position'], readonly: true}}
                          value={this.props.equipment.hierarchyPositionCode}
                          valueKey="hierarchyPositionCode"/>

                <EAMCheckbox elementInfo={{...this.props.equipmentLayout.fields['dependentonposition'], readonly: true}}
                             value={this.props.equipment.hierarchyPositionDependent}
                             valueKey="hierarchyPositionDependent"/>

                <EAMCheckbox elementInfo={{...this.props.equipmentLayout.fields['costrollupposition'], readonly: true}}
                             value={this.props.equipment.hierarchyPositionCostRollUp}
                             valueKey="hierarchyPositionCostRollUp"/>
            </div>);
    };

    renderChildren = () => {
        if (this.state.children.length === 0) {
            return <div/>;
        }
        return (
            <div>
                <h4 style={{marginBottom: '-5px'}}>Children</h4>
                <EISTable data={this.state.children} headers={this.headers} propCodes={this.propCodes}
                          linksMap={this.linksMap}/>
            </div>
        );
    }

    render() {
        if (!this.props.equipment) {
            return <div/>;
        }
        return (<EISPanel heading={this.props.title}>
                <div style={{width: "100%", marginTop: 0}}>
                    {this.renderAssetData()}
                    {this.renderPositionData()}

                    {this.props.equipment.hierarchyLocationCode &&
                    <EAMInput elementInfo={{...this.props.equipmentLayout.fields['location'], readonly: true}}
                              value={this.props.equipment.hierarchyLocationCode}
                              valueKey="hierarchyLocationCode"/>
                    }
                    {this.renderChildren()}
                </div>
            </EISPanel>
        );
    }
};


export default ReplaceEqpHierarchy;