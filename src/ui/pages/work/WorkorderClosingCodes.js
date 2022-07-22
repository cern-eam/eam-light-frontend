import React, {Component} from 'react';
import WSWorkorders from "../../../tools/WSWorkorders";
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';

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
            <React.Fragment>
                <EAMSelect children={children}
                            elementInfo={workOrderLayout.fields['problemcode']}
                            valueKey="problemCode"
                            value={workorder.problemCode || ''}
                            updateProperty={updateWorkorderProperty}
                            autocompleteHandler={WSWorkorders.getWorkOrderProblemCodeValues}
                            autocompleteHandlerParams={[workorder.classCode, null, workorder.equipmentCode]}/>

                <EAMSelect children={children}
                            elementInfo={workOrderLayout.fields['failurecode']}
                            valueKey="failureCode"
                            value={workorder.failureCode || ''}
                            updateProperty={updateWorkorderProperty}
                            autocompleteHandler={WSWorkorders.getWorkOrderFailureCodeValues}
                            autocompleteHandlerParams={[null, workorder.problemCode, workorder.equipmentCode]}/>

                <EAMSelect children={children}
                            elementInfo={workOrderLayout.fields['causecode']}
                            valueKey="causeCode"
                            value={workorder.causeCode || ''}
                            updateProperty={updateWorkorderProperty}
                            autocompleteHandler={WSWorkorders.getWorkOrderCauseCodeValues}
                            autocompleteHandlerParams={[null, workorder.failureCode, workorder.problemCode, workorder.equipmentCode]}/>

                <EAMSelect children={children}
                            elementInfo={workOrderLayout.fields['actioncode']}
                            valueKey="actionCode"
                            value={workorder.actionCode || ''}
                            updateProperty={updateWorkorderProperty}
                            autocompleteHandler={WSWorkorders.getWorkOrderActionCodeValues}
                            autocompleteHandlerParams={[null,  workorder.failureCode, workorder.problemCode, workorder.causeCode, workorder.equipmentCode]}/>

                <EAMAutocomplete children={children}
                                    elementInfo={workOrderLayout.fields['costcode']}
                                    value={workorder.costCode}
                                    updateProperty={updateWorkorderProperty}
                                    valueKey="costCode"
                                    desc={workorder.costCodeDesc}
                                    descKey="costCodeDesc"
                                    autocompleteHandler={WSWorkorders.autocompleteCostCode}/>

            </React.Fragment>
        )
    }
}

export default WorkorderClosingCodes;