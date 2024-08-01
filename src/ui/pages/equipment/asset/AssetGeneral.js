import React, { useState } from 'react';
import WSEquipment from "../../../../tools/WSEquipment";
import WS from "../../../../tools/WS";
import StatusRow from "../../../components/statusrow/StatusRow"
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import { isDepartmentReadOnly, isMultiOrg } from 'ui/pages/EntityTools';
import EAMUDF from 'ui/components/userdefinedfields/EAMUDF';
import GridWS from 'eam-components/dist/ui/components/eamgrid/lib/GridWS';

async function fetchHasHazards(equipmentCode) {
    const gridRequest = {
        rowCount: 1,
        params: {
            //equipmentno: equipmentCode,
            "parameter.object": equipmentCode,
            "parameter.objorganization": "*",
        },
        gridName: "OSOBJA_ESF",
        userFunctionName: 'OSOBJA'
    };
    const gridData = await GridWS.getGridData(gridRequest);
    return gridData.body.data.records !== '0';
}

const AssetGeneral = (props) => {

    const {
        equipment,
        newEntity,
        statuses,
        register,
        userData,
        screenCode,
        screenPermissions
    } = props;

    const [hasHazards, setHasHazards] = useState(false);
    fetchHasHazards(equipment.code).then(setHasHazards);

    return (
        <React.Fragment>

            {isMultiOrg && newEntity && <EAMSelect {...register('organization', 'organization')}
            autocompleteHandler={WS.getOrganizations}
            autocompleteHandlerParams={[screenCode]}/>}

            {newEntity && <EAMTextField {...register('equipmentno', 'code')}/>}

            <EAMTextField {...register('alias', 'alias')} barcodeScanner/>

            <EAMUDF
                {...register('udfchar45','userDefinedFields.udfchar45')}/>

            <EAMTextField {...register('equipmentdesc', 'description')} />

            <EAMAutocomplete
                {...register('department', 'departmentCode', 'departmentDesc')}
                autocompleteHandler={
                    WSEquipment.autocompleteEquipmentDepartment
                }
            />

            <EAMSelect
                {...register('assetstatus', 'statusCode')}
                disabled={isDepartmentReadOnly(equipment.departmentCode, userData) || !screenPermissions.updateAllowed}
                options={statuses}
            />
            
            <EAMSelect
                {...register('state', 'stateCode')}
                autocompleteHandler={WSEquipment.getEquipmentStateValues}
            />
            <StatusRow
                entity={equipment}
                entityType={"equipment"}
                hasHazards={hasHazards}
                style={{marginTop: "10px", marginBottom: "-10px"}}
            />
        </React.Fragment>
    )
}

export default AssetGeneral;
