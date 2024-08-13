import React from 'react';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import WSEquipment from "../../../../tools/WSEquipment";
import WS from "../../../../tools/WS";
import StatusRow from "../../../components/statusrow/StatusRow";
import { isDepartmentReadOnly, isMultiOrg } from 'ui/pages/EntityTools';

const SystemGeneral = (props) => {

    const {
        equipment,
        newEntity,
        register,
        statuses,
        userData,
        screenCode,
        screenPermissions
    } = props;


    return (
        <React.Fragment>

            {isMultiOrg && newEntity && <EAMSelect {...register('organization', 'organization')}
            autocompleteHandler={WS.getOrganizations}
            autocompleteHandlerParams={[screenCode]}/>}

            {newEntity && <EAMTextField {...register('equipmentno', 'code')}/>}

            <EAMTextField {...register('alias', 'alias')} />

            <EAMTextField {...register('udfchar45', 'userDefinedFields.udfchar45')} />

            <EAMTextField {...register('equipmentdesc', 'description')} />

            <EAMAutocomplete
                {...register('department', 'departmentCode', 'departmentDesc')}
                autocompleteHandler={WSEquipment.autocompleteEquipmentDepartment}
            />

            <EAMSelect
                {...register('assetstatus', 'statusCode')}
                disabled={isDepartmentReadOnly(equipment.departmentCode, userData) || !screenPermissions.updateAllowed}
                options = {statuses}
            />

            <StatusRow
                entity={equipment}
                entityType={"equipment"}
                screenCode={screenCode}
                style={{marginTop: "10px", marginBottom: "-10px"}}
            />
        </React.Fragment>
    )
}

export default SystemGeneral;