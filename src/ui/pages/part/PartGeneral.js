import React, {Component} from 'react';
import EAMSelect from 'eam-components/ui/components/muiinputs/EAMSelect';
import EAMInput from 'eam-components/ui/components/muiinputs/EAMInput'
import EAMAutocomplete from 'eam-components/ui/components/muiinputs/EAMAutocomplete';
import WSParts from "../../../tools/WSParts";
import EAMCheckbox from "eam-components/ui/components/muiinputs/EAMCheckbox";
import WS from "../../../tools/WS";
import StatusRow from "../../components/statusrow/StatusRow"

class PartGeneral extends Component {
    render() {
        let {children, partLayout, part, updatePartProperty, layout} = this.props;

        return (
            <div style={{width: "100%", marginTop: 0}}>

                {layout.newEntity && <EAMInput
                    elementInfo={partLayout.fields['partcode']}
                    value={part.code}
                    updateProperty={updatePartProperty}
                    valueKey="code" children={children}/>
                }

                <EAMInput
                    elementInfo={partLayout.fields['description']}
                    value={part.description}
                    updateProperty={updatePartProperty}
                    valueKey="description" children={children}/>

                <EAMAutocomplete elementInfo={partLayout.fields['class']}
                                    value={part.classCode}
                                    updateProperty={updatePartProperty}
                                    valueKey="classCode"
                                    valueDesc={part.classDesc}
                                    descKey="classDesc"
                                    autocompleteHandler={(filter, config) => WS.autocompleteClass('PART', filter, config)}
                                    children={children}/>

                <EAMAutocomplete elementInfo={partLayout.fields['category']}
                                    value={part.categoryCode}
                                    updateProperty={updatePartProperty}
                                    valueKey="categoryCode"
                                    valueDesc={part.categoryDesc}
                                    descKey="categoryDesc"
                                    autocompleteHandler={WSParts.autocompletePartCategory}
                                    children={children}/>

                <EAMAutocomplete elementInfo={partLayout.fields['uom']}
                                    value={part.uom}
                                    updateProperty={updatePartProperty}
                                    valueKey="uom"
                                    valueDesc={part.uomdesc}
                                    descKey="uomdesc"
                                    autocompleteHandler={WSParts.autocompletePartUOM}
                                    children={children}/>

                <EAMSelect
                    elementInfo={partLayout.fields['trackingtype']}
                    valueKey="trackingMethod"
                    values={layout.trackingMethods}
                    value={part.trackingMethod}
                    updateProperty={updatePartProperty} children={children}/>

                <EAMAutocomplete elementInfo={partLayout.fields['commoditycode']}
                                    value={part.commodityCode}
                                    updateProperty={updatePartProperty}
                                    valueKey="commodityCode"
                                    valueDesc={part.commodityDesc}
                                    descKey="commodityDesc"
                                    autocompleteHandler={WSParts.autocompletePartCommodity} children={children}/>

                <EAMCheckbox
                    elementInfo={partLayout.fields['trackbyasset']}
                    value={part.trackByAsset}
                    updateProperty={updatePartProperty}
                    valueKey="trackByAsset" children={children}/>

                <EAMCheckbox
                    elementInfo={partLayout.fields['repairablespare']}
                    value={part.trackCores}
                    updateProperty={updatePartProperty}
                    valueKey="trackCores" children={children}/>

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