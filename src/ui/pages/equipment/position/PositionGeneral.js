import React, {Component} from 'react';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import WSEquipment from "../../../../tools/WSEquipment";
import StatusRow from "../../../components/statusrow/StatusRow"
import EquipmentTools from '../EquipmentTools';

const PositionGeneral = (props) => {

    const {
        equipment,
        updateEquipmentProperty,
        newEntity,
        showNotification,
        register,
        statuses
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

            <EAMTextField {...register('udfchar45', 'userDefinedFields.udfchar45')} />

            <EAMTextField {...register('equipmentdesc', 'description')} />

            <EAMAutocomplete
                {...register('department', 'departmentCode', 'departmentDesc')}
                autocompleteHandler={
                    WSEquipment.autocompleteEquipmentDepartment
                }
            />

            <EAMSelect
                {...register('assetstatus', 'statusCode')}
                options = {statuses}
            />

            <StatusRow
                entity={equipment}
                entityType={"equipment"}
                style={{ marginTop: "10px", marginBottom: "-10px" }}
            />
        </React.Fragment>
    );
}

export default PositionGeneral;
