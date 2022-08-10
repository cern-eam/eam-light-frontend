import React from 'react';
import WSEquipment from "../../../../tools/WSEquipment";
import StatusRow from "../../../components/statusrow/StatusRow"
import EquipmentTools from "../EquipmentTools"
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import EAMUDF from 'eam-components/dist/ui/components/inputs-ng/EAMUDF';
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';

const AssetGeneral = (props) => {

    const {
        equipment,
        assetLayout,
        updateEquipmentProperty,
        showNotification,
        newEntity,
        statuses,
        register,
    } = props;

    // TODO: find alternative
    const updateEquipmentStatus = EquipmentTools.getUpdateStatus(
        updateEquipmentProperty,
        showNotification
    );

    return (
        <React.Fragment>

            {newEntity && <EAMTextField {...register('equipmentno', 'code')} />}

            <EAMTextField {...register('alias', 'alias')} />

            <EAMUDF
                elementInfo={assetLayout.fields['udfchar45']}
                value={equipment.userDefinedFields.udfchar45}
                updateProperty={updateEquipmentProperty}
                valueKey="userDefinedFields.udfchar45"
            />

            <EAMTextField {...register('equipmentdesc', 'description')} />

            <EAMAutocomplete
                {...register('department', 'departmentCode', 'departmentDesc')}
                autocompleteHandler={
                    WSEquipment.autocompleteEquipmentDepartment
                }
            />

            <EAMSelect
                {...register('assetstatus', 'statusCode')}
                options={statuses}
            />
            
            <EAMSelect
                {...register('state', 'stateCode')}
                autocompleteHandler={WSEquipment.getEquipmentStateValues}
            />

            <StatusRow
                entity={equipment}
                entityType={"equipment"}
                style={{marginTop: "10px", marginBottom: "-10px"}}
            />
        </React.Fragment>
    )
}

export default AssetGeneral;
