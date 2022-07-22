import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import EAMUDF from "eam-components/dist/ui/components/inputs-ng/EAMUDF";
import React from "react";
import WS from '../../../../tools/WS';

const LocationHierarchy = props => {
    const {
        location,
        children,
        locationLayout,
        updateEquipmentProperty
    } = props;
    return (
        <React.Fragment>
            <EAMAutocomplete
                children={children}
                elementInfo={locationLayout.fields["parentlocation"]}
                value={location.hierarchyLocationCode}
                updateProperty={updateEquipmentProperty}
                valueKey="hierarchyLocationCode"
                desc={location.hierarchyLocationDesc}
                descKey="hierarchyLocationDesc"
                autocompleteHandler={WS.autocompleteLocation}
            />

            <EAMUDF
                children={children}
                elementInfo={{
                    ...locationLayout.fields["udfchar11"],
                    readonly: true
                }}
                value={location.userDefinedFields.udfchar11}
                updateProperty={updateEquipmentProperty}
                valueKey="userDefinedFields.udfchar11"
            />
        </React.Fragment>
    );
};

export default LocationHierarchy;
