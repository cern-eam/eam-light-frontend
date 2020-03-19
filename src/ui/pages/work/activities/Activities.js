import React, {Component} from 'react';
import WSWorkorders from "../../../../tools/WSWorkorders";
import Activity from "./Activity";
import './Activities.css';
import Button from '@material-ui/core/Button';
import EISPanel from 'eam-components/dist/ui/components/panel';
import AddActivityDialogContainer from "./dialogs/AddActivityDialogContainer";
import AddBookLabourDialogContainer from "./dialogs/AddBookLabourDialogContainer";

/**
 * Panel Activities and Book labor
 */
export default class Activities extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            bookLaboursByActivity: {},
            isActivityModalOpen: false,
            isBookLaborModalOpen: false,
            isLoading: false
        }
    }

    componentDidMount() {
        this.readActivities(this.props.workorder);
        this.readBookLabours(this.props.workorder);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.workorder !== this.props.workorder) {
            this.readActivities(nextProps.workorder);
            this.readBookLabours(nextProps.workorder);
        }
    }

    /**
     * Load all activities
     * @param workOrderNumber
     */
    readActivities(workOrderNumber) {
        this.setState(() => ({
            isLoading: true
        }));

        WSWorkorders.getWorkOrderActivities(workOrderNumber)
            .then(result => {
                this.setState({
                    activities: result.body.data,
                    isLoading: false
                })
            });
    }

    /**
     * Load all book labours
     * @param workOrderNumber
     */
    readBookLabours(workOrderNumber) {
        WSWorkorders.getBookingLabours(workOrderNumber)
            .then(result => {

                // Creation of a "map" to store book labours by activity
                let bookLaboursByActivity = {};
                result.body.data.forEach(bookLabour => {
                    if (bookLaboursByActivity[bookLabour.activityCode] === undefined) {
                        bookLaboursByActivity[bookLabour.activityCode] = [];
                    }
                    bookLaboursByActivity[bookLabour.activityCode].push(bookLabour);
                });

                this.setState({
                    bookLaboursByActivity
                })
            });
    }

    handleOpenActivityModal = () => {
        this.setState({isActivityModalOpen: true});
    };

    handleOpenBookLaborModal = () => {
        this.setState({isBookLaborModalOpen: true});
    };

    handleCloseActivityModal = () => {
        this.setState({isActivityModalOpen: false});
    };

    handleCloseBookLaborModal = () => {
        this.setState({isBookLaborModalOpen: false});
    };

    render() {

        if (this.state.isLoading) {
            return (
                <div></div>
            );
        }

        return (
            <EISPanel heading="ACTIVITIES AND BOOKED LABOR">
                <div id="activities">
                    {this.state.activities.map((activity, index) => {
                        return <Activity
                            key={activity.activityCode}
                            activity={activity}
                            bookLabours={this.state.bookLaboursByActivity[activity.activityCode]}
                            layout={this.props.layout}/>
                    })}

                    <div id="actions">
                        <Button onClick={this.handleOpenActivityModal} color="primary">
                            Add activity
                        </Button>

                        <Button onClick={this.handleOpenBookLaborModal} color="primary">
                            Book Labor
                        </Button>
                    </div>

                    <AddActivityDialogContainer
                        open={this.state.isActivityModalOpen}
                        workorderNumber={this.props.workorder}
                        onChange={() => this.readActivities(this.props.workorder)}
                        onClose={this.handleCloseActivityModal}
                        postAddActivityHandler={this.props.postAddActivityHandler}/>

                    <AddBookLabourDialogContainer
                        open={this.state.isBookLaborModalOpen}
                        activities={this.state.activities}
                        workorderNumber={this.props.workorder}
                        department={this.props.department}
                        departmentDesc={this.props.departmentDesc}
                        defaultEmployee={this.props.defaultEmployee}
                        defaultEmployeeDesc={this.props.defaultEmployeeDesc}
                        onChange={() => this.readBookLabours(this.props.workorder)}
                        onClose={this.handleCloseBookLaborModal}/>

                </div>

            </EISPanel>

        )
    }
}