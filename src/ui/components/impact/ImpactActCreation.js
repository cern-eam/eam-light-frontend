import React, {Component} from 'react';
import WSImpact from '../../../tools/WSImpact';
import EAMInputMUI from 'eam-components/dist/ui/components/inputs/EAMInput';
import EAMDatePickerMUI from 'eam-components/dist/ui/components/inputs/EAMDatePicker';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import BlockUi from 'react-block-ui';
import EAMSelectMUI from 'eam-components/dist/ui/components/inputs/EAMSelect';

class ImpactActCreation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            facilities: [],
            facility: {},
            activity: {
                title: this.props.woInfo.description,
                activityTypeName: 'Maintenance',
                activityType: '312', //Maintenance
                description: '',
                facility: '',
                facilityName: '',
                location: this.props.woInfo.location,//'7437',
                aisLocation: '',
                modusOperandi: '',
                proposedInterventionPeriod: '',
                proposedStartDate: '',
                earliestStartDate: '',
                scheduledStartDate: '',
                scheduledEndDate: '',
                latestEndDate: '',
                duration: '',
                workorderNumber: this.props.woInfo.workordernumber
            },
            layout: {
                latestEndDate:"H",
                scheduledEndDate:"H",
                scheduledStartDate:"H",
                duration:"H",
                proposedDate:"H",
                earliestStartDate:"H",
                interventionPeriod:"H",
                proposedInterventionPeriod:"H"
            },
            loading: false
        };
    }

    populateFacility = facility => {
        const data = this.props.woInfo;
        this.setState((prevState) => ({
            facility: facility,
            loading: true,
            activity: {
                ...prevState.activity,
                facility: facility.facilityImpactId,
                facilityName: facility.facName,
                aisLocation: facility.aisLocId
            }
        }), () => {
            WSImpact.getLayoutInfo(this.state.activity.facility, this.state.activity.activityType).then(response => {
                let layout = response.body.data.propertiesMap;
                let duration = this.calculateDuration(layout);
                this.setState((prevState) => ({
                    layout,
                    loading:false,
                    activity: {
                        ...prevState.activity,
                        proposedStartDate: layout.proposedDate !== 'H' && data.evtTarget ?  data.evtTarget : '',
                        latestEndDate: layout.latestEndDate !== 'H' && data.evtSchedEnd ? data.evtSchedEnd : '',
                        earliestStartDate: layout.earliestStartDate !== 'H' && data.evtTarget ? data.evtTarget : '',
                        scheduledStartDate: layout.proposedDate === 'H' && layout.scheduledStartDate !== 'H' && data.evtTarget ?  data.evtTarget : '',
                        scheduledEndDate: layout.proposedDate === 'H' && layout.scheduledEndDate !== 'H' && data.evtSchedEnd ?  data.evtSchedEnd : '',
                        duration: duration ? duration : ''
                    }
                }));
            }, error => {
                this.props.showError(`Error loading Impact layout for facility ${this.state.activity.facility} and type ${this.state.activity.activityType}`);
                this.setState(() => ({loading:false}));
            })
        });
    };

    componentDidMount() {
        this.setState(() => ({loading:true}), () => {
            const data = this.props.woInfo;
            WSImpact.getImpactFacilities(data.location).then(response => {
                let facilities = response.body.data;
                this.setState(prevState => ({
                    facilities: facilities
                }), () => {
                    if (facilities.length === 0) {
                        this.props.showError('No Facilities found for location '+data.location);
                        this.setState(() => ({loading:false}));
                    } else {
                        this.populateFacility(facilities[0]);
                    }
                });
            });
        });
    }

    updateProperty = (key, value) => {
        this.setState((prevState) => ({
            activity: {
                ...prevState.activity,
                [key]: value
            }
        }));
    };

    updateFacility = (key, value) => {
        const facility = this.state.facilities.filter(f => f.facilityImpactId === value)[0];
        this.populateFacility(facility);
    };

    calculateDuration = (layout) => {
      const data = this.props.woInfo;
      if (layout.duration !== 'H') {
          if (data.evtTarget && data.evtSchedEnd) {
              let evtTarget = new Date(data.evtTarget);
              let evtSchedEnd = new Date(data.evtSchedEnd);
              let differenceInDays = Math.floor((evtSchedEnd-evtTarget)/(1000 * 60 * 60 * 24));
              return differenceInDays;
          }
      }
      return undefined;
    };

    createActivity = () => {
        this.setState(() => ({loading: true}), () => {
            WSImpact.createImpactActivity(this.state.activity).then(response => {
                this.props.loadWOInfo();
                this.props.closeDialog();
                this.setState(() => ({loading:false}));
            }, error => {
                const errMessage = (error && error.response && error.response.body && error.response.body.message) ? error.response.body.message : undefined;
                if (errMessage) {
                    this.props.showError(errMessage);
                } else {
                    this.props.handleError(error);
                }
                this.setState(() => ({loading:false}));
            });
        });
    };

    render() {
        const { activity, layout, facilities } = this.state;
        const facilitiesList = facilities ? facilities.map(f => { return {code:f.facilityImpactId, desc:f.facName} }) : [];
        const numberOfFacilities = facilitiesList.length;

        return (
            <div style={{margin: 15}}>
                <BlockUi tag="div" blocking={this.state.loading} style={{height: "100%", width: "100%"}}>
                    <Grid container spacing={1}>
                        <Grid item sm={12} xs={12}>
                            <EAMInputMUI label="Title"
                                         value={activity.title}
                                         updateProperty={this.updateProperty}
                                         valueKey="title"
                                         disabled={layout.title === 'H'}
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <EAMInputMUI label="Description"
                                         value={activity.description}
                                         updateProperty={this.updateProperty}
                                         valueKey="description"
                                         multiline={true}
                            />
                        </Grid>
                        <Grid item sm={12} xs={12}>
                            <EAMSelectMUI
                                style={{paddingTop:5,marginBottom:5}}
                                label="Facility"
                                valueKey="facility"
                                value={activity.facility}
                                updateProperty={this.updateFacility}
                                values={facilitiesList}
                                disabled={numberOfFacilities === 1}
                            />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <EAMInputMUI label="Location"
                                         value={activity.location}
                                         updateProperty={this.updateProperty}
                                         valueKey="location"
                                         disabled={true}
                            />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <EAMInputMUI label="Activity Type"
                                         value={activity.activityTypeName}
                                         updateProperty={this.updateProperty}
                                         valueKey="activityTypeName"
                                         disabled={true}
                            />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <EAMInputMUI label="Modus Operandi"
                                         value={this.state.activity.modusOperandi}
                                         updateProperty={this.updateProperty}
                                         valueKey="modusOperandi"
                                         multiline={true}
                            />
                        </Grid>
                        {/*
                        {layout.proposedInterventionPeriod !== 'H' &&
                        <Grid item sm={6} xs={12}>
                            <EAMInputMUI label="Intervention Period"
                                         value={this.state.activity.proposedInterventionPeriod}
                                         updateProperty={this.updateProperty}
                                         valueKey="proposedInterventionPeriod"
                                         disabled={layout.proposedInterventionPeriod === 'H'}
                            />
                        </Grid>
                        }
                        */}
                        {layout.proposedDate !== 'H' &&
                        <Grid item sm={6} xs={12}>
                            <EAMDatePickerMUI label="Proposed Start Date"
                                              value={this.state.activity.proposedStartDate}
                                              updateProperty={this.updateProperty}
                                              valueKey="proposedStartDate"
                                              disabled={layout.proposedDate === 'H'}
                            />
                        </Grid>
                        }
                        { layout.scheduledStartDate !== 'H' &&
                        <Grid item sm={6} xs={12}>
                            <EAMDatePickerMUI label="Scheduled Start Date"
                                              value={this.state.activity.scheduledStartDate}
                                              updateProperty={this.updateProperty}
                                              valueKey="scheduledStartDate"
                                              disabled={layout.scheduledStartDate === 'H'}
                            />
                        </Grid>
                        }
                        { layout.scheduledEndDate !== 'H' &&
                        <Grid item sm={6} xs={12}>
                            <EAMDatePickerMUI label="Scheduled End Date"
                                              value={this.state.activity.scheduledEndDate}
                                              updateProperty={this.updateProperty}
                                              valueKey="scheduledEndDate"
                                              disabled={layout.scheduledEndDate === 'H'}
                            />
                        </Grid>
                        }
                        {layout.earliestStartDate !== 'H' &&
                        <Grid item sm={6} xs={12}>
                            <EAMDatePickerMUI label="Earliest Start Date"
                                              value={this.state.activity.earliestStartDate}
                                              updateProperty={this.updateProperty}
                                              valueKey="earliestStartDate"
                                              disabled={layout.earliestStartDate === 'H'}
                            />
                        </Grid>
                        }
                        {layout.latestEndDate !== 'H' &&
                        <Grid item sm={6} xs={12}>
                            <EAMDatePickerMUI label="Latest End Date"
                                              value={this.state.activity.latestEndDate}
                                              updateProperty={this.updateProperty}
                                              valueKey="latestEndDate"
                                              disabled={layout.latestEndDate === 'H'}
                            />
                        </Grid>
                        }
                        {layout.duration !== 'H' &&
                        <Grid item sm={6} xs={12}>
                            <EAMInputMUI label="Duration (days)"
                                         value={this.state.activity.duration}
                                         updateProperty={this.updateProperty}
                                         valueKey="duration"
                                         disabled={layout.duration === 'H'}
                            />
                        </Grid>
                        }
                    </Grid>
                    <div style={{paddingTop:20, display:'flex', justifyContent: 'flex-end'}}>
                        <Button color="primary" onClick={this.createActivity}>
                            Create Activity
                        </Button>
                    </div>
                </BlockUi>
            </div>
        )
    }

}

export default ImpactActCreation;