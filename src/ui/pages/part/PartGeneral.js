import React, {Component} from 'react';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import WSParts from "../../../tools/WSParts";
import EAMCheckbox from 'eam-components/dist/ui/components/inputs-ng/EAMCheckbox'
import WS from "../../../tools/WS";
import StatusRow from "../../components/statusrow/StatusRow"
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import { processElementInfo } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';

class PartGeneral extends Component {
    render() {
        let {partLayout, part, updatePartProperty, layout} = this.props;

        return (
            <div style={{width: "100%", marginTop: 0}}>

                {layout.newEntity && <EAMTextField
                    {...processElementInfo(partLayout.fields['partcode'])}
                    value={part.code}
                    updateProperty={updatePartProperty}
                    valueKey="code"
                    />
                }

                <EAMTextField
                    {...processElementInfo(partLayout.fields['description'])}
                    value={part.description}
                    updateProperty={updatePartProperty}
                    valueKey="description"
                />

                <EAMAutocomplete
                    {...processElementInfo(partLayout.fields['class'])}
                    value={part.classCode}
                    updateProperty={updatePartProperty}
                    valueKey="classCode"
                    desc={part.classDesc}
                    descKey="classDesc"
                    autocompleteHandler={(filter, config) => WS.autocompleteClass('PART', filter, config)}
                />

                <EAMAutocomplete
                    {...processElementInfo(partLayout.fields['category'])}
                    value={part.categoryCode}
                    updateProperty={updatePartProperty}
                    valueKey="categoryCode"
                    desc={part.categoryDesc}
                    descKey="categoryDesc"
                    autocompleteHandler={WSParts.autocompletePartCategory}
                />

                <EAMAutocomplete
                    {...processElementInfo(partLayout.fields['uom'])}
                    value={part.uom}
                    updateProperty={updatePartProperty}
                    valueKey="uom"
                    desc={part.uomdesc}
                    descKey="uomdesc"
                    autocompleteHandler={WSParts.autocompletePartUOM}
                />

                <EAMSelect
                    {...processElementInfo(partLayout.fields['trackingtype'])}
                    value={part.trackingMethod}
                    updateProperty={updatePartProperty}
                    valueKey="trackingMethod"
                    options={layout.trackingMethods}
                />

                <EAMAutocomplete
                    {...processElementInfo(partLayout.fields['commoditycode'])}
                    value={part.commodityCode}
                    updateProperty={updatePartProperty}
                    valueKey="commodityCode"
                    desc={part.commodityDesc}
                    descKey="commodityDesc"
                    autocompleteHandler={WSParts.autocompletePartCommodity}
                />

                <EAMCheckbox
                    {...processElementInfo(partLayout.fields['trackbyasset'])}
                    value={part.trackByAsset}
                    updateProperty={updatePartProperty}
                    valueKey="trackByAsset"
                />

                <EAMCheckbox
                    {...processElementInfo(partLayout.fields['repairablespare'])}
                    value={part.trackCores}
                    updateProperty={updatePartProperty}
                    valueKey="trackCores"
                />

                <StatusRow
                    entity={part}
                    entityType={"part"}
                    style={{marginTop: "10px", marginBottom: "-10px"}}
                />
                
            </div>
        );
    }
}

export default PartGeneral;