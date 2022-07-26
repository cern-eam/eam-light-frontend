import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import React, {Component} from 'react';
import WSEquipment from "../../../../tools/WSEquipment";
import Dependency from '../components/Dependency';
import { processElementInfo } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';

const fieldIsHidden = (info) =>
    info && info.attribute === 'H'

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
        let {equipment, positionLayout, updateEquipmentProperty} = this.props

        return (
            <React.Fragment>

                <EAMTextField
                    {...processElementInfo(positionLayout.fields['udfchar13'])}
                    readonly={true}
                    value={equipment.userDefinedFields.udfchar13}
                    updateProperty={updateEquipmentProperty}
                    valueKey="userDefinedFields.udfchar13"/>

                <EAMTextField
                    {...processElementInfo(positionLayout.fields['udfchar11'])}
                    readonly={true}
                    value={equipment.userDefinedFields.udfchar11}
                    updateProperty={updateEquipmentProperty}
                    valueKey="userDefinedFields.udfchar11"/>

                <EAMAutocomplete
                    {...processElementInfo(positionLayout.fields['asset'])}
                    value={equipment.hierarchyAssetCode}
                    updateProperty={(key, value) => this.updateDependencyProperty(key,value, equipment)}
                    valueKey="hierarchyAssetCode"
                    desc={equipment.hierarchyAssetDesc}
                    descKey="hierarchyAssetDesc"
                    autocompleteHandler={WSEquipment.autocompleteAssetParent}
                    renderDependencies={[equipment.hierarchyAssetDependent, equipment.hierarchyPositionDependent, equipment.hierarchyPrimarySystemDependent]}
                    endAdornment={<Dependency updateProperty={updateEquipmentProperty}
                                                value={equipment.hierarchyAssetDependent}
                                                valueKey="hierarchyAssetDependent"/>}
                />

                <EAMAutocomplete
                    {...processElementInfo(positionLayout.fields['parentasset'])}
                    value={equipment.hierarchyPositionCode}
                    updateProperty={(key, value) => this.updateDependencyProperty(key,value, equipment)}
                    valueKey="hierarchyPositionCode"
                    desc={equipment.hierarchyPositionDesc}
                    descKey="hierarchyPositionDesc"
                    autocompleteHandler={WSEquipment.autocompletePositionParent}
                    renderDependencies={[equipment.hierarchyAssetDependent, equipment.hierarchyPositionDependent, equipment.hierarchyPrimarySystemDependent]}
                    endAdornment={<Dependency updateProperty={updateEquipmentProperty}
                                            value={equipment.hierarchyPositionDependent}
                                            valueKey="hierarchyPositionDependent"/>}
                />

                <EAMAutocomplete
                    {...processElementInfo(positionLayout.fields['primarysystem'])}
                    value={equipment.hierarchyPrimarySystemCode}
                    updateProperty={(key, value) => this.updateDependencyProperty(key,value, equipment)}
                    valueKey="hierarchyPrimarySystemCode"
                    desc={equipment.hierarchyPrimarySystemDesc}
                    descKey="hierarchyPrimarySystemDesc"
                    autocompleteHandler={WSEquipment.autocompletePrimarySystemParent}
                    renderDependencies={[equipment.hierarchyAssetDependent, equipment.hierarchyPositionDependent, equipment.hierarchyPrimarySystemDependent]}
                    endAdornment={<Dependency updateProperty={updateEquipmentProperty}
                                            value={equipment.hierarchyPrimarySystemDependent}
                                            valueKey="hierarchyPrimarySystemDependent"/>}
                    />

                <EAMAutocomplete
                    {...processElementInfo(positionLayout.fields['location'])}
                    value={equipment.hierarchyLocationCode}
                    updateProperty={updateEquipmentProperty}
                    valueKey="hierarchyLocationCode"
                    desc={equipment.hierarchyLocationDesc}
                    descKey="hierarchyLocationDesc"
                    autocompleteHandler={WSEquipment.autocompleteLocation}/>

            </React.Fragment>
        )
    }
}

export default PositionHierarchy