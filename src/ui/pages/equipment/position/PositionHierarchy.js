import React, {Component} from 'react';
import EAMInput from 'eam-components/dist/ui/components/muiinputs/EAMInput'
import EAMAutocomplete from 'eam-components/dist/ui/components/muiinputs/EAMAutocomplete'
import WSEquipment from "../../../../tools/WSEquipment";
import EAMCheckbox from 'eam-components/dist/ui/components/muiinputs/EAMCheckbox';

class PositionHierarchy extends Component {

    styles = {
        checkboxStyle: {
            display:"flex",
            paddingLeft: "10px",
            marginRight:"-23px",
            marginBottom: "-20px",
            marginTop: "-10px"
        },
        labelStyle: {
            display:"flex",
            alignItems:"center",
            padding:'0',
            marginBottom: "-20px",
            marginTop: "-10px"
        },
        dependencyRowStyle: {
            display: "flex",
            flexDirection:"row-reverse",
            fontSize:"10px",
            width: '100%'
        },
        dependencyCheckboxWrapperStyle: {
            display: "flex",
            flexDirection:"row",
        }
    }

    updateDependencyProperty = (key, value, equipment) => {
        let { updateEquipmentProperty } = this.props
        //inversed map of hierarchy properties. Asset Dependency has the highest priority.

        let hierarchyMap = {
            "hierarchyPrimarySystemCode": "hierarchyPrimarySystemDependent",
            "hierarchyPositionCode": "hierarchyPositionDependent",
        }

        //prevent the update of the checkboxes when component updates the description
        if (Object.keys(hierarchyMap).includes(key)) {
            if (value && equipment) {
                //index of currently checked checkbox - if no value is present indexExistant = -1
                let indexExistant = Object.values(hierarchyMap).map(prop => equipment[prop])
                    .findIndex(value => value && value !== false.toString())
                //index of edited hierarchy field
                let indexAfter = Object.keys(hierarchyMap).findIndex(prop => prop === key)

                if (indexAfter > indexExistant) {
                    updateEquipmentProperty(hierarchyMap[key], value ? true.toString(): false.toString())
                }

            }else{
                updateEquipmentProperty(hierarchyMap[key], false.toString());
            }
        }

        updateEquipmentProperty(key, value)
    }

    render() {
        let {equipment, children, positionLayout, updateEquipmentProperty} = this.props

        return (
            <div style={{width: "100%", marginTop: 0}}>

                <EAMInput
                    children={children}
                    elementInfo={{...positionLayout.fields['udfchar13'], readonly: true}}
                    value={equipment.userDefinedFields.udfchar13}
                    updateProperty={updateEquipmentProperty}
                    valueKey="userDefinedFields.udfchar13"/>

                <EAMInput
                    children={children}
                    elementInfo={{...positionLayout.fields['udfchar11'], readonly: true}}
                    value={equipment.userDefinedFields.udfchar11}
                    updateProperty={updateEquipmentProperty}
                    valueKey="userDefinedFields.udfchar11"/>

                <EAMAutocomplete
                    children={children}
                    elementInfo={positionLayout.fields['asset']}
                    value={equipment.hierarchyAssetCode}
                    updateProperty={(key, value) => this.updateDependencyProperty(key,value, equipment)}
                    valueKey="hierarchyAssetCode"
                    valueDesc={equipment.hierarchyAssetDesc}
                    descKey="hierarchyAssetDesc"
                    autocompleteHandler={WSEquipment.autocompleteAssetParent}/>

                <div style={this.styles.dependencyRowStyle}>
                    <div style={this.styles.dependencyCheckboxWrapperStyle}>
                        <span style={this.styles.labelStyle}>Dependent</span>
                        <div style={this.styles.checkboxStyle}>
                            <EAMCheckbox
                                elementInfo={{readonly: !equipment.hierarchyAssetCode}}
                                children = {children}
                                updateProperty={updateEquipmentProperty}
                                value={equipment.hierarchyAssetDependent}
                                valueKey="hierarchyAssetDependent"/>
                        </div>
                    </div>
                </div>

                <EAMAutocomplete
                    children={children}
                    elementInfo={positionLayout.fields['parentasset']}
                    value={equipment.hierarchyPositionCode}
                    updateProperty={(key, value) => this.updateDependencyProperty(key,value, equipment)}
                    valueKey="hierarchyPositionCode"
                    valueDesc={equipment.hierarchyPositionDesc}
                    descKey="hierarchyPositionDesc"
                    autocompleteHandler={WSEquipment.autocompletePositionParent}/>

                <div style={this.styles.dependencyRowStyle}>
                    <div style={this.styles.dependencyCheckboxWrapperStyle}>
                        <span style={this.styles.labelStyle}>Dependent</span>
                        <div style={this.styles.checkboxStyle}>
                            <EAMCheckbox
                                elementInfo={{readonly: !equipment.hierarchyPositionCode}}
                                children = {children}
                                updateProperty={updateEquipmentProperty}
                                value={equipment.hierarchyPositionDependent}
                                valueKey="hierarchyPositionDependent"/>
                        </div>
                    </div>
                </div>

                <EAMAutocomplete
                    children={children}
                    elementInfo={positionLayout.fields['primarysystem']}
                    value={equipment.hierarchyPrimarySystemCode}
                    updateProperty={(key, value) => this.updateDependencyProperty(key,value, equipment)}
                    valueKey="hierarchyPrimarySystemCode"
                    valueDesc={equipment.hierarchyPrimarySystemDesc}
                    descKey="hierarchyPrimarySystemDesc"
                    autocompleteHandler={WSEquipment.autocompletePrimarySystemParent}/>

                <div style={this.styles.dependencyRowStyle}>
                    <div style={this.styles.dependencyCheckboxWrapperStyle}>
                        <span style={this.styles.labelStyle}>Dependent</span>
                        <div style={this.styles.checkboxStyle}>
                            <EAMCheckbox
                                elementInfo={{readonly: !equipment.hierarchyPrimarySystemCode}}
                                children = {children}
                                updateProperty={updateEquipmentProperty}
                                value={equipment.hierarchyPrimarySystemDependent}
                                valueKey="hierarchyPrimarySystemDependent"/>
                        </div>
                    </div>
                </div>

                <EAMAutocomplete
                    children={children}
                    elementInfo={positionLayout.fields['location']}
                    value={equipment.hierarchyLocationCode}
                    updateProperty={updateEquipmentProperty}
                    valueKey="hierarchyLocationCode"
                    valueDesc={equipment.hierarchyLocationDesc}
                    descKey="hierarchyLocationDesc"
                    autocompleteHandler={WSEquipment.autocompleteLocation}/>

            </div>
        )
    }
}

export default PositionHierarchy