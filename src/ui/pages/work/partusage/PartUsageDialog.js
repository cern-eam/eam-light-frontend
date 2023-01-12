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
import useFieldsValidator from 'eam-components/dist/ui/components/inputs-ng/hooks/useFieldsValidator';
import WSParts from '../../../../tools/WSParts';
import makeStyles from '@mui/styles/makeStyles';
import EAMRadio from 'eam-components/dist/ui/components/inputs-ng/EAMRadio';
import { createOnChangeHandler, processElementInfo, isHidden } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';
import WSEquipment from "tools/WSEquipment";

const overflowStyle = {
    overflowY: 'visible'
}

const useStyles = makeStyles({
    paper: overflowStyle
});

const ISSUE = 'ISSUE';
const RETURN = 'RETURN';
const transactionTypes = [{code: ISSUE, desc: 'Issue'}, {code: RETURN, desc: 'Return'}];

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
    TRANSACTION_QTY: 'transactionQty',
    LOT: 'lot',
};

function PartUsageDialog(props) {
    const {
        isDialogOpen,
        handleError,
        showError,
        showNotification,
        showWarning,
        equipmentMEC,
        successHandler,
        handleCancel,
        isLoading,
        tabLayout,
        workorder
    } = props;

    const [binList, setBinList] = useState([]);
    const [lotList, setLotList] = useState([]);
    const [activityList, setActivityList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uom, setUoM] = useState('');
    const [isTrackedByAsset, setIsTrackedByAsset] = useState();
    const [formData, setFormData] = useState({}); // stores user changes (direct and indirect) for updating the part usage object
    const [initPartUsageWSData, setInitPartUsageWSData] = useState({});

    const fieldsData = {
        transactionType: tabLayout.transactiontype,
        storeCode: tabLayout.storecode,
        activityCode: tabLayout.activity,
        partCode: tabLayout.partcode,
        assetIDCode: tabLayout.assetid,
        bin: tabLayout.bincode,
        lot: tabLayout.lotcode,
        transactionQty: tabLayout.transactionquantity,
    };

    const { errorMessages, validateFields, resetErrorMessages } =
        useFieldsValidator(fieldsData, formData);

    const updateFormDataProperty = (key, value) => {
        setFormData((oldFormData) => ({
            ...oldFormData,
            [key]: value,
        }));
    };

    const runUiBlockingFunction = async (blockingFunction) => {
        try {
            setLoading(true);
            await blockingFunction();
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    }

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
        updateFormDataProperty(FORM.LOT, transactionLines.lot);
    };

    useEffect(() => {
        if (isDialogOpen) {
            runUiBlockingFunction(initNewPartUsage);
        } else {
            resetFormTransactionLinesAndRelatedStates();
            updateFormDataProperty(FORM.ACTIVITY, null);
            updateFormDataProperty(FORM.STORE, null);
            resetErrorMessages();
        }
    }, [isDialogOpen]);

    const initNewPartUsage = async () => {
        try {
            // Fetch the part usage object
            const response = await WSWorkorders.getInitNewPartUsage(workorder);
            const defaultTransactionData = response.body.data;
            setInitPartUsageWSData(defaultTransactionData);
            assignInitialFormState(defaultTransactionData);
            // Load lists
            await loadLists();
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
        setLotList([]);
    };

    const resetFieldWithDesc = (fieldValueKey, fieldDescKey) => {
        updateFormDataProperty(fieldValueKey, '');
        updateFormDataProperty(fieldDescKey, '');
    }

    const resetFieldWithList = (fieldValueKey, listSetterFunction) => {
        updateFormDataProperty(fieldValueKey, '');
        listSetterFunction([]);
    }

    const resetFormTransactionLinesAndRelatedStates = () => {
        // Reset 'transactionlines' proprieties (including associated options lists)
        resetFieldWithDesc(FORM.ASSET, FORM.ASSET_DESC);
        resetFieldWithDesc(FORM.PART, FORM.PART_DESC);
        resetFieldWithList(FORM.BIN, setBinList);
        resetFieldWithList(FORM.LOT, setLotList);

        // Reset other
        setUoM('');
        setIsTrackedByAsset(false);
    };

    const handleTransactionChange = () => {
        resetFormTransactionLinesAndRelatedStates();
    };

    const handleStoreChange = () => {
        resetFormTransactionLinesAndRelatedStates();
    };

    /* This function handles at least 3 cases:
     * 1) The asset ID field is cleared, is solely whitespace or is falsy.
     * 2) The user searches for an asset ID without having selected a part or by selecting it from the history
     *    (so we need to update the related state: part, bin and lot).
     * 3) There was already a part selected (so we only need to update the bin and lot states).
     */
    const handleAssetChange = async (assetIDCode) => {
        const { transactionType, partCode } = formData;

        // Reset related fields
        updateFormDataProperty(FORM.BIN, '');
        if (transactionType === ISSUE) {
            // In a return transaction the bin list is loaded when a part is selected so no need to reset
            resetFieldWithList(FORM.BIN, setBinList);
        }
        resetFieldWithList(FORM.LOT, setLotList);

        // Asset field is definitely not an asset code
        if (!assetIDCode || assetIDCode?.trim() === '') {
            // Reset state that may not reflect the value shown in the field
            resetFieldWithDesc(FORM.ASSET, FORM.ASSET_DESC);
            return;
        }

        try {
            const assetData = await getAssetData(assetIDCode);

            // Explicitly reset asset field since the selected asset was not valid
            if (!assetData) {
                resetFieldWithDesc(FORM.ASSET, FORM.ASSET_DESC);
                return;
            }

            // Asset selected without a part selected or with a different part associated (if selected from history)
            if (!partCode || partCode && partCode !== assetData.partCode) {
                await handleAssetDifferentOrNoPart(assetData);
            // Asset selected having already selected a part
            } else {
                await handleAssetSelectedWithPart(assetData);
            }
        } catch (error) {
            handleError(error);
        }
    };

    const getAssetData = async (assetIDCode) => {
        try {
            const response = await WSEquipment.getEquipment(assetIDCode);
            const data = response.body.data;

            const responseStoreCode = data.storeCode;
            const assetData = {
                bin: data.bin,
                partCode: data.partCode,
                lot: data.lot,
            }

            // Can happen if user un-focuses the input with an unexpected equipment selected (e.g. "A")
            if (Object.values(assetData).includes(null)) {
                showError('Unexpected asset selected.');
                return undefined;
            }

            const { transactionType, storeCode } = formData;

            if (transactionType === ISSUE) {
                if (!responseStoreCode) {
                    showError(`Asset "${assetIDCode}" is not available in any store.`);
                    return undefined;
                }

                // Asset is in a store other than the selected (can happen by selecting asset from input history)
                if (responseStoreCode !== storeCode) {
                    showError(`Asset "${assetIDCode}" is in a different store (${responseStoreCode}) than the selected.`);
                    return undefined;
                }

                return assetData;

            } else if (transactionType === RETURN) {
                if (responseStoreCode) {
                    showError(`Asset "${assetIDCode}" is already in a store (${responseStoreCode}).`);
                    return undefined;
                }

                return assetData;
            }

            // Something is wrong if we get here (user input or code-related)
            showError(`Asset "${assetIDCode}" does not follow business rules.`);
            return undefined;

        } catch (error){
            handleError(error);
        }
    };

    const handleAssetSelectedWithPart = async (assetData) => {
        const { bin, partCode, lot } = assetData;
        const { transactionType, storeCode } = formData;

        // When in an issue transaction, bin loading will also load the lot list
        // since assets have a single bin (which triggers lot loading).
        await Promise.all([
            loadBinList(bin, partCode),
            transactionType === RETURN
                ? loadLotList(transactionType, lot, bin, partCode, storeCode)
                : null,
        ]);
    };

    const handleAssetDifferentOrNoPart = async (assetData) => {
        const { partCode } = assetData;

        // Clear the part field so the user is aware that the selected asset is associated with a different part
        resetFieldWithDesc(FORM.PART, FORM.PART_DESC);

        const results = await Promise.all([
            loadPartData(partCode),
            handleAssetSelectedWithPart(assetData),
        ]);

        const partData = results[0];
        updateFormDataProperty(FORM.PART_DESC, partData?.description);
        updateFormDataProperty(FORM.PART, partCode);
    };

    const handleBinChange = async (bin) => {
        const { transactionType, partCode, storeCode, assetIDCode, lot } = formData;

        // On a Return transaction, the lot can be filled before the bin (we expect there to be a lot list already),
        // as such we must not clear the lot field and we can avoid re-loading the lot list.
        if (transactionType === RETURN) {
            return;
        }

        // If a part is tracked by asset, the lot should have already been automatically filled,
        // as such we must not clear the lot field nor do we need to load the lot list.
        if (isTrackedByAsset && assetIDCode && lot) {
            return;
        }

        if (transactionType === ISSUE) {
            resetFieldWithList(FORM.LOT, setLotList);
            await loadLotList(transactionType, '', bin, partCode, storeCode);
        }
    }

    const handlePartChange = async (partCode) => {
        // We should in principle clear related state because of data loads/field changes that come as side effects (such as the automatic selection of
        // a bin when there is only one possible) and because the user might have already filled related fields and afterwards change the selected part.
        resetFieldWithDesc(FORM.ASSET, FORM.ASSET_DESC);
        resetFieldWithList(FORM.BIN, setBinList);
        resetFieldWithList(FORM.LOT, setLotList);
        setIsTrackedByAsset(false);

        if (!partCode || partCode?.trim() === '') {
            resetFieldWithDesc(FORM.PART, FORM.PART_DESC); // clear state that may not reflect the value shown in the field
            return;
        }

        const { transactionType, storeCode } = formData;

        // Validate that the part is in the selected store (needed when a part is selected from history).
        // This is only needed in the issue transaction since parts can be returned to any store when doing a return transaction.
        if (transactionType === ISSUE) {
            try {
                const partStockResponse = await WSParts.getPartStock(partCode);
                const partStock = partStockResponse.body.data;

                // If not in the selected store, explicitly reset the part field since the part code will not be valid in that case.
                if (
                    !partStock.some(
                        (stockEntry) => stockEntry.storeCode === storeCode
                    )
                ) {
                    resetFieldWithDesc(FORM.PART, FORM.PART_DESC);
                    showError(
                        `Part "${partCode}" is not in the selected store.`
                    );
                    return;
                }
            } catch (error) {
                handleError(error);
            }
        }

        const partData = await loadPartData(partCode);

        if (partData?.trackByAsset === 'true') {
            showNotification(`Selected part "${partCode}" is tracked by asset.`);
            // Bin loading is done later when the user selects an asset.

        } else if (partData?.trackByAsset === 'false') {

            await Promise.all([
                loadBinList('', partCode),
                transactionType === RETURN
                    ? loadLotList(transactionType, '', '', partCode, '')
                    : null,
            ]);
        }
    };

    const loadLotList = async (transactionType, lot, bin, partCode, storeCode) => {
        try {
            const response = await WSWorkorders.getPartUsageLot(
                transactionType,
                lot,
                bin,
                partCode,
                storeCode
            );
            const lots = response.body.data;

            if (lots.length === 0) {
                showWarning('No lots found (likely no available quantity).');
            }

            if (lots.length === 1) {
                updateFormDataProperty(FORM.LOT, lots[0].code);
            }

            if (isHidden(tabLayout['lotcode']) && lots.length >= 1) {
                updateFormDataProperty(FORM.LOT, '*');
            }

            setLotList(lots);
        } catch (error) {
            handleError(error);
            setLotList([]);
        }
    };

    const loadBinList = async (binCode, partCode) => {
        if (!partCode) return;

        const { transactionType, storeCode } = formData;

        try {
            const response = await WSWorkorders.getPartUsageBin(
                transactionType,
                binCode,
                partCode,
                storeCode
            );
            const binList = response.body.data;

            setBinList(binList);

            if (binList.length === 1) {
                const availableBin = binList[0].code;
                updateFormDataProperty(FORM.BIN, availableBin);

                await loadLotList(transactionType, '', availableBin, partCode, storeCode);
            }

        } catch (error) {
            handleError(error);
            setBinList([]);
        }
    };

    const loadPartData = async (partCode) => {
        if (!partCode || partCode?.trim() === '') {
            return;
        }

        try {
            const response = await WSParts.getPart(partCode);
            const partData = response.body.data;

            setIsTrackedByAsset(partData?.trackByAsset === 'true');
            setUoM(partData?.uom);

            return partData;
        } catch (error) {
            handleError(error);
        }
    };

    const handleSave = async () => {
        if (!validateFields()) {
            return;
        }

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
            lot,
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
                lot,
                partCode,
                partDesc,
                transactionQty,
            },
        ];

        // Remove original 'transactionInfo' propriety
        delete partUsageSubmitData.transactionInfo;

        // Submit the new part usage
        try {
            await WSWorkorders.createPartUsage(partUsageSubmitData);
            successHandler();
        } catch (error) {
            handleError(error);
        }
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
                                values={transactionTypes}
                                value={formData.transactionType}
                                onChange={createOnChangeHandler(FORM.TRANSACTION_TYPE, null, null, updateFormDataProperty, handleTransactionChange)}
                            />

                            <EAMSelect
                                {...processElementInfo(tabLayout['storecode'])}
                                required
                                value={formData.storeCode}
                                onChange={createOnChangeHandler(FORM.STORE, null, null, updateFormDataProperty, handleStoreChange)}
                                autocompleteHandler={
                                    WSWorkorders.getPartUsageStores
                                }
                                errorText={errorMessages?.storeCode}
                            />

                            <EAMSelect
                                {...processElementInfo(tabLayout['activity'])}
                                disabled={!formData.storeCode}
                                options={activityList}
                                value={formData.activityCode}
                                onChange={createOnChangeHandler(FORM.ACTIVITY, null, null, updateFormDataProperty, null)}
                                errorText={errorMessages?.activityCode}
                            />

                            <EAMAutocomplete
                                {...processElementInfo(tabLayout['partcode'])}
                                disabled={
                                    !formData.storeCode ||
                                    !formData.activityCode
                                }
                                value={formData.partCode}
                                desc={formData.partDesc}
                                autocompleteHandler={
                                    WSWorkorders.getPartUsagePart
                                }
                                autocompleteHandlerParams={[
                                    workorder.number,
                                    formData.storeCode,
                                ]}
                                onChange={createOnChangeHandler(FORM.PART, FORM.PART_DESC, null, updateFormDataProperty,
                                    (part) =>
                                        runUiBlockingFunction(
                                            () => handlePartChange(part)
                                        )
                                )}
                                renderDependencies={[formData.transactionType]}
                                errorText={errorMessages?.partCode}
                                barcodeScanner
                            />

                            <EAMAutocomplete
                                {...processElementInfo(tabLayout['assetid'])}
                                disabled={
                                    !formData.storeCode ||
                                    !formData.activityCode ||
                                    (formData.partCode?.trim() !== '' && !isTrackedByAsset)
                                }
                                value={formData.assetIDCode}
                                desc={formData.assetIDDesc}
                                autocompleteHandler={
                                    WSWorkorders.getPartUsageAsset
                                }
                                autocompleteHandlerParams={[
                                    formData.transactionType,
                                    formData.storeCode,
                                    formData.partCode
                                ]}
                                onChange={createOnChangeHandler(FORM.ASSET, FORM.ASSET_DESC, null, updateFormDataProperty,
                                    (asset) =>
                                        runUiBlockingFunction(
                                            () => handleAssetChange(asset)
                                        )
                                )}
                                barcodeScanner
                                renderDependencies={[formData.partCode]}
                                errorText={errorMessages?.assetIDCode}
                            />

                            <EAMSelect
                                {...processElementInfo(tabLayout['bincode'])}
                                disabled={
                                    !formData.storeCode ||
                                    !formData.activityCode ||
                                    (isTrackedByAsset && (
                                        formData.transactionType === ISSUE ||
                                        (formData.transactionType === RETURN && !formData.assetIDCode))
                                    )
                                }
                                valueKey={FORM.BIN}
                                options={binList}
                                value={formData.bin}
                                onChange={createOnChangeHandler(FORM.BIN, null, null, updateFormDataProperty,
                                    (bin) =>
                                        runUiBlockingFunction(
                                            () => handleBinChange(bin)
                                        )
                                )}
                                suggestionsPixelHeight={200}
                                renderDependencies={[
                                    formData.transactionType,
                                    formData.partCode,
                                    formData.storeCode,
                                    formData.assetIDCode,
                                    formData.lot,
                                    isTrackedByAsset,
                                ]}
                                errorText={errorMessages?.bin}
                            />

                            <EAMSelect
                                {...processElementInfo(tabLayout['lotcode'])}
                                disabled={
                                    !formData.storeCode ||
                                    !formData.activityCode ||
                                    isTrackedByAsset
                                }
                                valueKey={FORM.LOT}
                                options={lotList}
                                value={formData.lot}
                                onChange={createOnChangeHandler(FORM.LOT, null, null, updateFormDataProperty)}
                                errorText={errorMessages?.lot}
                            />

                            <EAMTextField
                                {...processElementInfo(tabLayout['transactionquantity'])}
                                disabled={
                                    !formData.storeCode ||
                                    !formData.partCode ||
                                    isTrackedByAsset
                                }
                                endTextAdornment={uom}
                                value={formData.transactionQty}
                                onChange={createOnChangeHandler(FORM.TRANSACTION_QTY, null, null, updateFormDataProperty)}
                                renderDependencies={uom}
                                errorText={errorMessages?.transactionQty}
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
                            onClick={() => runUiBlockingFunction(handleSave)}
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