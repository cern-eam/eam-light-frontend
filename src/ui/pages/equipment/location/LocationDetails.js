import React from "react";
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import EAMCheckbox from 'eam-components/dist/ui/components/inputs-ng/EAMCheckbox'
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import WS from "../../../../tools/WS";
import { processElementInfo } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';

const LocationDetails = props => {
    const {
        location,
        locationLayout,
        updateEquipmentProperty
    } = props;

    return (
        <React.Fragment>
            <EAMAutocomplete
                {...processElementInfo(locationLayout.fields["class"])}
                value={location.classCode}
                desc={location.classDesc}
                valueKey="classCode"
                descKey="classDesc"
                updateProperty={updateEquipmentProperty}
                autocompleteHandler={filter =>
                    WS.autocompleteClass("LOC", filter)
                }
            />

            <EAMTextField
                {...processElementInfo(locationLayout.fields["costcode"])}
                value={location.costCode}
                valueKey="costCode"
                updateProperty={updateEquipmentProperty}
            />

            <EAMCheckbox
                {...processElementInfo(locationLayout.fields["safety"])}
                value={`${location.safety}`}
                updateProperty={updateEquipmentProperty}
                valueKey="safety"
            />

            <EAMCheckbox
                {...processElementInfo(locationLayout.fields["outofservice"])}
                value={`${location.outOfService}`}
                updateProperty={updateEquipmentProperty}
                valueKey="outOfService"
            />
        </React.Fragment>
    );
};

export default LocationDetails;
