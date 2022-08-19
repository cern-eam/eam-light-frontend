import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import BlockUi from 'react-block-ui';
import WSWorkorders from "../../../../tools/WSWorkorders";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import EAMDatePicker from 'eam-components/dist/ui/components/inputs-ng/EAMDatePicker';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import { processElementInfo } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';

const AdditionalCostDialog = (props) => {
    const [additionalCost, setAdditionalCost] = useState({ 
        costType: "MISC" , 
        date: new Date()});
    const [activityList, setActivityList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (props.isDialogOpen) {
            loadActivities(props.workorder);
        }
    }, [props.isDialogOpen]);

    const loadActivities = (workorder) => {
        WSWorkorders.getWorkOrderActivities(workorder.number).then((response) => {
            setActivityList(transformActivities(response.body.data));
        }).catch((error) => {
            props.handleError(error);
        });
    };

    const transformActivities = (activities) => {
        return activities.map((activity) => ({
            code: activity.activityCode,
            desc: activity.tradeCode
        }));
    }

    const updateAdditionalCostProperty = (key, value) => {
        setAdditionalCost((prevAdditionalCost) => ({
            ...prevAdditionalCost,
            [key]: value,
        }));
    };

    const handleSave = () => {
        setLoading(true);
        WSWorkorders.createAdditionalCost({...additionalCost }, props.workorder.number)
            .then(props.successHandler)
            .catch(props.handleError)
            .finally(() => setLoading(false));
    };

    return (
        <Dialog
            fullWidth
            id="addAdditionalCostDialog"
            open={props.isDialogOpen}
            onClose={props.handleCancel}
            aria-labelledby="form-dialog-title">

            <DialogTitle id="form-dialog-title">Add Additional Cost</DialogTitle>

            <DialogContent id="content" style={{ overflowY: 'visible' }}>
                <BlockUi tag="div" blocking={loading || props.isLoading}>
                    <EAMSelect 
                        {...processElementInfo(props.tabLayout['activitytrade'])}
                        valueKey="activityCode"
                        options={activityList}
                        value={additionalCost.activityCode}
                        updateProperty={updateAdditionalCostProperty}
                    />

                    <EAMTextField 
                        {...processElementInfo(props.tabLayout['costdescription'])}
                        valueKey="costDescription"
                        value={additionalCost.costDescription}
                        updateProperty={updateAdditionalCostProperty}
                    />

                    <EAMTextField 
                        {...processElementInfo(props.tabLayout['costtype'])}
                        disabled
                        valueKey="costType"
                        value="Parts/Services"
                        updateProperty={updateAdditionalCostProperty}
                    />

                    <EAMTextField 
                        {...processElementInfo(props.tabLayout['cost'])}
                        valueKey="cost"
                        value={additionalCost.cost}
                        updateProperty={updateAdditionalCostProperty}
                    />

                    <EAMDatePicker 
                        {...processElementInfo(props.tabLayout['additionalcostsdate'])}
                        valueKey="date"
                        value={additionalCost.date}
                        updateProperty={updateAdditionalCostProperty}
                    
                    />
                </BlockUi>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleCancel} color="primary" disabled={loading || props.isLoading}>
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary" disabled={loading || props.isLoading}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );

}

export default AdditionalCostDialog;