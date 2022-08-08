import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import EAMUDF from "eam-components/dist/ui/components/inputs-ng/EAMUDF";
import React from "react";
import WS from '../../../../tools/WS';

const LocationHierarchy = (props) => {
    const { location, locationLayout, updateEquipmentProperty, register } = props;

    return (
        <React.Fragment>
            <EAMAutocomplete
                {...register('parentlocation', 'hierarchyLocationCode', 'hierarchyLocationDesc')}
                autocompleteHandler={WS.autocompleteLocation}
            />

            <EAMUDF
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
