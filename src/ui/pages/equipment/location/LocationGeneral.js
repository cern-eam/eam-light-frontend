import React from "react";
import EAMTextField from 'eam-components/ui/components/inputs-ng/EAMTextField';
import EAMAutocomplete from 'eam-components/ui/components/inputs-ng/EAMAutocomplete';
import WS from "../../../../tools/WS";
import StatusRow from "../../../components/statusrow/StatusRow";

const AssetGeneral = props => {
    const {
        location,
        children,
        locationLayout,
        updateEquipmentProperty,
        layout
    } = props;

    return (
        <React.Fragment>
            {layout.newEntity && (
                <EAMTextField
                    children={children}
                    elementInfo={locationLayout.fields["equipmentno"]}
                    value={location.code}
                    updateProperty={updateEquipmentProperty}
                    valueKey="code"
                />
            )}

            <EAMTextField
                children={children}
                elementInfo={locationLayout.fields["udfchar45"]}
                value={location.userDefinedFields.udfchar45}
                updateProperty={updateEquipmentProperty}
                valueKey="userDefinedFields.udfchar45"
            />

            <EAMTextField
                children={children}
                elementInfo={locationLayout.fields["equipmentdesc"]}
                value={location.description}
                updateProperty={updateEquipmentProperty}
                valueKey="description"
            />

            <EAMAutocomplete
                children={children}
                elementInfo={locationLayout.fields["department"]}
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
