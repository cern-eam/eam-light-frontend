import React, {Component} from 'react';
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

class PartUsageDialog extends Component {

    state = {
        partUsage: {},
        partUsageLine: {},
        binList: [],
        storeList: [],
        activityList: [],
        loadingDialog: true,
    };

    componentWillMount() {
        this.initNewPartUsage(this.props.workorder);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.workorder.number && nextProps.workorder.number !== this.props.workorder.number)
            this.initNewPartUsage(nextProps.workorder);
        else if (this.props.isDialogOpen && this.props.isDialogOpen !== nextProps.isDialogOpen)
            this.initNewPartUsage(nextProps.workorder);
        else if (!this.props.isDialogOpen && nextProps.isDialogOpen) {
            //If no store and no activity, we init complete
            if (!this.state.partUsage.storeCode && !this.state.partUsage.activityCode) {
                this.initNewPartUsage(nextProps.workorder);
            } else {/*Just the lists*/
                this.loadLists(nextProps.workorder);
            }
        }
    }

    initNewPartUsage = (workorder) => {
        //Fetch the new part usage object
        WSWorkorders.getInitNewPartUsage(workorder).then(response => {
            this.setState(() => ({
                partUsage: response.body.data,
                partUsageLine: response.body.data.transactionlines[0],
            }));
        }).catch(error => {
            this.props.handleError(error);
        });
        //Load lists
        this.loadLists(workorder);
    };

    loadLists = (workorder) => {
        //Set loading
        this.setLoading(true);
        Promise.all([WSWorkorders.getPartUsageStores(),
            WSWorkorders.getWorkOrderActivities(workorder.number)]).then(responses => {
            this.setState(() => ({storeList: responses[0].body.data}));
            this.setState(() => ({activityList: this.transformActivities(responses[1].body.data)}));
            this.setLoading(false);
        }).catch(error => {
            this.props.handleError(error);
            this.setLoading(false);
        });
        //Bin list
        this.setState((prevState) => ({...prevState, binList: []}));
    };

    updatePartUsageProperty = (key, value) => {
        this.setState((prevState) => ({
            partUsage: {
                ...prevState.partUsage,
                [key]: value
            }
        }));
    };

    updatePartUsageLineProperty = (key, value) => {
        this.setState((prevState) => ({
            partUsageLine: {
                ...prevState.partUsageLine,
                [key]: value
            }
        }));
    };

    handleTransactionChange = (value) => {
        //Init all properties
        this.updatePartUsageLineProperty('partCode', '');
        this.updatePartUsageLineProperty('partDesc', '');
        this.updatePartUsageLineProperty('assetIDCode', '');
        this.updatePartUsageLineProperty('assetIDDesc', '');
        //Bin list
        this.setState((prevState) => ({...prevState, binList: []}));
        this.updatePartUsageLineProperty('bin', '');
    };

    handleStoreChange = (value) => {
        this.updatePartUsageLineProperty('partCode', '');
        this.updatePartUsageLineProperty('partDesc', '');
        this.updatePartUsageLineProperty('assetIDCode', '');
        this.updatePartUsageLineProperty('assetIDDesc', '');
        //Bin list
        this.setState((prevState) => ({...prevState, binList: []}));
        this.updatePartUsageLineProperty('bin', '');
    };

    handleAssetChange = (value) => {
        //Only if value really change
        if (value && value !== this.state.partUsageLine.assetIDCode) {
            //Clear part and bin selection
            this.updatePartUsageLineProperty('partCode', '');
            this.updatePartUsageLineProperty('partDesc', '');
            this.updatePartUsageLineProperty('bin', '');
            //Complete data for change Asset
            WSWorkorders.getPartUsageSelectedAsset(this.props.workorder.number, this.state.partUsage.transactionType,
                this.state.partUsage.storeCode, value).then(response => {
                const completeData = response.body.data[0];
                if (completeData) {
                    this.updatePartUsageLineProperty('bin', completeData.bin);
                    this.updatePartUsageLineProperty('partCode', completeData.part);
                    this.loadBinList(completeData.bin, completeData.part);
                }
            }).catch(error => {
                this.props.handleError(error);
            });
        }
    };

    handlePartChange = (value) => {
        //Only if value really change
        if (value && value !== this.state.partUsageLine.partCode) {
            //Clear asset and bin selection
            this.updatePartUsageLineProperty('assetIDCode', '');
            this.updatePartUsageLineProperty('assetIDDesc', '');
            this.updatePartUsageLineProperty('bin', '');
            //Load the bin list
            this.loadBinList('', value);
        }
    };

    loadBinList = (binCode, partCode) => {
        if (!partCode)
            return;
        WSWorkorders.getPartUsageBin(this.state.partUsage.transactionType,
            binCode, partCode, this.state.partUsage.storeCode).then(response => {
            let binList = response.body.data;
            this.setState(() => ({binList}))
            if (binList.length === 1) {
                this.updatePartUsageLineProperty('bin', binList[0].code);
            }
        }).catch(error => {
            this.props.handleError(error);
        });
    };

    handleSave = () => {
        //Call the handle save from the parent
        this.props.handleSave(this.state.partUsage, this.state.partUsageLine);
    };

    transformActivities = (activities) => {
        return activities.map(activity => ({code: activity.activityCode,
                                            desc: activity.tradeCode}));
    }

    setLoading = (loadingDialog) => {
        this.setState(() => ({loadingDialog}));
    };

    render() {

        return (
            <div>
                <Dialog
                    fullWidth
                    id="addPartUsageDialog"
                    open={this.props.isDialogOpen}
                    onClose={this.handleCancel}
                    aria-labelledby="form-dialog-title"
                    disableBackdropClick={true}>

                    <DialogTitle id="form-dialog-title">Add Part Usage</DialogTitle>

                    <DialogContent id="content">
                        <div>
                            <BlockUi tag="div" blocking={this.props.isLoading || this.state.loadingDialog}>
                                <EAMRadio elementInfo={this.props.tabLayout['transactiontype']}
                                          valueKey="transactionType"
                                          values={transactionTypes}
                                          value={this.state.partUsage.transactionType}
                                          updateProperty={this.updatePartUsageProperty}
                                          onChangeValue={this.handleTransactionChange}
                                          children={this.props.children}
                                />

                                <EAMSelect elementInfo={{...this.props.tabLayout['storecode'], attribute: 'R'}}
                                           valueKey="storeCode"
                                           values={this.state.storeList}
                                           value={this.state.partUsage.storeCode}
                                           updateProperty={this.updatePartUsageProperty}
                                           onChangeValue={this.handleStoreChange}
                                           children={this.props.children}/>

                                <EAMSelect elementInfo={{...this.props.tabLayout['activity'], attribute: 'R'}}
                                           valueKey="activityCode"
                                           values={this.state.activityList}
                                           value={this.state.partUsage.activityCode}
                                           updateProperty={this.updatePartUsageProperty}
                                           children={this.props.children}/>

                                <EAMBarcodeInput updateProperty={value => {
                                    this.handlePartChange(value);
                                    this.updatePartUsageLineProperty('partCode', value);
                                }} right={0} top={20}>
                                    <EAMAutocomplete elementInfo={this.props.tabLayout['partcode']}
                                                     value={this.state.partUsageLine.partCode}
                                                     updateProperty={this.updatePartUsageLineProperty}
                                                     valueKey="partCode"
                                                     valueDesc={this.state.partUsageLine.partDesc}
                                                     descKey="partDesc"
                                                     autocompleteHandler={(value, config) => WSWorkorders.getPartUsagePart(this.props.workorder.number, this.state.partUsage.storeCode, value, config)}
                                                     onChangeValue={this.handlePartChange}
                                                     children={this.props.children}/>

                                </EAMBarcodeInput>
                                <EAMBarcodeInput updateProperty={value => {
                                    this.handleAssetChange(value);
                                    this.updatePartUsageLineProperty('assetIDCode', value);
                                }} right={0} top={20}>
                                <EAMAutocomplete elementInfo={this.props.tabLayout['assetid']}
                                                 value={this.state.partUsageLine.assetIDCode}
                                                 updateProperty={this.updatePartUsageLineProperty}
                                                 valueKey="assetIDCode"
                                                 valueDesc={this.state.partUsageLine.assetIDDesc}
                                                 descKey="assetIDDesc"
                                                 autocompleteHandler={(value, config) => WSWorkorders.getPartUsageAsset(this.state.partUsage.transactionType, this.state.partUsage.storeCode, value, config)}
                                                 onChangeValue={this.handleAssetChange}
                                                 children={this.props.children}/>
                                </EAMBarcodeInput>

                                <EAMSelect elementInfo={this.props.tabLayout['bincode']}
                                           valueKey="bin"
                                           values={this.state.binList}
                                           value={this.state.partUsageLine.bin}
                                           updateProperty={this.updatePartUsageLineProperty}
                                           children={this.props.children}
                                />

                                <EAMInput elementInfo={this.props.tabLayout['transactionquantity']}
                                          valueKey="transactionQty"
                                          value={this.state.partUsageLine.transactionQty}
                                          updateProperty={this.updatePartUsageLineProperty}
                                          children={this.props.children}/>

                            </BlockUi>
                        </div>
                    </DialogContent>


                    <DialogActions>
                        <div>
                            <Button onClick={this.props.handleCancel} color="primary"
                                    disabled={this.props.isLoading || this.state.loadingDialog}>
                                Cancel
                            </Button>
                            <Button onClick={this.handleSave} color="primary"
                                    disabled={this.props.isLoading || this.state.loadingDialog}>
                                Save
                            </Button>
                        </div>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default PartUsageDialog;