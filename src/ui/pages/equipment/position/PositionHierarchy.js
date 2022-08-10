import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import React, { useEffect } from 'react';
import WSEquipment from "../../../../tools/WSEquipment";
import Dependency from '../components/Dependency';

const DEPENDENCY_KEYS = {
    parentAsset: 'hierarchyAssetDependent',
    parentPosition: 'hierarchyPositionDependent',
    primarySystem: 'hierarchyPrimarySystemDependent'
}

const PositionHierarchy = (props) => {
    const { equipment, updateEquipmentProperty, register, showWarning } = props;

    const onChangeDependentInput = (value, dependencyKey) => {
        // We only set a dependency when we still have no dependent set
        if (value &&
            equipment.hierarchyAssetDependent === 'false' &&
            equipment.hierarchyPositionDependent === 'false' &&
            equipment.hierarchyPrimarySystemDependent === 'false'
        ) {
            updateEquipmentProperty(dependencyKey, true.toString());
        // If there is already a dependency (not on the current input) we warn the users:
        } else if (value && equipment[dependencyKey] === 'false') {
            showWarning('Changing this value does not change the dependent.\
                         Please press the respective dependency icon \
                         if you would like to set it as dependent.');
        // Set as not dependent on input clear
        } else if (!value) {
            updateEquipmentProperty(dependencyKey, false.toString());
        }
    };

    // Check whether there is a dependency set
    const disableLocationInput = [
        equipment.hierarchyAssetDependent,
        equipment.hierarchyPositionDependent,
        equipment.hierarchyPrimarySystemDependent,
    ].includes('true');

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
                onChangeValue={(value) => {
                    onChangeDependentInput(value, DEPENDENCY_KEYS.parentAsset);
                }}
                autocompleteHandler={WSEquipment.autocompleteAssetParent}
                renderDependencies={[equipment.hierarchyAssetDependent, equipment.hierarchyPositionDependent, equipment.hierarchyPrimarySystemDependent]}
                endAdornment={
                    <Dependency
                        updateProperty={updateEquipmentProperty}
                        value={equipment.hierarchyAssetDependent}
                        valueKey={DEPENDENCY_KEYS.parentAsset}
                        disabled={!equipment.hierarchyAssetCode}
                        relatedDependenciesKeysMap={DEPENDENCY_KEYS}
                    />
                }
                barcodeScanner
            />

            <EAMAutocomplete
                {...register('parentasset', 'hierarchyPositionCode', 'hierarchyPositionDesc')}
                onChangeValue={(value) => {
                    onChangeDependentInput(value, DEPENDENCY_KEYS.parentPosition);
                }}
                autocompleteHandler={WSEquipment.autocompletePositionParent}
                renderDependencies={[equipment.hierarchyAssetDependent, equipment.hierarchyPositionDependent, equipment.hierarchyPrimarySystemDependent]}
                endAdornment={
                    <Dependency
                        updateProperty={updateEquipmentProperty}
                        value={equipment.hierarchyPositionDependent}
                        valueKey={DEPENDENCY_KEYS.parentPosition}
                        disabled={!equipment.hierarchyPositionCode}
                        relatedDependenciesKeysMap={DEPENDENCY_KEYS}
                    />
                }
                barcodeScanner
            />

            <EAMAutocomplete
                {...register('primarysystem', 'hierarchyPrimarySystemCode', 'hierarchyPrimarySystemDesc')}
                onChangeValue={(value) => {
                    onChangeDependentInput(value, DEPENDENCY_KEYS.primarySystem);
                }}
                autocompleteHandler={WSEquipment.autocompletePrimarySystemParent}
                renderDependencies={[equipment.hierarchyAssetDependent, equipment.hierarchyPositionDependent, equipment.hierarchyPrimarySystemDependent]}
                endAdornment={
                    <Dependency
                        updateProperty={updateEquipmentProperty}
                        value={equipment.hierarchyPrimarySystemDependent}
                        valueKey={DEPENDENCY_KEYS.primarySystem}
                        disabled={!equipment.hierarchyPrimarySystemCode}
                        relatedDependenciesKeysMap={DEPENDENCY_KEYS}
                    />
                }
                barcodeScanner
            />

            <EAMAutocomplete
                {...register('location', 'hierarchyLocationCode', 'hierarchyLocationDesc')}
                autocompleteHandler={WSEquipment.autocompleteLocation}
                disabled={disableLocationInput}
            />

        </React.Fragment>
    )
}

export default PositionHierarchy;
