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
import { createOnChangeHandler, processElementInfo } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';

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
                        options={activityList}
                        value={additionalCost.activityCode}
                        onChange={createOnChangeHandler("activityCode", null, null, updateAdditionalCostProperty)}
                    />

                    <EAMTextField 
                        {...processElementInfo(props.tabLayout['costdescription'])}
                        value={additionalCost.costDescription}
                        onChange={createOnChangeHandler("costDescription", null, null, updateAdditionalCostProperty)}
                    />

                    <EAMTextField 
                        {...processElementInfo(props.tabLayout['costtype'])}
                        disabled
                        value="Parts/Services"
                        onChange={createOnChangeHandler("costType", null, null, updateAdditionalCostProperty)}
                    />

                    <EAMTextField 
                        {...processElementInfo(props.tabLayout['cost'])}
                        value={additionalCost.cost}
                        onChange={createOnChangeHandler("cost", null, null, updateAdditionalCostProperty)}
                    />

                    <EAMDatePicker 
                        {...processElementInfo(props.tabLayout['additionalcostsdate'])}
                        value={additionalCost.date}
                        onChange={createOnChangeHandler("date", null, null, updateAdditionalCostProperty)}
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