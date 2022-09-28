import React from 'react';
import WSEquipment from "../../../../tools/WSEquipment";
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import Dependency from '../components/Dependency';
import EAMUDF from 'ui/components/userdefinedfields/EAMUDF';
import { onChangeDependentInput, isDependencySet } from '../EquipmentTools';

const DEPENDENCY_KEYS = {
    asset: 'hierarchyAssetDependent',
    position: 'hierarchyPositionDependent',
    primarySystem: 'hierarchyPrimarySystemDependent'
}

const AssetHierarchy = (props) => {
    const { equipment, updateEquipmentProperty, register, readOnly, showWarning } = props;

    const renderDependenciesForDependencyInputs = [
        equipment[DEPENDENCY_KEYS.asset],
        equipment[DEPENDENCY_KEYS.position],
        equipment[DEPENDENCY_KEYS.primarySystem],
    ];

    return (
        <React.Fragment>

            <EAMUDF
                {...register('udfchar13','userDefinedFields.udfchar13')}/>

            <EAMUDF
                {...register('udfchar11','userDefinedFields.udfchar11')}/>

            <EAMAutocomplete
                {...register('parentasset', 'hierarchyAssetCode', 'hierarchyAssetDesc', null,
                value => {
                    onChangeDependentInput(
                        value,
                        DEPENDENCY_KEYS.asset,
                        DEPENDENCY_KEYS,
                        equipment,
                        updateEquipmentProperty,
                        showWarning
                    );
                })}
                barcodeScanner
                autocompleteHandler={WSEquipment.autocompleteAssetParent}
                renderDependencies={renderDependenciesForDependencyInputs}
                endAdornment={
                    <Dependency
                        updateProperty={updateEquipmentProperty}
                        value={equipment[DEPENDENCY_KEYS.asset]}
                        valueKey={DEPENDENCY_KEYS.asset}
                        disabled={!equipment.hierarchyAssetCode}
                        dependencyKeysMap={DEPENDENCY_KEYS}
                    />
                }
            />
            
            <EAMAutocomplete
                {...register('position', 'hierarchyPositionCode', 'hierarchyPositionDesc', null,
                value => {
                    onChangeDependentInput(
                        value,
                        DEPENDENCY_KEYS.position,
                        DEPENDENCY_KEYS,
                        equipment,
                        updateEquipmentProperty,
                        showWarning
                    );
                })}
                barcodeScanner
                autocompleteHandler={WSEquipment.autocompletePositionParent}
                renderDependencies={renderDependenciesForDependencyInputs}
                endAdornment={
                    <Dependency
                        updateProperty={updateEquipmentProperty}
                        value={equipment[DEPENDENCY_KEYS.position]}
                        valueKey={DEPENDENCY_KEYS.position}
                        disabled={!equipment.hierarchyPositionCode}
                        dependencyKeysMap={DEPENDENCY_KEYS}
                    />
                }
            />
            
            <EAMAutocomplete
                {...register('primarysystem', 'hierarchyPrimarySystemCode', 'hierarchyPrimarySystemDesc', null,
                value => {
                    onChangeDependentInput(
                        value,
                        DEPENDENCY_KEYS.primarySystem,
                        DEPENDENCY_KEYS,
                        equipment,
                        updateEquipmentProperty,
                        showWarning
                    );
                })}
                barcodeScanner
                autocompleteHandler={WSEquipment.autocompletePrimarySystemParent}
                renderDependencies={renderDependenciesForDependencyInputs}
                endAdornment={
                    <Dependency
                        updateProperty={updateEquipmentProperty}
                        value={equipment[DEPENDENCY_KEYS.primarySystem]}
                        valueKey={DEPENDENCY_KEYS.primarySystem}
                        disabled={!equipment.hierarchyPrimarySystemCode}
                        dependencyKeysMap={DEPENDENCY_KEYS}
                    />
                }
            />
                
            <EAMAutocomplete
                {...register('location', 'hierarchyLocationCode', 'hierarchyLocationDesc')}
                autocompleteHandler={WSEquipment.autocompleteLocation}
                disabled={readOnly || isDependencySet(equipment, DEPENDENCY_KEYS)}
            />
        </React.Fragment>
    )
}

export default AssetHierarchy;
