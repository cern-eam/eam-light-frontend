import React, {Component} from 'react';
import WSEquipment from "../../../../tools/WSEquipment";
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import Dependency from '../components/Dependency';
import EAMUDF from 'ui/components/userdefinedfields/EAMUDF';

const fieldIsHidden = (info) =>
    info && info.attribute === 'H'

class AssetHierarchy extends Component {

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
            "hierarchyAssetCode": "hierarchyAssetDependent",
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
                    if(indexExistant !== -1){
                        Object.values(hierarchyMap).forEach(hierarchyProp => {
                            updateEquipmentProperty(hierarchyProp, false.toString());
                        })
                    }
                    updateEquipmentProperty(hierarchyMap[key], true.toString())
                }
            }else{
                updateEquipmentProperty(hierarchyMap[key], false.toString());
            }
        }

        updateEquipmentProperty(key, value)
    }

    render() {
        let { equipment, assetLayout, updateEquipmentProperty, register } = this.props

        return (
            <React.Fragment>

                <EAMUDF
                    {...register('udfchar13','userDefinedFields.udfchar13')}/>

                <EAMUDF
                    {...register('udfchar11','userDefinedFields.udfchar11')}/>

                <EAMAutocomplete
                    {...register('parentasset', 'hierarchyAssetCode', 'hierarchyAssetDesc')}
                    barcodeScanner
                    autocompleteHandler={WSEquipment.autocompleteAssetParent}
                    renderDependencies={[equipment.hierarchyAssetDependent, equipment.hierarchyPositionDependent, equipment.hierarchyPrimarySystemDependent]}
                    endAdornment={<Dependency updateProperty={updateEquipmentProperty}
                                                value={equipment.hierarchyAssetDependent}
                                                valueKey="hierarchyAssetDependent"/>}
                />
                
                <EAMAutocomplete
                    {...register('position', 'hierarchyPositionCode', 'hierarchyPositionDesc')}
                    barcodeScanner
                    autocompleteHandler={WSEquipment.autocompletePositionParent}
                    renderDependencies={[equipment.hierarchyAssetDependent, equipment.hierarchyPositionDependent, equipment.hierarchyPrimarySystemDependent]}
                    endAdornment={<Dependency updateProperty={updateEquipmentProperty}
                                            value={equipment.hierarchyPositionDependent}
                                            valueKey="hierarchyPositionDependent"/>}
                />
                
                <EAMAutocomplete
                    {...register('primarysystem', 'hierarchyPrimarySystemCode', 'hierarchyPrimarySystemDesc')}
                    barcodeScanner
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

export default AssetHierarchy