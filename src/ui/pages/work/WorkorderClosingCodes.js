import React, {Component} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import EAMSelect from 'eam-components/dist/ui/components/muiinputs/EAMSelect';
import EAMAutocomplete from 'eam-components/dist/ui/components/muiinputs/EAMAutocomplete';
import WSWorkorders from "../../../tools/WSWorkorders";

class WorkorderClosingCodes extends Component {

    render() {
        let {children, workOrderLayout, workorder, updateWorkorderProperty, layout} = this.props;

        return (
            <EISPanel heading="CLOSING CODES">
                <div style={{width: "100%", marginTop: 0}}>

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

                </div>
            </EISPanel>
        )
    }
}

export default WorkorderClosingCodes;