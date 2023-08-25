import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import React from 'react';
import WSEquipment from "../../../../tools/WSEquipment";
import Dependency from '../components/Dependency';
import { onChangeDependentInput, isDependencySet, COST_ROLL_UP_CODES, updateCostRollUpProperty } from '../EquipmentTools';

const DEPENDENCY_KEYS = {
    asset: 'hierarchyAssetDependent',
    position: 'hierarchyPositionDependent',
    primarySystem: 'hierarchyPrimarySystemDependent'
}

const PositionHierarchy = (props) => {
    const { equipment, updateEquipmentProperty, register, readOnly, showWarning } = props;

    const renderDependenciesForDependencyInputs = [
        equipment[DEPENDENCY_KEYS.asset],
        equipment[DEPENDENCY_KEYS.position],
        equipment[DEPENDENCY_KEYS.primarySystem],
    ];

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
                {...register('asset', 'hierarchyAssetCode', 'hierarchyAssetDesc', 'hierarchyAssetOrg',
                value => {
                    onChangeDependentInput(
                        value,
                        DEPENDENCY_KEYS.asset,
                        DEPENDENCY_KEYS,
                        equipment,
                        updateEquipmentProperty,
                        showWarning
                    );
                    updateCostRollUpProperty(
                        COST_ROLL_UP_CODES.asset,
                        value,
                        updateEquipmentProperty
                    );
                })}
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
                barcodeScanner
            />

            <EAMAutocomplete
                {...register('parentasset', 'hierarchyPositionCode', 'hierarchyPositionDesc', 'hierarchyPositionOrg',
                value => {
                    onChangeDependentInput(
                        value,
                        DEPENDENCY_KEYS.position,
                        DEPENDENCY_KEYS,
                        equipment,
                        updateEquipmentProperty,
                        showWarning
                    );
                    updateCostRollUpProperty(
                        COST_ROLL_UP_CODES.position,
                        value,
                        updateEquipmentProperty
                    );
                })}
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
                barcodeScanner
            />

            <EAMAutocomplete
                {...register('primarysystem', 'hierarchyPrimarySystemCode', 'hierarchyPrimarySystemDesc', 'hierarchyPrimarySystemOrg',
                value => {
                    onChangeDependentInput(
                        value,
                        DEPENDENCY_KEYS.primarySystem,
                        DEPENDENCY_KEYS,
                        equipment,
                        updateEquipmentProperty,
                        showWarning
                    );
                    updateCostRollUpProperty(
                        COST_ROLL_UP_CODES.primarySystem,
                        value,
                        updateEquipmentProperty
                    );
                })}
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
                barcodeScanner
            />

            <EAMAutocomplete
                {...register('location', 'hierarchyLocationCode', 'hierarchyLocationDesc')}
                autocompleteHandler={WSEquipment.autocompleteLocation}
                disabled={readOnly || isDependencySet(equipment, DEPENDENCY_KEYS)}
            />

        </React.Fragment>
    )
}

export default PositionHierarchy;
