import React from "react";
import EISPanel from "eam-components/dist/ui/components/panel";
import EAMAutocomplete from "eam-components/dist/ui/components/muiinputs/EAMAutocomplete";
import EAMInput from "eam-components/dist/ui/components/muiinputs/EAMInput";

const LocationHierarchy = props => {
    const {
        location,
        children,
        locationLayout,
        updateEquipmentProperty
    } = props;
    return (
        <EISPanel heading="HIERARCHY">
            <div style={{ width: "100%", marginTop: 0 }}>
                <EAMAutocomplete
                    children={children}
                    elementInfo={locationLayout.fields["parentlocation"]}
                    value={location.hierarchyLocationCode}
                    updateProperty={updateEquipmentProperty}
                    valueKey="hierarchyLocationCode"
                    valueDesc={location.hierarchyLocationDesc}
                    descKey="hierarchyLocationDesc"
                />

                <EAMInput
                    children={children}
                    elementInfo={{
                        ...locationLayout.fields["udfchar11"],
                        readonly: true
                    }}
                    value={location.userDefinedFields.udfchar11}
                    updateProperty={updateEquipmentProperty}
                    valueKey="userDefinedFields.udfchar11"
                />
            </div>
        </EISPanel>
    );
};

export default LocationHierarchy;
