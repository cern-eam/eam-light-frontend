import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import BlockUi from 'react-block-ui';
import WSWorkorders from "../../../../tools/WSWorkorders";
import EAMSelect from 'eam-components/ui/components/inputs-ng/EAMSelect';
import EAMAutocomplete from 'eam-components/ui/components/inputs-ng/EAMAutocomplete';
import EAMTextField from 'eam-components/ui/components/inputs-ng/EAMTextField';
import WSParts from '../../../../tools/WSParts';
import makeStyles from '@mui/styles/makeStyles';
import EAMRadio from 'eam-components/ui/components/inputs-ng/EAMRadio';

const transactionTypes = [{code: 'ISSUE', desc: 'Issue'}, {code: 'RETURN', desc: 'Return'}];

const overflowStyle = {
    overflowY: 'visible'
}

const useStyles = makeStyles({
    paper: overflowStyle
});

function PartUsageDialog(props) {

    const [partUsage, setPartUsage] = useState({});
    const [partUsageLine, setPartUsageLine] = useState({});
    const [binList, setBinList] = useState([]);
    const [activityList, setActivityList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uom, setUoM] = useState("");
    const [isTrackedByAsset, setIsTrackedByAsset] = useState(false);
    const [formData, setFormData] = useState({});
    const [initPartUsageWSData, setInitPartUsageWSData] = useState({});

    console.log("/// formData:", formData);

    // 'formData' contains all necessary state for the part usage submittal
    const updateFormDataProperty = (key, value) => {
        setFormData((oldFormData) => ({
            ...oldFormData,
            [key]: value,
        }));
    };

    // We set every state key used even if they come null in the 'response'
    const assignInitialFormState = (response) => {
        const transactionLines = response.transactionlines[0];
        updateFormDataProperty("activityCode", response.activityCode);
        updateFormDataProperty("storeCode", response.storeCode);
        updateFormDataProperty("transactionType", response.transactionType);
        updateFormDataProperty("assetIDCode", transactionLines.assetIDCode);
        updateFormDataProperty("assetIDDesc", transactionLines.assetIDDesc);
        updateFormDataProperty("bin", transactionLines.bin);
        updateFormDataProperty("partCode", transactionLines.partCode);
        updateFormDataProperty("partDesc", transactionLines.partDesc);
        updateFormDataProperty("transactionQty", transactionLines.transactionQty);
    }

    useEffect(() => {
        if (props.isDialogOpen) {
            initNewPartUsage(props.workorder);
        }
    }, [props.isDialogOpen])

    const initNewPartUsage = async (workorder) => {
        setLoading(true);
        try {
            // Fetch the part usage object
            const response = await WSWorkorders.getInitNewPartUsage(workorder);
            setLoading(false);
            setInitPartUsageWSData(response.body.data);
            assignInitialFormState(response.body.data);
            // Load lists
            loadLists(workorder);
        } catch (error) {
            props.handleError(error);
        }
    };

    const loadLists = (workorder) => {
        WSWorkorders.getWorkOrderActivities(workorder.number).then(response => {
            setActivityList(transformActivities(response.body.data));
        }).catch(error => {
            props.handleError(error);
        });
        //Bin list
        setBinList([]);
    };

    const resetFormDataAndBinListStates = () => {
        // TODO: why are we not resetting the store?
        // Reset Form Data
        updateFormDataProperty("assetIDCode", "");
        updateFormDataProperty("assetIDDesc", "");
        updateFormDataProperty("bin", "");
        updateFormDataProperty("partCode", "");
        updateFormDataProperty("partDesc", "");
        // Reset bin list
        setBinList([])
    }

    const handleTransactionChange = (value) => {
        resetFormDataAndBinListStates();
    };

    const handleStoreChange = (value) => {
        resetFormDataAndBinListStates();
    };

    /* This function handles at least 3 cases:
     * 1) The part is selected so we only need to update the bin and bin list states
     *    (hence the conditions for whether the part is defined).
     * 2) The user searches for an asset ID directly (without selecting a part), so we
     *    have to set more state: partCode, partDesc, bin and bin list.
     * 3) The input is cleared // TODO: check behavior is ok
     */
    const handleAssetChange = (assetIDCode) => {
        console.log("*** (handleAssetChange) ***", formData);
        // console.log("\t| partUsageLine:", partUsageLine);
        //Clear part and bin selection
        if (!formData.partCode) {
            console.log("\t;;;;;; partCode NOT defined ;;;;;;", formData.partCode);
            updateFormDataProperty('partCode', '');
            updateFormDataProperty('partDesc', '');
        }
        updateFormDataProperty('bin', '');
        //Complete data for change Asset
        WSWorkorders.getPartUsageSelectedAsset(props.workorder.number, formData.transactionType,
            formData.storeCode, assetIDCode).then(response => {
            const completeData = response.body.data[0];
            if (completeData) {
                updateFormDataProperty('bin', completeData.bin);
                loadBinList(completeData.bin, completeData.part);
                if (!formData.partCode){
                    updateFormDataProperty('partCode', completeData.part);
                }
            }
            if (!formData.partCode) {
                WSParts.getPart(completeData.part).then((response) => {
                    setIsTrackedByAsset(response.body.data.trackByAsset === "true");
                    setUoM(response.body.data.uom);
                    updateFormDataProperty('partDesc', response.body.data.description);
                }); // TODO: missing catch handleError 
            }
        }).catch(error => {
            props.handleError(error);
        });
    };

    const handlePartChange = (value) => {
        console.log("*** (handlePartChange) ***");
        //Clear asset and bin selection
        updateFormDataProperty('assetIDCode', '');
        updateFormDataProperty('assetIDDesc', '');
        updateFormDataProperty('bin', '');
        //Load the bin list
        loadBinList('', value);
        loadPartData(value);
    };

    const loadBinList = (binCode, partCode) => {
        if (!partCode)
            return;
        WSWorkorders.getPartUsageBin(formData.transactionType,
            binCode, partCode, formData.storeCode).then(response => {
            const binList = response.body.data;
            setBinList(binList)
            if (binList.length === 1) {
                updateFormDataProperty('bin', binList[0].code);
            }
        }).catch(error => {
            props.handleError(error);
        });
    };

    const loadPartData = (partCode) => {
        if (!partCode) return;

        WSParts.getPart(partCode).then(response => {
            setIsTrackedByAsset(response.body.data.trackByAsset === 'true');
            setUoM(response.body.data.uom);
        }) // TODO: missing catch to handleError here
    }

    const handleSave = () => {
        setLoading(true);

        const relatedWorkOrder =
            props.equipmentMEC?.length > 0 ? props.workorder.number : null;

        // Extract state properties modifiable through user interaction
        const {
            activityCode,
            storeCode,
            transactionType,
            assetIDCode,
            assetIDDesc,
            bin,
            partCode,
            partDesc,
            transactionQty,
        } = formData;

        // Update upper level properties of part usage object
        let partUsageSubmitData = {
            ...initPartUsageWSData,
            activityCode,
            storeCode,
            relatedWorkOrder,
            transactionType,
        };

        // Update 'transactionlines' property of part usage object
        partUsageSubmitData.transactionlines = [
            {
                ...initPartUsageWSData.transactionlines[0],
                assetIDCode,
                assetIDDesc,
                bin,
                partCode,
                partDesc,
                transactionQty,
            },
        ];

        // Remove original transaction info propriety
        delete partUsageSubmitData.transactionInfo;

        console.log("partUsageSubmitData (submit)", partUsageSubmitData);

        // Save the record
        WSWorkorders.createPartUsage(partUsageSubmitData)
            .then(props.successHandler)
            .catch(props.handleError)
            .finally(() => setLoading(false));
    };

    const transformActivities = (activities) => {
        return activities.map(activity => ({
            code: activity.activityCode,
            desc: activity.tradeCode
        }));
    }

    const classes = useStyles();

    // TODO: re-check w/ lukasz w/ lukasz
    // if (!props.workorder) {
    //     return React.Fragment;
    // }

    return (
        <div>
            <Dialog
                fullWidth
                id="addPartUsageDialog"
                open={props.isDialogOpen}
                onClose={props.handleCancel}
                aria-labelledby="form-dialog-title"
                classes={{
                    paper: classes.paper
                }}>

                <DialogTitle id="form-dialog-title">Add Part Usage</DialogTitle>

                <DialogContent id="content" style={overflowStyle}>
                    <div>
                        <BlockUi tag="div" blocking={loading || props.isLoading}>
                            <EAMRadio elementInfo={props.tabLayout['transactiontype']}
                                      valueKey="transactionType"
                                      values={transactionTypes}
                                      value={formData.transactionType}
                                      updateProperty={updateFormDataProperty}
                                      onChangeValue={handleTransactionChange}
                                      children={props.children}
                            />

                            <EAMSelect
                                elementInfo={{...props.tabLayout['storecode'], attribute: 'R'}}
                                valueKey="storeCode"
                                value={formData.storeCode}
                                updateProperty={updateFormDataProperty}
                                onChangeValue={handleStoreChange}
                                autocompleteHandler={WSWorkorders.getPartUsageStores}
                                children={props.children}/>


                            <EAMSelect
                                elementInfo={{
                                    ...props.tabLayout["activity"],
                                    attribute: "R",
                                    readonly: !formData.storeCode,
                                }}
                                valueKey="activityCode"
                                options={activityList}
                                value={formData.activityCode}
                                updateProperty={updateFormDataProperty}
                                // TODO: re-check w/ lukasz
                                // autocompleteHandler={WSWorkorders.getWorkOrderActivities}
                                // autocompleteHandlerParams={props.workorder.number}
                                // optionsTransformer={transformActivities}
                                children={props.children}/>

                            <EAMAutocomplete
                                elementInfo={{
                                    ...props.tabLayout["partcode"],
                                    readonly: !formData.storeCode,
                                }}
                                value={formData.partCode}
                                updateProperty={updateFormDataProperty}
                                valueKey="partCode"
                                desc={formData.partDesc}
                                descKey="partDesc"
                                autocompleteHandler={
                                    WSWorkorders.getPartUsagePart
                                }
                                autocompleteHandlerParams={[props.workorder.number, formData.storeCode]}
                                onChangeValue={handlePartChange}
                                barcodeScanner
                                children={props.children}
                                />

                            <EAMAutocomplete
                                elementInfo={{
                                    ...props.tabLayout["assetid"],
                                    readonly:
                                        !formData.storeCode ||
                                        !formData.activityCode ||
                                        (formData.storeCode?.trim() === '' &&
                                            !isTrackedByAsset),
                                }}
                                value={formData.assetIDCode}
                                updateProperty={updateFormDataProperty}
                                valueKey="assetIDCode"
                                desc={formData.assetIDDesc}
                                descKey="assetIDDesc"
                                autocompleteHandler={WSWorkorders.getPartUsageAsset}
                                autocompleteHandlerParams={[formData.transactionType, formData.storeCode]}
                                onChangeValue={handleAssetChange}
                                barcodeScanner
                                children={props.children}/>

                            <EAMSelect
                                elementInfo={{
                                    ...props.tabLayout["bincode"],
                                    readonly: !formData.storeCode,
                                }}
                                valueKey="bin"
                                options={binList}
                                value={formData.bin}
                                updateProperty={updateFormDataProperty}
                                children={props.children}
                                suggestionsPixelHeight={200}/>

                            <EAMTextField
                                elementInfo={{
                                    ...props.tabLayout["transactionquantity"],
                                    readonly:
                                        !formData.storeCode ||
                                        isTrackedByAsset,
                                }}
                                valueKey="transactionQty"
                                endAdornment={uom}
                                value={formData.transactionQty}
                                updateProperty={updateFormDataProperty}
                                children={props.children}/>

                        </BlockUi>
                    </div>
                </DialogContent>


                <DialogActions>
                    <div>
                        <Button onClick={props.handleCancel} color="primary"
                                disabled={loading || props.isLoading}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} color="primary"
                                disabled={loading || props.isLoading}>
                            Save
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );

}

export default PartUsageDialog;