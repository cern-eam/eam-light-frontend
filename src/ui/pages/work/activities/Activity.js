import React, { useState } from 'react';
import BookLabours from "./BookLabours";
import { Grid, IconButton, Divider, Avatar, Typography, Card, Stack } from '@mui/material';
import { formatDate } from 'ui/pages/EntityTools';
import AddActivityDialogContainer from './dialogs/AddActivityDialogContainer';
import { CalendarStart } from 'mdi-material-ui';
import { Edit, Groups } from '@mui/icons-material';
import './Activity.css'

/**
 * Display detail of an activity
 */
function Activity(props) {

    let { activity, bookLabours, layout, readActivities, postAddActivityHandler } = props;

    const [isEditModalOpen, setIsEditModalOpen] = useState();

    const totalHours = bookLabours?.map(({ hoursWorked }) => hoursWorked)
        .map(Number)
        .reduce((a, b) => a + b, 0) ?? 0

    const tradeString = activity.tradeCode === '*' ? '' : ` - ${activity.tradeCode}`


    return (
        <>
            <Card className="activity" variant="outlined" // variant="outlined" to remove the shadow
            >
                <Grid className="content" container direction="column">
                    <Grid className="activityHeader" item container spacing={1}>
                        <Grid item direction="row" container justifyContent="space-between" flexWrap="nowrap">
                            <Grid item container direction="row" alignItems='center'>
                                <Typography variant="subtitle1" className="activityTitle">
                                {activity.activityCode}{tradeString}
                                </Typography>
                            </Grid>
                            <IconButton variant="contained" color='primary' onClick={() => setIsEditModalOpen(true)}>
                                <Edit />
                            </IconButton>
                        </Grid>
                        {activity.activityNote &&
                            <Grid item>
                                <Typography variant="subtitle2" color="gray" sx={{
                                    wordBreak: 'break-all',
                                }}>
                                    {activity.activityNote}
                                </Typography>
                            </Grid>}
                    </Grid>
                    <Stack
                        className="activityDetails"
                        item
                        container
                        spacing={1}
                        direction="row"
                        justifyContent="space-between"
                        flexWrap="wrap"
                    >
                        <Grid item xs={5} sm={2} md={5} lg={2} container className='activityDetailsTile'>
                            <Typography variant='caption' color='gray'>
                                {layout.ACT.fields.task.text}
                            </Typography>
                            <Typography>
                                {activity.taskCode ? activity.taskCode : '—'}
                            </Typography>
                        </Grid>

                        <Grid item xs={5} sm={2} md={5} lg={2} container className='activityDetailsTile'>
                            <Typography variant='caption' color='gray'>
                                {layout.ACT.fields.matlcode.text}
                            </Typography>
                            <Typography>
                                {activity.materialList ? activity.materialList : '—'}
                            </Typography>
                        </Grid>

                        <Grid item xs={5} sm={2} md={5} lg={2} container className='activityDetailsTile'>
                            <Typography variant='caption' color='gray'>
                                {/* {layout.ACT.fields.personsreq.text} */}
                                {<Groups />}
                            </Typography>
                            <Typography>
                                {activity.peopleRequired}
                            </Typography>
                        </Grid>

                        <Grid item xs={5} sm={2} md={5} lg={2} container className='activityDetailsTile'>
                            <Typography variant='caption' color='gray' sx={{ textAlign: 'center' }}>
                                {layout.BOO.fields.hrswork.text}<br />
                                <span className='estmtd'>
                                    (Estimated)
                                </span>
                            </Typography>
                            <Typography>
                                {totalHours} <span className='estmtd'>({activity.estimatedHours})</span>
                            </Typography>
                        </Grid>

                        <Grid item xs={5} sm={2} md={5} lg={2} container className='activityDetailsTile'>
                            <Typography variant='caption' color='gray'>
                                {/* {layout.ACT.fields.actstartdate.text} */}
                                {<CalendarStart />}
                            </Typography>
                            <Typography>
                                {formatDate(activity.startDate)}
                            </Typography>
                        </Grid>

                    </Stack>

                    {bookLabours && bookLabours.length > 0 &&
                        <BookLabours
                            bookLabours={bookLabours}
                            layout={layout.BOO.fields} />}

                </Grid>
            </Card>

            <Divider />

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