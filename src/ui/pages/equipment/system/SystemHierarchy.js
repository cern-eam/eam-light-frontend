import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import React from 'react';
import WSEquipment from "../../../../tools/WSEquipment";
import Dependency from '../components/Dependency';
import { onChangeDependentInput, isDependencySet } from '../EquipmentTools';

const DEPENDENCY_KEYS = {
    primarySystem: 'hierarchyPrimarySystemDependent'
}

const SystemHierarchy = (props) => {

    const { equipment, updateEquipmentProperty, register, showWarning } = props;

    const renderDependenciesForDependencyInputs = [
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
                {...register('primarysystem', 'hierarchyPrimarySystemCode', 'hierarchyPrimarySystemDesc')}
                onChangeValue={(value) => {
                    onChangeDependentInput(
                        value,
                        DEPENDENCY_KEYS.primarySystem,
                        DEPENDENCY_KEYS,
                        equipment,
                        updateEquipmentProperty,
                        showWarning
                    );
                }}
                autocompleteHandler={WSEquipment.autocompletePrimarySystemParent}
                renderDependencies={renderDependenciesForDependencyInputs}
                endAdornment={
                    <Dependency
                        updateProperty={updateEquipmentProperty}
                        value={equipment[DEPENDENCY_KEYS.primarySystem]}
                        valueKey={DEPENDENCY_KEYS.primarySystem}
                        disabled={!equipment.hierarchyPrimarySystemCode}
                    />
                }
                barcodeScanner
            />

            <EAMAutocomplete
                {...register('location', 'hierarchyLocationCode', 'hierarchyLocationDesc')}
                autocompleteHandler={WSEquipment.autocompleteLocation}
                disabled={isDependencySet(equipment, DEPENDENCY_KEYS)}
            />

        </React.Fragment>
    )
}

export default SystemHierarchy;
