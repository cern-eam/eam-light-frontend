import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import BlockUi from 'react-block-ui';
import WSWorkorders from "../../../../tools/WSWorkorders";
import EAMSelect from "eam-components/dist/ui/components/muiinputs/EAMSelect";
import EAMInput from "eam-components/dist/ui/components/muiinputs/EAMInput";

const AdditionalCostDialog = (props) => {
    const [additionalCost, setAdditionalCost] = useState({ costType: "MISC" });
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
        WSWorkorders.createAdditionalCost({...additionalCost, date: new Date() }, props.workorder.number)
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
            aria-labelledby="form-dialog-title"
            disableBackdropClick={true}>

            <DialogTitle id="form-dialog-title">Add Additional Cost</DialogTitle>

            <DialogContent id="content" style={{ overflowY: 'visible' }}>
                <BlockUi tag="div" blocking={loading || props.isLoading}>
                    <EAMSelect elementInfo={props.tabLayout['activitytrade']}
                        valueKey="activityCode"
                        values={activityList}
                        value={additionalCost.activityCode}
                        updateProperty={updateAdditionalCostProperty}
                        children={props.children}/>

                    <EAMInput elementInfo={props.tabLayout['costdescription']}
                        valueKey="costDescription"
                        value={additionalCost.costDescription}
                        updateProperty={updateAdditionalCostProperty}
                        children={props.children}/>

                    <EAMInput elementInfo={{...props.tabLayout['costtype'], readonly: true }}
                        valueKey="costType"
                        value="Parts/Services"
                        updateProperty={updateAdditionalCostProperty}
                        children={props.children}/>

                    <EAMInput elementInfo={props.tabLayout['cost']}
                        valueKey="cost"
                        value={additionalCost.cost}
                        updateProperty={updateAdditionalCostProperty}
                        children={props.children}/>
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
    )

}

export default AdditionalCostDialog;