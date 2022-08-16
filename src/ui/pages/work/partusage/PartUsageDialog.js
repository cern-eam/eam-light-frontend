import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import BlockUi from 'react-block-ui';
import WSWorkorders from '../../../../tools/WSWorkorders';
import EAMSelect from 'eam-components/dist/ui/components/inputs-ng/EAMSelect';
import EAMAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMAutocomplete';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import WSParts from '../../../../tools/WSParts';
import makeStyles from '@mui/styles/makeStyles';
import EAMRadio from 'eam-components/dist/ui/components/inputs-ng/EAMRadio';
import { processElementInfo } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';
import WSEquipment from "tools/WSEquipment";

const overflowStyle = {
    overflowY: 'visible'
}

const useStyles = makeStyles({
    paper: overflowStyle
});

const transactionTypes = [{code: 'ISSUE', desc: 'Issue'}, {code: 'RETURN', desc: 'Return'}];

// Contains some (inner) fields from the Part Usage object
const FORM = {
    ACTIVITY: 'activityCode',
    STORE: 'storeCode',
    TRANSACTION_TYPE: 'transactionType',
    ASSET: 'assetIDCode',
    ASSET_DESC: 'assetIDDesc',
    BIN: 'bin',
    PART: 'partCode',
    PART_DESC: 'partDesc',
    TRANSACTION_QTY: 'transactionQty'
}

function PartUsageDialog(props) {
    const {
        isDialogOpen,
        handleError,
        showError,
        equipmentMEC,
        successHandler,
        handleCancel,
        isLoading,
        tabLayout,
        workorder
    } = props;

    const [binList, setBinList] = useState([]);
    const [activityList, setActivityList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uom, setUoM] = useState('');
    const [isTrackedByAsset, setIsTrackedByAsset] = useState();
    const [formData, setFormData] = useState({}); // stores user changes (direct and indirect) for updating the part usage object
    const [initPartUsageWSData, setInitPartUsageWSData] = useState({});

    const updateFormDataProperty = (key, value) => {
        setFormData((oldFormData) => ({
            ...oldFormData,
            [key]: value,
        }));
    };

    // We set every state key used even if they come null in the 'response'
    const assignInitialFormState = (response) => {
        const transactionLines = response.transactionlines[0];
        updateFormDataProperty(FORM.ACTIVITY, response.activityCode);
        updateFormDataProperty(FORM.STORE, response.storeCode);
        updateFormDataProperty(FORM.TRANSACTION_TYPE, response.transactionType);
        updateFormDataProperty(FORM.ASSET, transactionLines.assetIDCode);
        updateFormDataProperty(FORM.ASSET_DESC, transactionLines.assetIDDesc);
        updateFormDataProperty(FORM.BIN, transactionLines.bin);
        updateFormDataProperty(FORM.PART, transactionLines.partCode);
        updateFormDataProperty(FORM.PART_DESC, transactionLines.partDesc);
        updateFormDataProperty(FORM.TRANSACTION_QTY, transactionLines.transactionQty);
    };

    useEffect(() => {
        if (isDialogOpen) {
            initNewPartUsage();
        }
        return () => {
            setUoM('');
            resetFormTransactionLinesAndBinListStates();
        }
    }, [isDialogOpen]);

    const initNewPartUsage = async () => {
        setLoading(true);
        try {
            // Fetch the part usage object
            const response = await WSWorkorders.getInitNewPartUsage(workorder);
            setLoading(false);
            setInitPartUsageWSData(response.body.data);
            assignInitialFormState(response.body.data);
            // Load lists
            loadLists();
        } catch (error) {
            handleError(error);
        }
    };

    const loadLists = async () => {
        try {
            const response = await WSWorkorders.getWorkOrderActivities(
                workorder.number
            );
            setActivityList(transformActivities(response.body.data));
        } catch (error) {
            handleError(error);
        }
        setBinList([]);
    };

    const resetFormTransactionLinesAndBinListStates = () => {
        // Reset 'transactionlines' proprieties
        updateFormDataProperty(FORM.ASSET, '');
        updateFormDataProperty(FORM.ASSET_DESC, '');
        updateFormDataProperty(FORM.BIN, '');
        updateFormDataProperty(FORM.PART, '');
        updateFormDataProperty(FORM.PART_DESC, '');
        // Reset bin list
        setBinList([]);
    };

    const handleTransactionChange = () => {
        resetFormTransactionLinesAndBinListStates();
    };

    const handleStoreChange = () => {
        resetFormTransactionLinesAndBinListStates();
    };

    /* This function handles at least 3 cases:
     * 1) The asset ID input is cleared.
     * 2) The user searches for an asset ID directly (without having selected a part),
     *    so we have to update the remaining state concerning part and bin.
     * 3) There was already a part selected so we only need to update the bin state.
     */
    const handleAssetChange = async (assetIDCode) => {
        // Asset input cleared
        if (assetIDCode?.trim() === '') {
            updateFormDataProperty(FORM.ASSET, '');
            updateFormDataProperty(FORM.ASSET_DESC, '');
            updateFormDataProperty(FORM.BIN, '');
            setBinList([]);
            return;
        }
        try {
            setLoading(true);
            const assetData = await getAssetData(assetIDCode);
            if (!assetData) {
                updateFormDataProperty(FORM.ASSET, '');
                updateFormDataProperty(FORM.ASSET_DESC, '');
                return;
            }
            // Asset selected without a part selected
            if (!formData.partCode || formData.partCode && formData.partCode !== assetData.partCode) {
                return handleAssetUnspecifiedPart(assetData);
            }
            // Asset selected having already selected a part
            return handleAssetSelectedWithPart(assetData);
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const getAssetData = async (assetIDCode) => {
        try {
            const response = await WSEquipment.getEquipment(assetIDCode);

            const responseStoreCode = response.body.data.storeCode;
            const assetData = {
                bin: response.body.data.bin,
                partCode: response.body.data.partCode
            }

            // Can happen if user un-focuses the input with an unexpected equipment selected (e.g. "A")
            if (Object.values(assetData).includes(null)) {
                showError('Unexpected asset selected.');
                return undefined;
            }

            // "ISSUE" transaction type
            if (formData.transactionType === transactionTypes[0].code) {
                if (!responseStoreCode) {
                    showError('Asset not in store.');
                    return undefined;
                }

                // Asset is in a store other than the selected (can happen by selecting asset from input history)
                if (responseStoreCode !== formData.storeCode) {
                    showError('Asset is in a different store than the selected.');
                    return undefined;
                }

                return assetData;

            // "RETURN" transaction type
            } else if (formData.transactionType === transactionTypes[1].code) {
                if (responseStoreCode) {
                    showError('Asset is already in a store.');
                    return undefined;
                }

                return assetData;
            }

            // Something is wrong if we get here (user input or code-related)
            showError('Asset does not follow business rules.');
            return undefined;

        } catch (error){
            handleError(error);
        }
    };

    const handleAssetSelectedWithPart = (assetData) => {
        const { bin, partCode } = assetData;

        updateFormDataProperty(FORM.BIN, '');
        if (assetData) {
            updateFormDataProperty(FORM.BIN, bin);
            loadBinList(bin, partCode);
        }
    };

    const handleAssetUnspecifiedPart = async (assetData) => {
        const { bin, partCode } = assetData;

        updateFormDataProperty(FORM.PART, '');
        updateFormDataProperty(FORM.PART_DESC, '');
        updateFormDataProperty(FORM.BIN, '');
        if (assetData) {
            updateFormDataProperty(FORM.BIN, bin);
            loadBinList(bin, partCode);
            updateFormDataProperty(FORM.PART, partCode);
        }
        // Set details of respective part
        try {
            const partData = await loadPartData(partCode);
            updateFormDataProperty(FORM.PART_DESC, partData.description);
        } catch (error) {
            handleError(error);
        }
    };

    const handlePartChange = (value) => {
        // Clear asset and bin selection
        updateFormDataProperty(FORM.ASSET, '');
        updateFormDataProperty(FORM.ASSET_DESC, '');
        updateFormDataProperty(FORM.BIN, '');
        setIsTrackedByAsset(false);
        // Load the bin list and part data
        loadBinList('', value);
        loadPartData(value);
    };

    const loadBinList = async (binCode, partCode) => {
        if (!partCode) return;

        try {
            const response = await WSWorkorders.getPartUsageBin(
                formData.transactionType,
                binCode,
                partCode,
                formData.storeCode
            );
            const binList = response.body.data;
            setBinList(binList);
            if (binList.length === 1) {
                updateFormDataProperty(FORM.BIN, binList[0].code);
            }
        } catch (error) {
            handleError(error);
        }
    };

    const loadPartData = async (partCode) => {
        if (!partCode) return;

        try {
            setLoading(true);
            const response = await WSParts.getPart(partCode);
            setIsTrackedByAsset(response.body.data.trackByAsset === 'true');
            setUoM(response.body.data.uom);
            return response.body.data;
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        setLoading(true);

        const relatedWorkOrder =
            equipmentMEC?.length > 0 ? workorder.number : null;

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

        // Remove original 'transactionInfo' propriety
        delete partUsageSubmitData.transactionInfo;

        // Submit the new part usage
        WSWorkorders.createPartUsage(partUsageSubmitData)
            .then(successHandler)
            .catch(handleError)
            .finally(() => setLoading(false));
    };

    const transformActivities = (activities) => {
        return activities.map((activity) => ({
            code: activity.activityCode,
            desc: activity.tradeCode,
        }));
    };

    const classes = useStyles();

    return (
        <div>
            <Dialog
                fullWidth
                id="addPartUsageDialog"
                open={isDialogOpen}
                onClose={handleCancel}
                aria-labelledby="form-dialog-title"
                classes={{
                    paper: classes.paper,
                }}
            >
                <DialogTitle id="form-dialog-title">Add Part Usage</DialogTitle>

                <DialogContent id="content" style={overflowStyle}>
                    <div>
                        <BlockUi
                            tag="div"
                            blocking={loading || isLoading}
                        >
                            <EAMRadio
                                {...processElementInfo(tabLayout['transactiontype'])}
                                valueKey={FORM.TRANSACTION_TYPE}
                                values={transactionTypes}
                                value={formData.transactionType}
                                updateProperty={updateFormDataProperty}
                                onChangeValue={handleTransactionChange}
                            />

                            <EAMSelect
                                {...processElementInfo(tabLayout['storecode'])}
                                required
                                valueKey={FORM.STORE}
                                value={formData.storeCode}
                                updateProperty={updateFormDataProperty}
                                onChangeValue={handleStoreChange}
                                autocompleteHandler={
                                    WSWorkorders.getPartUsageStores
                                }
                            />

                            <EAMSelect
                                {...processElementInfo(tabLayout['activity'])}
                                required
                                disabled={!formData.storeCode}
                                valueKey={FORM.ACTIVITY}
                                options={activityList}
                                value={formData.activityCode}
                                updateProperty={updateFormDataProperty}
                            />

                            <EAMAutocomplete
                                {...processElementInfo(tabLayout['partcode'])}
                                disabled={!formData.storeCode}
                                value={formData.partCode}
                                updateProperty={updateFormDataProperty}
                                valueKey={FORM.PART}
                                desc={formData.partDesc}
                                descKey={FORM.PART_DESC}
                                autocompleteHandler={
                                    WSWorkorders.getPartUsagePart
                                }
                                autocompleteHandlerParams={[
                                    workorder.number,
                                    formData.storeCode,
                                ]}
                                onChangeValue={handlePartChange}
                                barcodeScanner
                            />

                            <EAMAutocomplete
                                {...processElementInfo(tabLayout['assetid'])}
                                disabled={
                                    !formData.storeCode ||
                                    !formData.activityCode ||
                                    (formData.partCode && !isTrackedByAsset)
                                }
                                value={formData.assetIDCode}
                                updateProperty={updateFormDataProperty}
                                valueKey={FORM.ASSET}
                                desc={formData.assetIDDesc}
                                descKey={FORM.ASSET_DESC}
                                autocompleteHandler={
                                    WSWorkorders.getPartUsageAsset
                                }
                                autocompleteHandlerParams={[
                                    formData.transactionType,
                                    formData.storeCode,
                                    formData.partCode
                                ]}
                                onChangeValue={handleAssetChange}
                                barcodeScanner
                                renderDependencies={[formData.partCode]}
                            />

                            <EAMSelect
                                {...processElementInfo(tabLayout['bincode'])}
                                disabled={!formData.storeCode}
                                valueKey={FORM.BIN}
                                options={binList}
                                value={formData.bin}
                                updateProperty={updateFormDataProperty}
                                suggestionsPixelHeight={200}
                            />

                            <EAMTextField
                                {...processElementInfo(tabLayout['transactionquantity'])}
                                disabled={
                                    !formData.storeCode ||
                                    !formData.partCode ||
                                    isTrackedByAsset
                                }
                                valueKey={FORM.TRANSACTION_QTY}
                                endTextAdornment={uom}
                                value={formData.transactionQty}
                                updateProperty={updateFormDataProperty}
                                renderDependencies={uom}
                            />
                        </BlockUi>
                    </div>
                </DialogContent>

                <DialogActions>
                    <div>
                        <Button
                            onClick={handleCancel}
                            color="primary"
                            disabled={loading || isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            color="primary"
                            disabled={loading || isLoading}
                        >
                            Save
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default PartUsageDialog;