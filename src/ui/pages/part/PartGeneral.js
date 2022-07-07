import React, {Component} from 'react';
import EAMSelect from 'eam-components/ui/components/inputs-ng/EAMSelect';
import EAMAutocomplete from 'eam-components/ui/components/inputs-ng/EAMAutocomplete';
import WSParts from "../../../tools/WSParts";
import EAMCheckbox from 'eam-components/ui/components/inputs-ng/EAMCheckbox'
import WS from "../../../tools/WS";
import StatusRow from "../../components/statusrow/StatusRow"
import EAMTextField from 'eam-components/ui/components/inputs-ng/EAMTextField';

class PartGeneral extends Component {
    render() {
        let {children, partLayout, part, updatePartProperty, layout} = this.props;

        return (
            <div style={{width: "100%", marginTop: 0}}>

                {layout.newEntity && <EAMTextField
                    elementInfo={partLayout.fields['partcode']}
                    value={part.code}
                    updateProperty={updatePartProperty}
                    valueKey="code"
                    children={children}/>
                }

                <EAMTextField
                    elementInfo={partLayout.fields['description']}
                    value={part.description}
                    updateProperty={updatePartProperty}
                    valueKey="description"
                    children={children}/>

                <EAMAutocomplete
                    elementInfo={partLayout.fields['class']}
                    value={part.classCode}
                    updateProperty={updatePartProperty}
                    valueKey="classCode"
                    desc={part.classDesc}
                    descKey="classDesc"
                    autocompleteHandler={(filter, config) => WS.autocompleteClass('PART', filter, config)}
                    children={children}/>

                <EAMAutocomplete
                    elementInfo={partLayout.fields['category']}
                    value={part.categoryCode}
                    updateProperty={updatePartProperty}
                    valueKey="categoryCode"
                    desc={part.categoryDesc}
                    descKey="categoryDesc"
                    autocompleteHandler={WSParts.autocompletePartCategory}
                    children={children}/>

                <EAMAutocomplete
                    elementInfo={partLayout.fields['uom']}
                    value={part.uom}
                    updateProperty={updatePartProperty}
                    valueKey="uom"
                    desc={part.uomdesc}
                    descKey="uomdesc"
                    autocompleteHandler={WSParts.autocompletePartUOM}
                    children={children}/>

                <EAMSelect
                    elementInfo={partLayout.fields['trackingtype']}
                    value={part.trackingMethod}
                    updateProperty={updatePartProperty}
                    valueKey="trackingMethod"
                    options={layout.trackingMethods}
                    children={children}/>

                <EAMAutocomplete
                    elementInfo={partLayout.fields['commoditycode']}
                    value={part.commodityCode}
                    updateProperty={updatePartProperty}
                    valueKey="commodityCode"
                    desc={part.commodityDesc}
                    descKey="commodityDesc"
                    autocompleteHandler={WSParts.autocompletePartCommodity}
                    children={children}/>

                <EAMCheckbox
                    elementInfo={partLayout.fields['trackbyasset']}
                    value={part.trackByAsset}
                    updateProperty={updatePartProperty}
                    valueKey="trackByAsset"
                    children={children}/>

                <EAMCheckbox
                    elementInfo={partLayout.fields['repairablespare']}
                    value={part.trackCores}
                    updateProperty={updatePartProperty}
                    valueKey="trackCores"
                    children={children}/>

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