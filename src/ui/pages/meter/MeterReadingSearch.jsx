import * as React from "react";
import EISPanel from "eam-components/dist/ui/components/panel";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import WSMeters from "../../../tools/WSMeters";
import { createOnChangeHandler } from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";

class MeterReadingSearch extends React.Component {
  render() {
    const { parentProps } = this.props;
    const { searchCriteria } = parentProps;

    const idPrefix = "EAMID_MeterReadingSearch_";

    return (
      <EISPanel heading="SEARCH PANEL" alwaysExpanded={true}>
        <div style={{ width: "100%", marginTop: 0 }}>
          <EAMAutocomplete
            label={"Meter Code"}
            value={searchCriteria.meterCode}
            autocompleteHandler={WSMeters.autocompleteMeterCode}
            onSelect={parentProps.onChangeMeterCode}
            barcodeScanner
            id={`${idPrefix}METERCODE`}
          />
          <EAMAutocomplete
            label={"Equipment Code"}
            value={searchCriteria.equipmentCode}
            autocompleteHandler={WSMeters.autocompleteMeterEquipment}
            onSelect={parentProps.onChangeEquipmentCode}
            barcodeScanner
            id={`${idPrefix}EQUIPMENTCODE`}
          />
        </div>
      </EISPanel>
    );
  }
}

export default MeterReadingSearch;
