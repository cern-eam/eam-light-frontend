import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import React, {Component} from 'react';
import WSEquipment from "../../../../tools/WSEquipment";
import Dependency from '../components/Dependency';

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

    // TODO: find alternative
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
        let { equipment, updateEquipmentProperty, register } = this.props

        return (
            <React.Fragment>

                <EAMTextField
                    {...register('udfchar13', 'userDefinedFields.udfchar13')}
                    readonly={true}
                />

                <EAMTextField
                    {...register('udfchar11', 'userDefinedFields.udfchar11')}
                    readonly={true}
                />

                <EAMAutocomplete
                    {...register('asset', 'hierarchyAssetCode', 'hierarchyAssetDesc')}
                    updateProperty={(key, value) => this.updateDependencyProperty(key,value, equipment)} // TODO: find alternative
                    autocompleteHandler={WSEquipment.autocompleteAssetParent}
                    renderDependencies={[equipment.hierarchyAssetDependent, equipment.hierarchyPositionDependent, equipment.hierarchyPrimarySystemDependent]}
                    endAdornment={<Dependency updateProperty={updateEquipmentProperty}
                                                value={equipment.hierarchyAssetDependent}
                                                valueKey="hierarchyAssetDependent"/>}
                />

                <EAMAutocomplete
                    {...register('parentasset', 'hierarchyPositionCode', 'hierarchyPositionDesc')}
                    updateProperty={(key, value) => this.updateDependencyProperty(key,value, equipment)} // TODO: find alternative
                    autocompleteHandler={WSEquipment.autocompletePositionParent}
                    renderDependencies={[equipment.hierarchyAssetDependent, equipment.hierarchyPositionDependent, equipment.hierarchyPrimarySystemDependent]}
                    endAdornment={<Dependency updateProperty={updateEquipmentProperty}
                                            value={equipment.hierarchyPositionDependent}
                                            valueKey="hierarchyPositionDependent"/>}
                />

                <EAMAutocomplete
                    {...register('primarysystem', 'hierarchyPrimarySystemCode', 'hierarchyPrimarySystemDesc')}
                    updateProperty={(key, value) => this.updateDependencyProperty(key,value, equipment)} // TODO: find alternative
                    autocompleteHandler={WSEquipment.autocompletePrimarySystemParent}
                    renderDependencies={[equipment.hierarchyAssetDependent, equipment.hierarchyPositionDependent, equipment.hierarchyPrimarySystemDependent]}
                    endAdornment={<Dependency updateProperty={updateEquipmentProperty}
                                            value={equipment.hierarchyPrimarySystemDependent}
                                            valueKey="hierarchyPrimarySystemDependent"/>}
                />

                <EAMAutocomplete
                    {...register('location', 'hierarchyLocationCode', 'hierarchyLocationDesc')}
                    autocompleteHandler={WSEquipment.autocompleteLocation}
                />

            </React.Fragment>
        )
    }
}

export default PositionHierarchy