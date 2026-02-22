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
import useEntity from '../../../../hooks/useEntity';
import { getOrg } from '../../../../hooks/tools';
import { toEAMNumber } from '../../EntityTools';
import EAMInput from '../../../components/EAMInput';
import WS from '../../../../tools/WS';

const AdditionalCostDialog = (props) => {
    const {workOrderNumber, isDialogOpen, successHandler} = props

    if (!isDialogOpen) {
        return null;
    }

    const [activityList, setActivityList] = useState([]);

    const {
        saveHandler,
        updateEntityProperty: updateAdditionalCostProperty,
        register,
        loading,
    } = useEntity({
        WS: {
            create: WSWorkorders.createAdditionalCost,
            new: () => WSWorkorders.initAdditionalCost(workOrderNumber),
        },
        postActions: {
            new: postInit,
            create: postCreate,
        },
        tabCode: "ACO",
        screenProperty: "workOrderScreen",
        entityDesc: 'Additional Cost',
        explicitIdentifier: ``,
        pageMode: false
    });

    useEffect(() => {
        if (props.isDialogOpen) {
            loadActivities(props.workOrderNumber);
        }
    }, [props.isDialogOpen]);

    function postCreate() {
        successHandler()
    }

    function postInit(addcostdefaults) {
        updateAdditionalCostProperty('ACTIVITYID.ACTIVITYCODE', addcostdefaults.ACTIVITYCODE)
        updateAdditionalCostProperty('ACTIVITYID.WORKORDERID.JOBNUM', workOrderNumber)
        updateAdditionalCostProperty('ACTIVITYID.WORKORDERID.ORGANIZATIONID.ORGANIZATIONCODE', getOrg())
        updateAdditionalCostProperty('WOADDITIONALCOSTQTY', toEAMNumber(1))
        updateAdditionalCostProperty('MULTIEQUIPSPLITINFO.RELATEDWORKORDERID.JOBNUM', workOrderNumber)
        updateAdditionalCostProperty('MULTIEQUIPSPLITINFO.RELATEDWORKORDERID.ORGANIZATIONID.ORGANIZATIONCODE', getOrg())
    }

    const loadActivities = (workOrderNumber) => {
        WSWorkorders.getWorkOrderActivities(workOrderNumber).then((response) => {
            setActivityList(transformActivities(response.body.data));
        }).catch((error) => {
            props.handleError(error);
        });
    };

    const transformActivities = activities =>
    activities.map(activity => ({
        code: Number(activity.activityCode),
        desc: activity.tradeCode
    }));

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
                    <EAMSelect {...register('activitytrade')}
                        options={activityList}
                    />

                    <EAMTextField {...register('costdescription')} />

                    <EAMInput {...register('costtype')} 
                        autocompleteHandler={WS.getCodeLov}
                        autocompleteHandlerParams={["WOCS"]}
                        />

                    <EAMTextField   {...register('cost')} />

                    <EAMDatePicker   {...register('additionalcostsdate')} />
                </BlockUi>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleCancel} color="primary" disabled={loading || props.isLoading}>
                    Cancel
                </Button>
                <Button onClick={saveHandler} color="primary" disabled={loading || props.isLoading}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );

}

export default AdditionalCostDialog;