import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import BlockUi from 'react-block-ui'
import './AddActivityDialog.css'
import EAMInput from "eam-components/dist/ui/components/muiinputs/EAMInput";
import WSWorkorders from "../../../../../tools/WSWorkorders";
import EAMSelect from "eam-components/dist/ui/components/muiinputs/EAMSelect";
import EAMDatePicker from "eam-components/dist/ui/components/muiinputs/EAMDatePicker";
import EAMAutocomplete from "eam-components/dist/ui/components/muiinputs/EAMAutocomplete";
import KeyCode from "../../../../../enums/KeyCode";


/**
 * Display detail of an activity
 */
export default class AddActivityDialog extends Component {

    state = {
        loading: true,
        formValues: {},
        typesOfHour: []
    };

    componentDidMount() {
        this.init(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.workorderNumber && nextProps.workorderNumber !== this.props.workorderNumber) {
            this.init(nextProps);
        }
    }

    getDepartment() {
        if (!this.props.user.eamAccount.userDepartments && this.props.user.eamAccount.userDepartments.length > 0) {
            return this.props.user.eamAccount.userDepartments[0];
        } else if (this.props.department) {
            return this.props.department;
        } else {
            return '*';
        }
    }

    init = (props) => {
        WSWorkorders.initBookingLabour(props.workorderNumber, this.getDepartment())
            .then(response => {
                
                // if only one activity set the select to
                // this activity
                if(props.activities.length === 1) {
                    this.setState({
                        formValues: {
                            ...response.body.data,
                            employeeCode: this.props.defaultEmployee,
                            activityCode: '5'
                        },
                        loading: false
                    });
                } else {
                    this.setState({
                        formValues: {
                            ...response.body.data,
                            employeeCode: this.props.defaultEmployee,
                        },
                        loading: false
                    });
                }

            })
            .catch(error => {
                this.setState({
                    loading: false
                });
            });

        WSWorkorders.getTypesOfHours().then(response => {
            this.setState({typesOfHour: response.body.data});
        });
    };

    handleClose = () => {
        this.props.onClose();
    };

    handleSave = () => {
        // Populate trade code
        let tradeCode = "";
        let filteredActivities = this.props.activities.filter(activity => activity.activityCode === this.state.formValues.activityCode);
        if (filteredActivities.length === 1) {
            tradeCode = filteredActivities[0].tradeCode;
        }

        let bookingLabour = {
            ...this.state.formValues,
            tradeCode
        }
        delete bookingLabour.departmentDesc;

        this.setState({loading: true});
        WSWorkorders.createBookingLabour(bookingLabour)
            .then(result => {
                this.setState({loading: false});
                this.props.showNotification("Booking labour successfully created")
                this.handleClose();
                this.props.onChange();
                this.init();

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
                <Dialog
                    fullWidth
                    id="addBookLabourDialog"
                    open={this.props.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                    disableBackdropClick={true}
                >
                    <DialogTitle id="form-dialog-title">Book Labor</DialogTitle>

                    <DialogContent id="content">
                        <div>
                            <BlockUi tag="div" blocking={this.state.loading}>
                                <EAMSelect
                                    elementInfo={this.props.layout.booactivity}
                                    valueKey="activityCode"
                                    value={this.state.formValues['activityCode'] || ''}
                                    values={this.props.activities.map(activity => {
                                        return {
                                            code: activity.activityCode,
                                            desc: activity.activityCode + ' - ' + activity.tradeCode
                                        }
                                    })}
                                    updateProperty={this.updateFormValues}
                                />

                                <EAMAutocomplete
                                    autocompleteHandler={WSWorkorders.autocompleteBOOEmployee}
                                    elementInfo={this.props.layout.employee}
                                    valueKey="employeeCode"
                                    value={this.state.formValues['employeeCode']}
                                    valueDesc={this.state.formValues['employeeDesc']}
                                    descKey="employeeDesc"
                                    updateProperty={this.updateFormValues}
                                />

                                <EAMAutocomplete
                                    autocompleteHandler={WSWorkorders.autocompleteBOODepartment}
                                    elementInfo={this.props.layout.department}
                                    valueKey="departmentCode"
                                    value={this.state.formValues['departmentCode']}
                                    valueDesc={this.state.formValues['departmentDesc']}
                                    descKey="departmentDesc"
                                    updateProperty={this.updateFormValues}
                                />

                                <EAMDatePicker
                                    elementInfo={this.props.layout.datework}
                                    valueKey="dateWorked"
                                    value={this.state.formValues['dateWorked']}
                                    updateProperty={this.updateFormValues}
                                />


                                <EAMSelect
                                    elementInfo={this.props.layout.octype}
                                    valueKey="typeOfHours"
                                    value={this.state.formValues['typeOfHours'] || ''}
                                    values={this.state.typesOfHour}
                                    updateProperty={this.updateFormValues}
                                />

                                <EAMInput
                                    elementInfo={this.props.layout.hrswork}
                                    valueKey="hoursWorked"
                                    value={this.state.formValues['hoursWorked']}
                                    updateProperty={this.updateFormValues}
                                />
                            </BlockUi>
                        </div>
                    </DialogContent>

                    <DialogActions>
                        <div>
                            <BlockUi tag="div" blocking={this.state.loading}>
                                <Button onClick={this.handleClose} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={this.handleSave} color="primary">
                                    Save
                                </Button>
                            </BlockUi>
                        </div>
                    </DialogActions>

                </Dialog>
            </div>
        )
    }
}