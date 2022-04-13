import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import BlockUi from 'react-block-ui';
import WSWorkorders from "../../../../tools/WSWorkorders";
import EAMRadio from "eam-components/ui/components/muiinputs/EAMRadio";
import EAMSelect from "eam-components/ui/components/muiinputs/EAMSelect";
import EAMAutocomplete from "eam-components/ui/components/muiinputs/EAMAutocomplete";
import EAMInput from "eam-components/ui/components/muiinputs/EAMInput";
import EAMBarcodeInput from "eam-components/ui/components/muiinputs/EAMBarcodeInput";
import WSParts from '../../../../tools/WSParts';
import makeStyles from '@mui/styles/makeStyles';

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
        setPartUsage(prevPartUsage => ({
            ...prevPartUsage,
            [key]: value
        }));
    };

    let updatePartUsageLineProperty = (key, value) => {
        setPartUsageLine(prevPartUsageLine => ({
            ...prevPartUsageLine,
            [key]: value
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

    let handleAssetChange = (value) => {
        //Clear part and bin selection
        updatePartUsageLineProperty('partCode', '');
        updatePartUsageLineProperty('partDesc', '');
        updatePartUsageLineProperty('bin', '');
        //Complete data for change Asset
        WSWorkorders.getPartUsageSelectedAsset(props.workorder.number, partUsage.transactionType,
            partUsage.storeCode, value).then(response => {
            const completeData = response.body.data[0];
            if (completeData) {
                updatePartUsageLineProperty('bin', completeData.bin);
                updatePartUsageLineProperty('partCode', completeData.part);
                loadBinList(completeData.bin, completeData.part);
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

                            <EAMSelect elementInfo={{...props.tabLayout['storecode'], attribute: 'R'}}
                                       valueKey="storeCode"
                                       values={storeList}
                                       value={partUsage.storeCode}
                                       updateProperty={updatePartUsageProperty}
                                       onChangeValue={handleStoreChange}
                                       children={props.children}/>

                            <EAMSelect elementInfo={{...props.tabLayout['activity'], attribute: 'R', readonly: !partUsage.storeCode}}
                                       valueKey="activityCode"
                                       values={activityList}
                                       value={partUsage.activityCode}
                                       updateProperty={updatePartUsageProperty}
                                       children={props.children}/>

                            <EAMBarcodeInput updateProperty={value => {
                                handlePartChange(value);
                                updatePartUsageLineProperty('partCode', value);
                            }} right={0} top={20}>
                                <EAMAutocomplete elementInfo={{...props.tabLayout['partcode'], readonly: !partUsage.storeCode}}
                                                 value={partUsageLine.partCode}
                                                 updateProperty={updatePartUsageLineProperty}
                                                 valueKey="partCode"
                                                 valueDesc={partUsageLine.partDesc}
                                                 descKey="partDesc"
                                                 autocompleteHandler={(value, config) => WSWorkorders.getPartUsagePart(props.workorder.number, partUsage.storeCode, value, config)}
                                                 onChangeValue={handlePartChange}
                                                 children={props.children}/>

                            </EAMBarcodeInput>
                            <EAMBarcodeInput updateProperty={value => {
                                handleAssetChange(value);
                                updatePartUsageLineProperty('assetIDCode', value);
                            }} right={0} top={20}>
                                <EAMAutocomplete elementInfo={{...props.tabLayout['assetid'], readonly: !partUsage.storeCode || !isTrackedByAsset}}
                                                 value={partUsageLine.assetIDCode}
                                                 updateProperty={updatePartUsageLineProperty}
                                                 valueKey="assetIDCode"
                                                 valueDesc={partUsageLine.assetIDDesc}
                                                 descKey="assetIDDesc"
                                                 autocompleteHandler={(value, config) => WSWorkorders.getPartUsageAsset(partUsage.transactionType, partUsage.storeCode, value, config)}
                                                 onChangeValue={handleAssetChange}
                                                 children={props.children}/>
                            </EAMBarcodeInput>

                            <EAMSelect elementInfo={{...props.tabLayout['bincode'], readonly: !partUsage.storeCode}}
                                       valueKey="bin"
                                       values={binList}
                                       value={partUsageLine.bin}
                                       updateProperty={updatePartUsageLineProperty}
                                       children={props.children}
                                       suggestionsPixelHeight={200} 
                            />

                            <EAMInput elementInfo={{...props.tabLayout['transactionquantity'], readonly: !partUsage.storeCode || isTrackedByAsset}}
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