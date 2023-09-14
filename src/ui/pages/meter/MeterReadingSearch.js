import React from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import WSMeters from "../../../tools/WSMeters";
import { createOnChangeHandler } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';

class MeterReadingSearch extends React.Component {

    render() {
        const {parentProps} = this.props;
        const {searchCriteria} = parentProps;    

        const idPrefix = "EAMID_MeterReadingSearch_";

        return (
            <EISPanel heading="SEARCH PANEL" alwaysExpanded={true}>
                <div style={{width: "100%", marginTop: 0}}>
                    <EAMAutocomplete
                        label={"Meter Code"}
                        value={searchCriteria.meterCode}
                        autocompleteHandler={WSMeters.autocompleteMeterCode}
                        onChange={createOnChangeHandler(
                            'meterCode',
                            'meterDesc',
                            null,
                            parentProps.updateSearchProperty,
                            parentProps.onChangeMeterCode
                        )}
                        desc={searchCriteria.meterDesc}
                        barcodeScanner
                        id={`${idPrefix}METERCODE`}
                    />
                    <EAMAutocomplete
                        label={"Equipment Code"}
                        value={searchCriteria.equipmentCode}
                        autocompleteHandler={WSMeters.autocompleteMeterEquipment}
                        onChange={createOnChangeHandler(
                            'equipmentCode',
                            'equipmentDesc',
                            null,
                            parentProps.updateSearchProperty,
                            parentProps.onChangeEquipmentCode
                        )}
                        desc={searchCriteria.equipmentDesc}
                        barcodeScanner
                        id={`${idPrefix}EQUIPMENTCODE`}
                    />
                </div>
            </EISPanel>
        );
    }
}

export default MeterReadingSearch;