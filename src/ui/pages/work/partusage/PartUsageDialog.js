import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import BlockUi from 'react-block-ui';
import WSWorkorders from "../../../../tools/WSWorkorders";
import EAMRadio from "eam-components/dist/ui/components/muiinputs/EAMRadio";
import EAMSelect from "eam-components/dist/ui/components/muiinputs/EAMSelect";
import EAMAutocomplete from "eam-components/dist/ui/components/muiinputs/EAMAutocomplete";
import EAMInput from "eam-components/dist/ui/components/muiinputs/EAMInput";
import EAMBarcodeInput from "eam-components/dist/ui/components/muiinputs/EAMBarcodeInput";


const transactionTypes = [{code: 'ISSUE', desc: 'Issue'}, {code: 'RETURN', desc: 'Return'}];

function PartUsageDialog(props) {

    let [partUsage, setPartUsage] = useState({});
    let [partUsageLine, setPartUsageLine] = useState({});
    let [binList, setBinList] = useState([]);
    let [storeList, setStoreList] = useState([]);
    let [activityList, setActivityList] = useState([]);
    let [loading, setLoading] = useState(false);

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
        console.log('transaction change')
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
        console.log('store change')
        updatePartUsageLineProperty('partCode', '');
        updatePartUsageLineProperty('partDesc', '');
        updatePartUsageLineProperty('assetIDCode', '');
        updatePartUsageLineProperty('assetIDDesc', '');
        //Bin list
        setBinList([])
        updatePartUsageLineProperty('bin', '');
    };

    let handleAssetChange = (value) => {
        //Only if value really change
        if (value && value !== partUsageLine.assetIDCode) {
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
        }
    };

    let handlePartChange = (value) => {
        //Only if value really change
        if (value && value !== partUsageLine.partCode) {
            //Clear asset and bin selection
            updatePartUsageLineProperty('assetIDCode', '');
            updatePartUsageLineProperty('assetIDDesc', '');
            updatePartUsageLineProperty('bin', '');
            //Load the bin list
            loadBinList('', value);
        }
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

    let handleSave = () => {
        //Call the handle save from the parent
        props.handleSave(partUsage, partUsageLine);
    };

    let transformActivities = (activities) => {
        return activities.map(activity => ({
            code: activity.activityCode,
            desc: activity.tradeCode
        }));
    }


    return (
        <div>
            <Dialog
                fullWidth
                id="addPartUsageDialog"
                open={props.isDialogOpen}
                onClose={props.handleCancel}
                aria-labelledby="form-dialog-title"
                disableBackdropClick={true}>

                <DialogTitle id="form-dialog-title">Add Part Usage</DialogTitle>

                <DialogContent id="content">
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
                                       onChangeValue={() => console.log('kura')}
                                       children={props.children}/>

                            <EAMSelect elementInfo={{...props.tabLayout['activity'], attribute: 'R'}}
                                       valueKey="activityCode"
                                       values={activityList}
                                       value={partUsage.activityCode}
                                       updateProperty={updatePartUsageProperty}
                                       children={props.children}/>

                            <EAMBarcodeInput updateProperty={value => {
                                handlePartChange(value);
                                updatePartUsageLineProperty('partCode', value);
                            }} right={0} top={20}>
                                <EAMAutocomplete elementInfo={props.tabLayout['partcode']}
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
                                <EAMAutocomplete elementInfo={props.tabLayout['assetid']}
                                                 value={partUsageLine.assetIDCode}
                                                 updateProperty={updatePartUsageLineProperty}
                                                 valueKey="assetIDCode"
                                                 valueDesc={partUsageLine.assetIDDesc}
                                                 descKey="assetIDDesc"
                                                 autocompleteHandler={(value, config) => WSWorkorders.getPartUsageAsset(partUsage.transactionType, partUsage.storeCode, value, config)}
                                                 onChangeValue={handleAssetChange}
                                                 children={props.children}/>
                            </EAMBarcodeInput>

                            <EAMSelect elementInfo={props.tabLayout['bincode']}
                                       valueKey="bin"
                                       values={binList}
                                       value={partUsageLine.bin}
                                       updateProperty={updatePartUsageLineProperty}
                                       children={props.children}
                            />

                            <EAMInput elementInfo={props.tabLayout['transactionquantity']}
                                      valueKey="transactionQty"
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
    )

}

export default PartUsageDialog;