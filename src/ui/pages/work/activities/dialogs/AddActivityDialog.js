import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import BlockUi from 'react-block-ui'
import './AddActivityDialog.css'
import EAMInput from "eam-components/dist/ui/components/muiinputs/EAMInput";
import EAMAutocomplete from "eam-components/dist/ui/components/muiinputs/EAMAutocomplete";
import WSWorkorders from "../../../../../tools/WSWorkorders";
import EAMDatePicker from "eam-components/dist/ui/components/muiinputs/EAMDatePicker";
import KeyCode from "../../../../../enums/KeyCode";

/**
 * Display detail of an activity
 */
export default class AddActivityDialog extends Component {

    state = {
        loading: true,
        formValues: {}
    };

    componentDidMount() {
        this.init(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.workorderNumber && nextProps.workorderNumber !== this.props.workorderNumber) {
            this.init(nextProps);
        }
    }

    init = (props) => {
        WSWorkorders.initWorkOrderActivity(props.workorderNumber).then(response => {
            this.setState(() => ({
                formValues: response.body.data,
                loading: false
            }));
        });
    };

    handleClose = () => {
        this.props.onClose();
    };

    handleSave = () => {
        let activity = {...this.state.formValues}
        delete activity.taskDesc;
        delete activity.tradeDesc;
        delete activity.materialListDesc;

        this.setState({loading: true});
        WSWorkorders.createWorkOrderActivity(activity)
            .then(result => {
                //Post add handler
                this.props.postAddActivityHandler();
                this.setState({loading: false});
                this.props.showNotification("Activity successfully created");
                this.handleClose();
                this.props.onChange();
                this.init(this.props);

            })
            .catch(error => {
                this.setState({loading: false});
                this.props.handleError(error)
            });
    };


    updateFormValues = (key, value) => {
        this.setState((prevState) => ({
            formValues: {
                ...prevState.formValues,
                [key]: value
            }
        }));
    };

    onKeyDown(e) {
        if (e.keyCode === KeyCode.ENTER) {
            this.handleSave();
        }
    }

    render() {
        return (
            <div onKeyDown={this.onKeyDown.bind(this)}>
                <BlockUi blocking={this.state.loading}>
                    <Dialog
                        fullWidth
                        id="addActivityDialog"
                        open={this.props.open}
                        onClose={this.handleClose}
                        aria-labelledby="form-dialog-title"
                        disableBackdropClick={true}>

                        <DialogTitle id="form-dialog-title">Add Activity</DialogTitle>

                        <DialogContent id="content">
                            <div>
                                <BlockUi tag="div" blocking={this.state.loading}>
                                    <EAMInput
                                        elementInfo={this.props.layout.activity}
                                        valueKey="activityCode"
                                        value={this.state.formValues['activityCode']}
                                        updateProperty={this.updateFormValues}
                                    />

                                    <EAMInput
                                        elementInfo={this.props.layout.activitynote}
                                        valueKey="activityNote"
                                        value={this.state.formValues['activityNote']}
                                        updateProperty={this.updateFormValues}
                                    />

                                    <EAMAutocomplete
                                        autocompleteHandler={WSWorkorders.autocompleteACTTrade}
                                        elementInfo={this.props.layout.trade}
                                        valueKey="tradeCode"
                                        value={this.state.formValues['tradeCode']}
                                        valueDesc={this.state.formValues['tradeDesc']}
                                        descKey="tradeDesc"
                                        updateProperty={this.updateFormValues}/>

                                    <EAMInput
                                        required={true}
                                        elementInfo={this.props.layout.personsreq}
                                        valueKey="peopleRequired"
                                        value={this.state.formValues['peopleRequired']}
                                        updateProperty={this.updateFormValues}
                                    />

                                    <EAMInput
                                        required={true}
                                        elementInfo={this.props.layout.esthrs}
                                        valueKey="estimatedHours"
                                        value={this.state.formValues['estimatedHours']}
                                        updateProperty={this.updateFormValues}
                                    />

                                    <EAMDatePicker
                                        elementInfo={this.props.layout.actstartdate}
                                        valueKey="startDate"
                                        value={this.state.formValues['startDate']}
                                        updateProperty={this.updateFormValues}
                                    />

                                    <EAMDatePicker
                                        elementInfo={this.props.layout.actenddate}
                                        valueKey="endDate"
                                        value={this.state.formValues['endDate']}
                                        updateProperty={this.updateFormValues}
                                    />

                                    <EAMAutocomplete
                                        autocompleteHandler={WSWorkorders.autocompleteACTTask}
                                        elementInfo={this.props.layout.task}
                                        valueKey="taskCode"
                                        value={this.state.formValues['taskCode']}
                                        valueDesc={this.state.formValues['taskDesc']}
                                        descKey="taskDesc"
                                        updateProperty={this.updateFormValues}/>

                                    <EAMAutocomplete
                                        autocompleteHandler={WSWorkorders.autocompleteACTMatList}
                                        elementInfo={this.props.layout.matlcode}
                                        valueKey="materialList"
                                        value={this.state.formValues['materialList']}
                                        valueDesc={this.state.formValues['materialListDesc']}
                                        descKey="materialListDesc"
                                        updateProperty={this.updateFormValues}/>

                                </BlockUi>
                            </div>
                        </DialogContent>

                        <DialogActions>
                            <div>
                                <BlockUi tag="div" blocking={this.state.loading}>
                                    <Button onClick={this.handleClose} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={this.handleSave} color="primary" autoFocus>
                                        Save
                                    </Button>
                                </BlockUi>
                            </div>
                        </DialogActions>

                    </Dialog>
                </BlockUi>
            </div>
        )
    }

}