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
    const [storeList, setStoreList] = useState([]);
    const [activityList, setActivityList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uom, setUoM] = useState("");
    const [isTrackedByAsset, setIsTrackedByAsset] = useState(false);

    useEffect(() => {
        if (props.isDialogOpen) {
            initNewPartUsage(props.workorder);
        }
    }, [props.isDialogOpen])

    let initNewPartUsage = (workorder) => {
        setLoading(true);
        //Fetch the new part usage object
        WSWorkorders.getInitNewPartUsage(workorder).then(response => {
            setLoading(false);
            setPartUsage(response.body.data);
            setPartUsageLine(response.body.data.transactionlines[0]);
        }).catch(error => {
            props.handleError(error);
        });
        //Load lists
        loadLists(workorder);
    };

    let loadLists = (workorder) => {
        Promise.all([WSWorkorders.getPartUsageStores(),
                            WSWorkorders.getWorkOrderActivities(workorder.number)]).then(responses => {
            setStoreList(responses[0].body.data);
            setActivityList(transformActivities(responses[1].body.data));
        }).catch(error => {
            props.handleError(error);
        });
        //Bin list
        setBinList([]);
    };

    let updatePartUsageProperty = (key, value) => {
        setPartUsage((prevPartUsage) => ({
            ...prevPartUsage,
            [key]: value,
        }));
    };

    let updatePartUsageLineProperty = (key, value) => {
        setPartUsageLine((prevPartUsageLine) => ({
            ...prevPartUsageLine,
            [key]: value,
        }));
    };

    let handleTransactionChange = (value) => {
        //Init all properties
        updatePartUsageLineProperty('partCode', '');
        updatePartUsageLineProperty('partDesc', '');
        updatePartUsageLineProperty('assetIDCode', '');
        updatePartUsageLineProperty('assetIDDesc', '');
        //Bin list
        setBinList([])
        updatePartUsageLineProperty('bin', '');
    };

    let handleStoreChange = (value) => {
        updatePartUsageLineProperty('partCode', '');
        updatePartUsageLineProperty('partDesc', '');
        updatePartUsageLineProperty('assetIDCode', '');
        updatePartUsageLineProperty('assetIDDesc', '');
        //Bin list
        setBinList([])
        updatePartUsageLineProperty('bin', '');
    };

    /* This function handles at least 3 cases:
     * 1) The part is selected so we only need to update the bin and bin list states
     *    (hence the conditions for whether the part is defined).
     * 2) The user searches for an asset ID directly (without selecting a part), so we
     *    have to set more state: partCode, partDesc, bin and bin list.
     * 3) The input is cleared // TODO: check behavior is ok
     */
    const handleAssetChange = (assetIDCode) => {
        console.log("*** (handleAssetChange) ***")
        // console.log("\t| partUsageLine:", partUsageLine);
        //Clear part and bin selection
        if (!partUsageLine.partCode) {
            console.log("\t;;;;;; partCode NOT defined ;;;;;;", partUsageLine.partCode);
            updatePartUsageLineProperty('partCode', '');
            updatePartUsageLineProperty('partDesc', '');
        }
        updatePartUsageLineProperty('bin', '');
        //Complete data for change Asset
        WSWorkorders.getPartUsageSelectedAsset(props.workorder.number, partUsage.transactionType,
            partUsage.storeCode, assetIDCode).then(response => {
            const completeData = response.body.data[0];
            if (completeData) {
                updatePartUsageLineProperty('bin', completeData.bin);
                loadBinList(completeData.bin, completeData.part);
                if (!partUsageLine.partCode){
                    updatePartUsageLineProperty('partCode', completeData.part);
                }
            }
            if (!partUsageLine.partCode) {
                WSParts.getPart(completeData.part).then((response) => {
                    setIsTrackedByAsset(response.body.data.trackByAsset === "true");
                    setUoM(response.body.data.uom);
                    updatePartUsageLineProperty('partDesc', response.body.data.description);
                });
            }
        }).catch(error => {
            props.handleError(error);
        });
    };

    let handlePartChange = (value) => {
        //Clear asset and bin selection
        updatePartUsageLineProperty('assetIDCode', '');
        updatePartUsageLineProperty('assetIDDesc', '');
        updatePartUsageLineProperty('bin', '');
        //Load the bin list
        loadBinList('', value);
        loadPartData(value);
    };

    let loadBinList = (binCode, partCode) => {
        if (!partCode)
            return;
        WSWorkorders.getPartUsageBin(partUsage.transactionType,
            binCode, partCode, partUsage.storeCode).then(response => {
            let binList = response.body.data;
            setBinList(binList)
            if (binList.length === 1) {
                updatePartUsageLineProperty('bin', binList[0].code);
            }
        }).catch(error => {
            props.handleError(error);
        });
    };

    let loadPartData = (partCode) => {
        if (!partCode) return;

        WSParts.getPart(partCode).then(response => {
            setIsTrackedByAsset(response.body.data.trackByAsset === 'true');
            setUoM(response.body.data.uom);
        })
    }

    let handleSave = () => {
        //Call the handle save from the parent
        setLoading(true);
        const relatedWorkOrder = props.equipmentMEC && props.equipmentMEC.length > 0 ? props.workorder.number : null;
        let partUsageCopy = {...partUsage, relatedWorkOrder};
        //Set the part usage Line
        partUsageCopy.transactionlines = [partUsageLine];
        //Remove transaction info prop
        delete partUsageCopy.transactionInfo;
        //Save the record
        WSWorkorders.createPartUsage(partUsageCopy)
        .then(props.successHandler)
        .catch(props.handleError)
        .finally(() => setLoading(false));
    };

    let transformActivities = (activities) => {
        return activities.map(activity => ({
            code: activity.activityCode,
            desc: activity.tradeCode
        }));
    }

    const classes = useStyles();

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
                                      value={partUsage.transactionType}
                                      updateProperty={updatePartUsageProperty}
                                      onChangeValue={handleTransactionChange}
                                      children={props.children}
                            />

                            <EAMSelect
                                elementInfo={{...props.tabLayout['storecode'], attribute: 'R'}}
                                valueKey="storeCode"
                                options={storeList}
                                value={partUsage.storeCode}
                                updateProperty={updatePartUsageProperty}
                                onChangeValue={handleStoreChange}
                                children={props.children}/>


                            <EAMSelect
                                elementInfo={{
                                    ...props.tabLayout["activity"],
                                    attribute: "R",
                                    readonly: !partUsage.storeCode,
                                }}
                                valueKey="activityCode"
                                options={activityList}
                                value={partUsage.activityCode}
                                updateProperty={updatePartUsageProperty}
                                children={props.children}/>

                            <EAMAutocomplete
                                elementInfo={{
                                    ...props.tabLayout["partcode"],
                                    readonly: !partUsage.storeCode,
                                }}
                                value={partUsageLine.partCode}
                                updateProperty={updatePartUsageLineProperty}
                                valueKey="partCode"
                                desc={partUsageLine.partDesc}
                                descKey="partDesc"
                                autocompleteHandler={
                                    WSWorkorders.getPartUsagePart
                                }
                                autocompleteHandlerParams={[props.workorder.number, partUsage.storeCode]}
                                onChangeValue={handlePartChange}
                                barcodeScanner
                                children={props.children}
                                />

                            <EAMAutocomplete
                                elementInfo={{
                                    ...props.tabLayout["assetid"],
                                    readonly:
                                        !partUsage.storeCode ||
                                        !partUsage.activityCode ||
                                        (partUsage.storeCode?.trim() === '' &&
                                            !isTrackedByAsset),
                                }}
                                value={partUsageLine.assetIDCode}
                                updateProperty={updatePartUsageLineProperty}
                                valueKey="assetIDCode"
                                desc={partUsageLine.assetIDDesc}
                                descKey="assetIDDesc"
                                autocompleteHandler={WSWorkorders.getPartUsageAsset}
                                autocompleteHandlerParams={[partUsage.transactionType, partUsage.storeCode]}
                                onChangeValue={handleAssetChange}
                                barcodeScanner
                                children={props.children}/>

                            <EAMSelect
                                elementInfo={{
                                    ...props.tabLayout["bincode"],
                                    readonly: !partUsage.storeCode,
                                }}
                                valueKey="bin"
                                options={binList}
                                value={partUsageLine.bin}
                                updateProperty={updatePartUsageLineProperty}
                                children={props.children}
                                suggestionsPixelHeight={200}/>

                            <EAMTextField
                                elementInfo={{
                                    ...props.tabLayout["transactionquantity"],
                                    readonly:
                                        !partUsage.storeCode ||
                                        isTrackedByAsset,
                                }}
                                valueKey="transactionQty"
                                endAdornment={uom}
                                value={partUsageLine.transactionQty}
                                updateProperty={updatePartUsageLineProperty}
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