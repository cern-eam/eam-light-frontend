import React from "react";
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import WS from "../../../../tools/WS";
import StatusRow from "../../../components/statusrow/StatusRow";
import { processElementInfo } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';

const AssetGeneral = props => {
    const {
        location,
        locationLayout,
        updateEquipmentProperty,
        newEntity,
    } = props;

    return (
        <React.Fragment>
            {newEntity && (
                <EAMTextField
                    {...processElementInfo(locationLayout.fields["equipmentno"])}
                    value={location.code}
                    updateProperty={updateEquipmentProperty}
                    valueKey="code"
                />
            )}

            <EAMTextField
                {...processElementInfo(locationLayout.fields["udfchar45"])}
                value={location.userDefinedFields.udfchar45}
                updateProperty={updateEquipmentProperty}
                valueKey="userDefinedFields.udfchar45"
            />

            <EAMTextField
                {...processElementInfo(locationLayout.fields["equipmentdesc"])}
                value={location.description}
                updateProperty={updateEquipmentProperty}
                valueKey="description"
            />

            <EAMAutocomplete
                {...processElementInfo(locationLayout.fields["department"])}
                value={location.departmentCode}
                desc={location.departmentDesc}
                updateProperty={updateEquipmentProperty}
                valueKey="departmentCode"
                descKey="departmentDesc"
                autocompleteHandler={WS.autocompleteDepartment}
            />

            <StatusRow
                entity={location}
                entityType={"equipment"}
                style={{marginTop: "10px", marginBottom: "-10px"}}
            />
        </React.Fragment>
    );
};

export default AssetGeneral;
