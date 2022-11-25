import React, {useEffect, useState} from 'react';
import WSWorkorders from "../../../../tools/WSWorkorders";
import Activity from "./Activity";
import './Activities.css';
import Button from '@mui/material/Button';
import AddActivityDialogContainer from "./dialogs/AddActivityDialogContainer";
import AddBookLabourDialogContainer from "./dialogs/AddBookLabourDialogContainer";

/**
 * Panel Activities and Book labor
 */
function Activities(props) {
    let [activities, setActivities] = useState([]);
    let [bookLaboursByActivity, setBookLaboursByActivity] = useState({});
    let [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    let [isBookLaborModalOpen, setIsBookLaborModalOpen] = useState(false);
    let [loading, setLoading] = useState(false);

    useEffect(() => {
        readActivities(props.workorder);
        readBookLabours(props.workorder);
    }, [props.workorder])

    /**
     * Load all activities
     * @param workOrderNumber
     */
    let readActivities = workOrderNumber => {
        setLoading(true)
        WSWorkorders.getWorkOrderActivities(workOrderNumber)
            .then(result => {
                setActivities(result.body.data);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                console.error(error);
            });
    }

    /**
     * Load all book labours
     * @param workOrderNumber
     */
    let readBookLabours = workOrderNumber => {
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

                setBookLaboursByActivity(bookLaboursByActivity);
            })
            .catch(console.error);
    }

    if (loading || !props.workorder) {
        return (
            <div></div>
        );
    }

    return (
        <div id="activities">
            {activities.map((activity, index) => {
                return <Activity
                    key={activity.activityCode}
                    activity={activity}
                    bookLabours={bookLaboursByActivity[activity.activityCode]}
                    layout={props.layout}
                    postAddActivityHandler={props.postAddActivityHandler}
                    readActivities={() => readActivities(props.workorder)}/>
            })}

            <div id="actions">
                <Button onClick={() => setIsActivityModalOpen(true)} color="primary" disabled={props.disabled}>
                    Add activity
                </Button>

                <Button onClick={() => setIsBookLaborModalOpen(true)} color="primary" disabled={props.disabled}>
                    Book Labor
                </Button>
            </div>

            <AddActivityDialogContainer
                open={isActivityModalOpen}
                workorderNumber={props.workorder}
                onChange={() => readActivities(props.workorder)}
                onClose={() => setIsActivityModalOpen(false)}
                postAddActivityHandler={props.postAddActivityHandler}
                newActivityCode={activities[activities.length - 1] ? parseInt(activities[activities.length - 1].activityCode) + 5 : 5}
                showError={props.showError}
            />

            <AddBookLabourDialogContainer
                open={isBookLaborModalOpen}
                activities={activities}
                workorderNumber={props.workorder}
                department={props.department}
                departmentDesc={props.departmentDesc}
                defaultEmployee={props.defaultEmployee}
                defaultEmployeeDesc={props.defaultEmployeeDesc}
                updateCount={props.updateCount}
                updateEntityProperty={props.updateEntityProperty}
                startDate={props.startDate}
                onChange={() => readBookLabours(props.workorder)}
                onClose={() => setIsBookLaborModalOpen(false)}/>
        </div>
    )
}

export default React.memo(Activities);