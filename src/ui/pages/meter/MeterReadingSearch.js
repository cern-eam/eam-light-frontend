import React from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import WSMeters from "../../../tools/WSMeters";

class MeterReadingSearch extends React.Component {

    render() {
        const {parentProps} = this.props;
        const {searchCriteria} = parentProps;    

        return (
            <EISPanel heading="SEARCH PANEL" alwaysExpanded={true}>
                <div style={{width: "100%", marginTop: 0}}>
                    <EAMAutocomplete
                        required={false}
                        label={"Meter Code"}
                        value={searchCriteria.meterCode}
                        updateProperty={parentProps.updateSearchProperty}
                        valueKey="meterCode"
                        autocompleteHandler={WSMeters.autocompleteMeterCode}
                        onChangeValue={parentProps.onChangeMeterCode}
                        desc={searchCriteria.meterDesc}
                        descKey="meterDesc"
                        barcodeScanner
                    />
                    <EAMAutocomplete
                        required={false}
                        label={"Equipment Code"}
                        value={searchCriteria.equipmentCode}
                        updateProperty={parentProps.updateSearchProperty}
                        valueKey="equipmentCode"
                        autocompleteHandler={WSMeters.autocompleteMeterEquipment}
                        onChangeValue={parentProps.onChangeEquipmentCode}
                        desc={searchCriteria.equipmentDesc}
                        descKey="equipmentDesc"
                        barcodeScanner
                    />
                </div>
            </EISPanel>
        );
    }
}

export default MeterReadingSearch;