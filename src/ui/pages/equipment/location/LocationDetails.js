import React from "react";
import EISPanel from "eam-components/dist/ui/components/panel";
import EAMInput from "eam-components/dist/ui/components/muiinputs/EAMInput";
import EAMCheckbox from "eam-components/dist/ui/components/muiinputs/EAMCheckbox";
import EAMAutocomplete from "eam-components/dist/ui/components/muiinputs/EAMAutocomplete";
import WS from "../../../../tools/WS";

const LocationDetails = props => {
    const {
        location,
        children,
        locationLayout,
        updateEquipmentProperty
    } = props;

    return (
        <EISPanel heading="DETAILS">
            <div style={{ width: "100%", marginTop: 0 }}>
                <EAMAutocomplete
                    children={children}
                    elementInfo={locationLayout.fields["class"]}
                    value={location.classCode}
                    valueDesc={location.classDesc}
                    valueKey="classCode"
                    descKey="classDesc"
                    updateProperty={updateEquipmentProperty}
                    autocompleteHandler={filter =>
                        WS.autocompleteClass("OBJ", filter)
                    }
                />

                <EAMInput
                    children={children}
                    elementInfo={locationLayout.fields["costcode"]}
                    value={location.costCode}
                    updatePropert
                    valueKey="costCode"
                    updateProperty={updateEquipmentProperty}
                />

                <EAMCheckbox
                    elementInfo={locationLayout.fields["safety"]}
                    value={`${location.safety}`}
                    updateProperty={updateEquipmentProperty}
                    valueKey="safety"
                />

                <EAMCheckbox
                    elementInfo={locationLayout.fields["outofservice"]}
                    value={`${location.outOfService}`}
                    updateProperty={updateEquipmentProperty}
                    valueKey="outOfService"
                />
            </div>
        </EISPanel>
    );
};

export default LocationDetails;
