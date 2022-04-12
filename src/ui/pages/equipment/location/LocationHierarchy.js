import React from "react";
import EAMAutocomplete from "eam-components/ui/components/muiinputs/EAMAutocomplete";
import EAMInput from "eam-components/ui/components/muiinputs/EAMInput";
import WS from '../../../../tools/WS';

const LocationHierarchy = props => {
    const {
        location,
        children,
        locationLayout,
        updateEquipmentProperty
    } = props;
    return (
        <div style={{ width: "100%", marginTop: 0 }}>
            <EAMAutocomplete
                children={children}
                elementInfo={locationLayout.fields["parentlocation"]}
                value={location.hierarchyLocationCode}
                updateProperty={updateEquipmentProperty}
                valueKey="hierarchyLocationCode"
                valueDesc={location.hierarchyLocationDesc}
                descKey="hierarchyLocationDesc"
                autocompleteHandler={WS.autocompleteLocation}
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
    );
};

export default LocationHierarchy;
