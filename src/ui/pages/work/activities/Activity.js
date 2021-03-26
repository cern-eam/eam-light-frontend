import React from 'react';
import BookLabours from "./BookLabours";
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import './Activity.css'

/**
 * Display detail of an activity
 */
function Activity(props){

    let {activity, bookLabours, layout} = props;

    return (
      <div className="activity" >
        <div className="content">

          <h3>Activity {activity.activityCode}</h3>

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

            <Grid item xs={6} md={6} lg={2}>{layout.ACT.fields.actstartdate.text}</Grid>
            <Grid item xs={6} md={6} lg={4}>{activity.startDate}</Grid>

          </Grid>

          {bookLabours && bookLabours.length > 0 &&
            <BookLabours
                bookLabours={bookLabours}
                layout={layout.BOO.fields} />
          }

        </div>

        <Divider className="divider"/>

      </div>
    )

}

export default React.memo(Activity);