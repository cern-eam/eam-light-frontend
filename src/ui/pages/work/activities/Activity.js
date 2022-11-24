import React, { useState } from 'react';
import BookLabours from "./BookLabours";
import { Grid, Typography, IconButton, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import './Activity.css'
import { formatDate } from 'ui/pages/EntityTools';
import AddActivityDialogContainer from './dialogs/AddActivityDialogContainer';

const add = (a, b) => a + b

/**
 * Display detail of an activity
 */
function Activity(props) {

    let { activity, bookLabours, layout, readActivities, postAddActivityHandler } = props;

    const [isEditModalOpen, setIsEditModalOpen] = useState();

    const totalHours = bookLabours?.map(({ hoursWorked }) => hoursWorked)
        .map(Number)
        .reduce(add, 0) ?? 0

    const tradeString = activity.tradeCode === '*' ? '' : ` - Trade ${activity.tradeCode}`


    return (
        <>
            <div className="activity">
                <div className="content">
                    <Grid direction="row" container width="100%" justifyContent="space-between">
                        <Typography variant="h6">Activity {activity.activityCode}{tradeString}</Typography>
                        <IconButton variant="contained" color="primary" onClick={() => setIsEditModalOpen(true)}>
                            <EditIcon />
                        </IconButton>
                    </Grid>

                    <Grid container spacing={1} className="activityDetails">

                        <Grid item xs={6} md={6} lg={2}>{layout.ACT.fields.activitynote.text}</Grid>
                        <Grid item xs={6} md={6} lg={4}>{activity.activityNote}</Grid>

                        <Grid item xs={6} md={6} lg={2}>{layout.ACT.fields.task.text}</Grid>
                        <Grid item xs={6} md={6} lg={4}>{activity.taskCode}</Grid>

                        <Grid item xs={6} md={6} lg={2}>{layout.ACT.fields.matlcode.text}</Grid>
                        <Grid item xs={6} md={6} lg={4}>{activity.materialList}</Grid>

                        <Grid item xs={6} md={6} lg={2}>{layout.ACT.fields.esthrs.text}</Grid>
                        <Grid item xs={6} md={6} lg={4}>{activity.estimatedHours}</Grid>

                        <Grid item xs={6} md={6} lg={2}>{layout.ACT.fields.personsreq.text}</Grid>
                        <Grid item xs={6} md={6} lg={4}>{activity.peopleRequired}</Grid>

                        <Grid item xs={6} md={6} lg={2}>{layout.BOO.fields.hrswork.text}</Grid>
                        <Grid item xs={6} md={6} lg={4}>{totalHours}</Grid>

                        <Grid item xs={6} md={6} lg={2}></Grid>
                        <Grid item xs={6} md={6} lg={4}></Grid>

                        <Grid item xs={6} md={6} lg={2}>{layout.ACT.fields.actstartdate.text}</Grid>
                        <Grid item xs={6} md={6} lg={4}>{formatDate(activity.startDate)}</Grid>

                    </Grid>

                    {bookLabours && bookLabours.length > 0 &&
                        <BookLabours
                            bookLabours={bookLabours}
                            layout={layout.BOO.fields} />}

                </div>

                <Divider className="divider" />

            </div>

            <AddActivityDialogContainer
                open={isEditModalOpen}
                onChange={readActivities}
                onClose={() => setIsEditModalOpen(false)}
                postAddActivityHandler={postAddActivityHandler}
                activityToEdit={activity} />
        </>
    )

}

export default React.memo(Activity);