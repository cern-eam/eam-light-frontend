import React, {Component} from 'react';
import EAMSelect from 'eam-components/dist/ui/components/muiinputs/EAMSelect';
import EAMAutocomplete from 'eam-components/dist/ui/components/muiinputs/EAMAutocomplete';
import WSWorkorders from "../../../tools/WSWorkorders";
import BlockUi from 'react-block-ui';

class WorkorderClosingCodes extends Component {

    render() {
        let {children, workOrderLayout, workorder, updateWorkorderProperty, layout} = this.props;

        //
        if ("H" === workOrderLayout.fields.problemcode.attribute
            && "H" === workOrderLayout.fields.failurecode.attribute
            && "H" === workOrderLayout.fields.causecode.attribute
            && "H" === workOrderLayout.fields.actioncode.attribute
            && "H" === workOrderLayout.fields.costcode.attribute) {
            return null;
        }

        return (
            <BlockUi blocking={layout.closingCodesLoading} style={{width: "100%", marginTop: 0}}>
                <EAMSelect children={children}
                            elementInfo={workOrderLayout.fields['problemcode']}
                            valueKey="problemCode"
                            values={layout.problemCodeValues}
                            value={workorder.problemCode || ''}
                            updateProperty={updateWorkorderProperty}/>

                <EAMSelect children={children}
                            elementInfo={workOrderLayout.fields['failurecode']}
                            valueKey="failureCode"
                            values={layout.failureCodeValues}
                            value={workorder.failureCode || ''}
                            updateProperty={updateWorkorderProperty}/>

                <EAMSelect children={children}
                            elementInfo={workOrderLayout.fields['causecode']}
                            valueKey="causeCode"
                            values={layout.causeCodeValues}
                            value={workorder.causeCode || ''}
                            updateProperty={updateWorkorderProperty}/>

                <EAMSelect children={children}
                            elementInfo={workOrderLayout.fields['actioncode']}
                            valueKey="actionCode"
                            values={layout.actionCodeValues}
                            value={workorder.actionCode || ''}
                            updateProperty={updateWorkorderProperty}/>

                <EAMAutocomplete children={children}
                                    elementInfo={workOrderLayout.fields['costcode']}
                                    value={workorder.costCode}
                                    updateProperty={updateWorkorderProperty}
                                    valueKey="costCode"
                                    valueDesc={workorder.costCodeDesc}
                                    descKey="costCodeDesc"
                                    autocompleteHandler={WSWorkorders.autocompleteCostCode}/>

            </BlockUi>
        )
    }
}

export default WorkorderClosingCodes;