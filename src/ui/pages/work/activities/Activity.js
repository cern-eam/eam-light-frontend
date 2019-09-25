import React, {Component} from 'react';
import BookLabours from "./BookLabours";
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import './Activity.css'

/**
 * Display detail of an activity
 */
export default class Activity extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isActivityModalOpen: true,
      isBookLaborModalOpen: false
    };
  }


  render() {
    const layout = this.props.layout.ACT;

    return (
      <div className="activity" >
        <div className="content">

          <h3>Activity {this.props.activity.activityCode}</h3>

          <Grid container spacing={8} className="activityDetails">

            <Grid item xs={6} md={6} lg={2}>{layout.task.text}</Grid>
            <Grid item xs={6} md={6} lg={4}>{this.props.activity.taskCode}</Grid>

            <Grid item xs={6} md={6} lg={2}>{layout.matlcode.text}</Grid>
            <Grid item xs={6} md={6} lg={4}>{this.props.activity.materialList}</Grid>

            <Grid item xs={6} md={6} lg={2}>{layout.esthrs.text}</Grid>
            <Grid item xs={6} md={6} lg={4}>{this.props.activity.estimatedHours}</Grid>

            <Grid item xs={6} md={6} lg={2}>{layout.personsreq.text}</Grid>
            <Grid item xs={6} md={6} lg={4}>{this.props.activity.peopleRequired}</Grid>

            <Grid item xs={6} md={6} lg={2}>{layout.actstartdate.text}</Grid>
            <Grid item xs={6} md={6} lg={4}>{this.props.activity.startDate}</Grid>

          </Grid>

          {this.props.bookLabours && this.props.bookLabours.length > 0 &&
            <BookLabours
                bookLabours={this.props.bookLabours}
                layout={this.props.layout.BOO} />
          }

        </div>

        <Divider className="divider"/>

      </div>
    )
  }
}