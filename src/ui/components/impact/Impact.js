import React, {Component} from 'react';
import WSImpact from '../../../tools/WSImpact';
import EISPanel from 'eam-components/dist/ui/components/panel';
import EAMInputMUI from 'eam-components/dist/ui/components/inputs/EAMInput';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import EISTable from 'eam-components/dist/ui/components/table';
import EAMLinkInput from "eam-components/dist/ui/components/inputs/EAMLinkInput";
import ImpactActCreation from "./ImpactActCreation";
import ImpactActGrid from "./ImpactActGrid";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import BlockUi from 'react-block-ui';
import ImpactAdditionalWorkorderContainer from "./ImpactAdditionalWorkorderContainer";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {withStyles} from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import {format} from 'date-fns'

const styles = () => ({
    paperWidthSm: {
        width: "700px"
    },
    appBar: {
        backgroundColor: grey[200]
    },
    appBarRoot: {
        boxShadow: 'inherit'
    }
});

class Impact extends Component {

    headers = ['Work Order', 'Description', 'Equipment', 'Location', 'Facility'];
    propCodes = ['number', 'desc', 'equipment', 'location', 'facility'];

    //
    //
    //
    constructor(props) {
        super(props);

        this.state = {
            woClosedWithoutActivity: false,
            error: false,
            errorMessage: '',
            woInfo: {},
            additionalWorkorders: {},
            currentActivity: null,
            activityWorkorders: [],
            activityCreationVisible: false,
            activityGridVisible: false,
            additionalWorkorderVisible: false,
            detachActivityConfirmationDialogVisible: false,
            loading: false,
            loaded: false,
            data: null,
        };
    }

    componentDidMount() {
        this.loadData();
    }

    updateProperty = (key, value) => {
        this.setState(() => ({
            [key]: value
        }));
    };

    loadData() {
        WSImpact.getData(this.props.workorderNumber).then(response => {
            this.setState({data: response.body.data});
            this.loadWOInfo();
        })
    }

    loadWOInfo = () => {
        this.setState(() => ({loading: true}), () => {
            WSImpact.getWorkorderInfo(this.props.workorderNumber).then(response => {
                const data = response.body.data;

                this.setState({
                    woClosedWithoutActivity: !data.impactActivityId && data.status === 'C',
                    woInfo: data
                }, () => {
                    this.loadActivitiesInfo();
                });
            }, error => {
                this.props.handleError(error);
                this.setState(() => ({loading: false}));
            });
        });
    };

    loadActivitiesInfo = () => {
        const data = this.state.woInfo;
        if (data.impactActivityId) {
            Promise.all([WSImpact.getWorkorderInfosWithSameActivity(data.impactActivityId), WSImpact.getImpactActivity(data.impactActivityId)]).then(response => {
                const wos = response[0].body.data;

                let activityWorkorders = [];
                wos.forEach(wo => activityWorkorders.push({
                    number: wo.workordernumber,
                    desc: wo.description,
                    equipment: wo.equipment,
                    location: wo.location,
                    facility: wo.facilityName
                }));

                const impactActivity = response[1].body.data;
                const impactActivityProperties = impactActivity.propertiesMap;

                this.setState({
                    currentActivity: {
                        id: impactActivity.activityId,
                        title: impactActivityProperties.title,
                        schedulingStart: impactActivityProperties.scheduledStartDate ? format(impactActivityProperties.scheduledStartDate, "dd-MMM-yyyy") : '',
                        schedulingEnd: impactActivityProperties.scheduledEndDate ? format(impactActivityProperties.scheduledEndDate, "dd-MMM-yyyy") : '',
                        facility: impactActivityProperties.facility.label,
                        responsible: impactActivityProperties.creator.fullName,
                        status: impactActivityProperties.status.label
                    },
                    activityWorkorders: activityWorkorders,
                    loading: false,
                    loaded: true
                });

            }, error => {
                const errorCode = (error && error.response && error.response.body && error.response.body.errors[0]) ? error.response.body.errors[0].code : 'ERROR';
                let errorMessage = error ? error.type : 'ERROR';
                switch (errorCode) {
                    case "404":
                        errorMessage = `Activity ${data.impactActivityId} not found`;
                        this.props.showError(errorMessage);
                        break;
                }
                this.setState(() => ({
                    error: true,
                    errorMessage: errorMessage,
                    loading: false,
                    loaded: true
                }));
            });
        } else {
            this.setState(() => ({
                loading: false,
                loaded: true
            }));
        }
    };

    unlinkActivity = () => {
        this.setState(() => ({loading: true}), () => {
            this.setDetachActivityConfirmationDialogVisible(false);
            WSImpact.unlinkWorkorder(this.state.woInfo.workordernumber).then(response => {
                this.setState(() => ({currentActivity: null, loading: false}), () => {
                    this.loadWOInfo();
                });
            }, error => {
                this.props.handleError(error);
                this.setState(() => ({loading: false}));
            });
        });
    };

    selectAdditionalWorkorders = workorders => {
        this.setState({
            additionalWorkorders: workorders
        });
    };

    attachToExistingActivity = activityId => {
        this.setState({loading: true, loaded: false}, () => {
            WSImpact.linkWorkorderToImpactActivity(this.state.woInfo.workordernumber, activityId).then(response => {
                this.loadWOInfo();
                this.setActivityGridVisibility(false);
                this.setState({loading: false});
            }, error => {
                this.props.handleError(error);
                this.setState(() => ({loading: false}));
            });
        });
    };

    addAdditionalWorkorders = () => {
        this.setState({
            loading: true
        });

        let workorders = [];
        Object.keys(this.state.additionalWorkorders).forEach(e => {
            const workorder = this.state.additionalWorkorders[e];
            Object.keys(workorder.cell).some(w => {
                const cell = workorder.cell[w];
                if (cell.t === 'workordernum') {
                    workorders.push(cell.value);
                    return true;
                }
                return false;
            });
        });

        WSImpact.linkWorkordersToImpactActivity(this.state.currentActivity.id, workorders).then(response => {
            this.setAdditionalWorkorderVisibility(false);
            this.loadWOInfo();
            this.setState({loading: false, additionalWorkorders: {}});
        }, error => {
            this.setState({loading: false});
            this.props.handleError(error);
        });
    };

    //
    // VISIBILITY SETTERS FOR DIALOGS
    //
    setActivityCreationVisibility = (visible) => {
        this.setState({
            activityCreationVisible: visible
        })
    };

    setDetachActivityConfirmationDialogVisible = (visible) => {
        this.setState({
            detachActivityConfirmationDialogVisible: visible
        });
    };

    setActivityGridVisibility = (visible) => {
        this.setState({
            activityGridVisible: visible
        })
    };

    setAdditionalWorkorderVisibility = (visible) => {
        this.setState({
            additionalWorkorderVisible: visible
        })
    };

    //
    // RENDERS
    //
    renderCreationMode() {
        const {classes} = this.props;
        return (
            <div>
                <Grid container spacing={1}>
                    <Grid item sm={12} xs={12}>
                        <EISPanel heading="IMPACT Activity">
                            <Button color="primary" onClick={() => this.setActivityCreationVisibility(true)}
                                    disabled={this.state.loading}
                            >
                                Create new IMPACT Activity
                            </Button>
                            <Button color="primary" onClick={() => this.setActivityGridVisibility(true)}
                                    disabled={this.state.loading}
                            >
                                Attach to existing IMPACT Activity
                            </Button>
                        </EISPanel>
                    </Grid>
                </Grid>
                <Dialog onClose={() => this.setActivityCreationVisibility(false)}
                        open={this.state.activityCreationVisible}
                        classes={{
                            paperWidthSm: classes.paperWidthSm
                        }}
                >
                    <DialogTitle id="simple-dialog-title">Create new IMPACT Activity</DialogTitle>
                    <ImpactActCreation woInfo={this.state.woInfo}
                                       closeDialog={() => this.setActivityCreationVisibility(false)}
                                       loadWOInfo={this.loadWOInfo}
                                       handleError={this.props.handleError}
                                       showError={this.props.showError}
                    />
                </Dialog>
                <Dialog fullScreen onClose={() => this.setActivityGridVisibility(false)}
                        open={this.state.activityGridVisible}>
                    <BlockUi tag="div" blocking={this.state.loading} style={{height: "100%", width: "100%"}}>
                        <AppBar classes={{
                            colorPrimary: classes.appBar,
                            root: classes.appBarRoot
                        }}>
                            <Toolbar>
                                <Button color="secondary" variant="contained"
                                        style={{marginRight:10}}
                                        onClick={() => this.setActivityGridVisibility(false)}>
                                    CLOSE
                                </Button>
                            </Toolbar>
                        </AppBar>
                        <ImpactActGrid attachToExistingActivity={this.attachToExistingActivity} data={this.state.data}/>
                    </BlockUi>
                </Dialog>
            </div>
        )
    }

    renderError() {
        return (
            <div style={{padding: 10, backgroundColor: 'pink', color: 'red'}}>{this.state.errorMessage}</div>
        )
    };

    renderWOClosed() {
        return (
            <div style={{
                padding: 10,
                backgroundColor: 'pink',
                color: 'red'
            }}>{`Workorder ${this.state.woInfo.workordernumber} is not linked to any IMPACT activity, it is closed and can't be updated anymore.`}</div>
        )
    };

    renderA() {
        const {classes} = this.props;
        return (
            <div>
                <Grid container spacing={1}>
                    <Grid item sm={12} xs={12}>

                        <EISPanel heading="IMPACT Activity">
                            <div style={{width: "100%", marginTop: 0}}>
                                <div style={{display: "flex", flexWrap: "wrap"}}>
                                    <div style={{width: "calc(50% - 5px)", marginRight: 5}}>
                                        <EAMLinkInput value={this.state.currentActivity.id}
                                                      isExternalLink={true}
                                                      link={`https://impact.cern.ch/impact/secure/?place=editActivity:`}
                                                      top={15}>
                                            <EAMInputMUI label="Activity ID"
                                                         disabled
                                                         margin="dense"
                                                         value={this.state.currentActivity.id}
                                                         updateProperty={this.updateProperty}
                                                         valueKey="title"
                                            />
                                        </EAMLinkInput>
                                    </div>
                                    <div style={{width: "50%"}}>
                                        <EAMInputMUI label="Status"
                                                     disabled
                                                     margin="dense"
                                                     value={this.state.currentActivity.status}
                                                     updateProperty={this.updateProperty}
                                                     valueKey="title"
                                        />
                                    </div>
                                    <div style={{width: "100%"}}>
                                        <EAMInputMUI label="Title"
                                                     disabled
                                                     margin="dense"
                                                     value={this.state.currentActivity.title}
                                                     updateProperty={this.updateProperty}
                                                     valueKey="title"
                                        />
                                    </div>
                                    <div style={{width: "calc(50% - 5px)", marginRight: 5}}>
                                        <EAMInputMUI label="Facility"
                                                     disabled
                                                     margin="dense"
                                                     value={this.state.currentActivity.facility}
                                                     updateProperty={this.updateProperty}
                                                     valueKey="title"
                                        />
                                    </div>
                                    <div style={{width: "50%"}}>
                                        <EAMInputMUI label="Responsible"
                                                     disabled
                                                     margin="dense"
                                                     value={this.state.currentActivity.responsible}
                                                     updateProperty={this.updateProperty}
                                                     valueKey="title"
                                        />
                                    </div>
                                    <div style={{width: "calc(50% - 5px)", marginRight: 5}}>
                                        <EAMInputMUI label="Scheduling Start Date"
                                                     disabled
                                                     margin="dense"
                                                     value={this.state.currentActivity.schedulingStart}
                                                     updateProperty={this.updateProperty}
                                                     valueKey="activityType"
                                        />
                                    </div>
                                    <div style={{width: "50%"}}>
                                        <EAMInputMUI label="Scheduling End Date"
                                                     disabled
                                                     margin="dense"
                                                     value={this.state.currentActivity.schedulingEnd}
                                                     updateProperty={this.updateProperty}
                                                     valueKey="activityType"
                                        />
                                    </div>
                                </div>
                                <Button color="primary"
                                        onClick={() => this.setDetachActivityConfirmationDialogVisible(true)}>
                                    Detach IMPACT Activity from WO
                                </Button>
                            </div>
                        </EISPanel>

                        <EISPanel heading="Other Work Orders for the same IMPACT Activity">
                            <div style={{width: "100%", marginTop: 0}}>
                                <EISTable
                                    data={this.state.activityWorkorders}
                                    headers={this.headers}
                                    propCodes={this.propCodes}
                                />
                                <Button color="primary" onClick={() => this.setAdditionalWorkorderVisibility(true)}>
                                    Add Additional Work Order
                                </Button>
                            </div>
                        </EISPanel>
                    </Grid>
                </Grid>
                <Dialog onClose={() => this.setDetachActivityConfirmationDialogVisible(false)}
                        open={this.state.detachActivityConfirmationDialogVisible}>
                    <DialogTitle id="simple-dialog-title">Detach Activity from this Workorder</DialogTitle>
                    <Button style={{padding: '30px'}} color="primary" onClick={this.unlinkActivity}>
                        Detach
                    </Button>
                </Dialog>
                <Dialog fullScreen onClose={() => this.setAdditionalWorkorderVisibility(false)}
                        open={this.state.additionalWorkorderVisible}>
                    <BlockUi tag="div" blocking={this.state.loading} style={{height: "100%", width: "100%"}}>
                        <AppBar classes={{
                            colorPrimary: classes.appBar,
                            root: classes.appBarRoot
                        }}>
                            <Toolbar>
                                <Button color="secondary" variant="contained"
                                        style={{marginRight:10}}
                                        onClick={() => this.setAdditionalWorkorderVisibility(false)}>
                                    Close
                                </Button>
                                <Button color="secondary" variant="contained" disabled={this.state.loading}
                                        onClick={this.addAdditionalWorkorders}>
                                    Add Selected Workorder(s)
                                </Button>
                            </Toolbar>
                        </AppBar>
                        <ImpactAdditionalWorkorderContainer
                            selectAdditionalWorkorders={this.selectAdditionalWorkorders}/>
                    </BlockUi>
                </Dialog>
            </div>
        )
    }

    render() {
        return (
            <div style={{margin: 5, padding: 20, height: "100%", overflowY: "scroll"}}>
                <BlockUi tag="div" blocking={this.state.loading}>
                    {
                        this.state.loaded && this.state.woClosedWithoutActivity && this.renderWOClosed()
                    }
                    {
                        this.state.loaded && !this.state.woClosedWithoutActivity && this.state.error && this.renderError()
                    }
                    {
                        this.state.loaded && !this.state.woClosedWithoutActivity && !this.state.error && (
                            this.state.currentActivity ? this.renderA() : this.renderCreationMode()
                        )
                    }
                </BlockUi>
            </div>
        )
    }

}

export default withStyles(styles)(Impact);