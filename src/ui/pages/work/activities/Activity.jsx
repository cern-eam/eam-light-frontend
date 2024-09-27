import React, { useState } from "react";
import WSWorkorders from "../../../../tools/WSWorkorders";
import BookLabours from "./BookLabours";
import {
  Grid,
  IconButton,
  Divider,
  Typography,
  Card,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { formatDate } from "@/ui/pages/EntityTools";
import AddActivityDialogContainer from "./dialogs/AddActivityDialogContainer";
import { CalendarStart } from "mdi-material-ui";
import {
  MoreVert,
  EditOutlined,
  DeleteOutline,
  Groups,
} from "@mui/icons-material";
import "./Activity.css";

/**
 * Display detail of an activity
 */
function Activity(props) {
  const {
    activity,
    bookLabours,
    layout,
    readActivities,
    postAddActivityHandler,
    handleError,
  } = props;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const totalHours =
    bookLabours
      ?.map(({ hoursWorked }) => hoursWorked)
      .map(Number)
      .reduce((a, b) => a + b, 0) ?? 0;

  const descriptionString = activity.activityNote
    ? ` - ${activity.activityNote}`
    : activity.tradeCode === "*"
    ? ""
    : ` - ${activity.tradeCode}`;

  const handleOptionsOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (params) => {
    handleOptionsClose();
    setIsEditModalOpen(true);
  };

  const handleDelete = async (params) => {
    handleOptionsClose();
    try {
      setLoading(true);
      await WSWorkorders.deleteWorkOrderActivity({ data: activity });
      readActivities();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const renderOptionsMenu = (params) => {
    return (
      <>
        <IconButton
          aria-label="more"
          id="options-button"
          aria-controls={open ? "options-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleOptionsOpen}
        >
          <MoreVert />
        </IconButton>
        <Menu
          id="options-menu"
          MenuListProps={{
            "aria-labelledby": "options-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleOptionsClose}
        >
          <MenuItem
            key="Edit"
            onClick={handleEdit}
            disabled={!layout.ACT.updateAllowed || loading}
          >
            <ListItemIcon>
              <EditOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem
            key="Delete"
            onClick={handleDelete}
            disabled={!layout.ACT.deleteAllowed || loading}
          >
            <ListItemIcon>
              <DeleteOutline fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </>
    );
  };

  return (
    <>
      <Card className="activity" variant="outlined">
        <Grid className="content" container direction="column">
          <Grid className="activityHeader" item container spacing={1}>
            <Grid
              item
              direction="row"
              container
              justifyContent="space-between"
              flexWrap="nowrap"
            >
              <Grid item container direction="row" alignItems="center">
                <Typography variant="subtitle1" className="activityTitle">
                  {activity.activityCode}
                  {descriptionString}
                </Typography>
              </Grid>
              {renderOptionsMenu()}
            </Grid>
            {activity.activityNote && (
              <Grid item>
                <Typography
                  variant="subtitle2"
                  color="black"
                  sx={{
                    wordBreak: "break-all",
                  }}
                >
                  {activity.tradeCode}
                </Typography>
              </Grid>
            )}
          </Grid>
          <Stack
            className="activityDetails"
            spacing={1}
            direction="row"
            justifyContent="space-between"
            flexWrap="wrap"
          >
            <Grid
              item
              xs={5}
              sm={2}
              md={5}
              lg={2}
              container
              className="activityDetailsTile"
            >
              <Typography variant="caption" color="gray">
                {layout.ACT.fields.task.text}
              </Typography>
              <Typography noWrap>
                {activity.taskCode ? activity.taskCode : "—"}
              </Typography>
            </Grid>

            <Grid
              item
              xs={5}
              sm={2}
              md={5}
              lg={2}
              container
              className="activityDetailsTile"
            >
              <Typography variant="caption" color="gray">
                {layout.ACT.fields.matlcode.text}
              </Typography>
              <Typography noWrap>
                {activity.materialList ? activity.materialList : "—"}
              </Typography>
            </Grid>

            <Grid
              item
              xs={5}
              sm={2}
              md={5}
              lg={2}
              container
              className="activityDetailsTile"
            >
              <Typography variant="caption" color="gray">
                {/* {layout.ACT.fields.personsreq.text} */}
                {<Groups />}
              </Typography>
              <Typography>{activity.peopleRequired}</Typography>
            </Grid>

            <Grid
              item
              xs={5}
              sm={2}
              md={5}
              lg={2}
              container
              className="activityDetailsTile"
            >
              <Typography variant="caption" color="gray">
                {/* {layout.BOO.fields.hrswork.text} */}
                Hrs. Worked
                <br />
                (Estimated)
              </Typography>
              <Typography>
                {totalHours}{" "}
                <span className="estmtd">({activity.estimatedHours})</span>
              </Typography>
            </Grid>

            <Grid
              item
              xs={5}
              sm={2}
              md={5}
              lg={3}
              xl={2}
              container
              className="activityDetailsTile"
            >
              <Typography variant="caption" color="gray">
                {/* {layout.ACT.fields.actstartdate.text} */}
                {<CalendarStart />}
              </Typography>
              <Typography noWrap>{formatDate(activity.startDate)}</Typography>
            </Grid>
          </Stack>

          {bookLabours && bookLabours.length > 0 && (
            <BookLabours bookLabours={bookLabours} layout={layout.BOO.fields} />
          )}
        </Grid>
      </Card>

      <Divider />

      <AddActivityDialogContainer
        open={isEditModalOpen}
        onChange={readActivities}
        onClose={() => setIsEditModalOpen(false)}
        postAddActivityHandler={postAddActivityHandler}
        activityToEdit={activity}
      />
    </>
  );
}

export default React.memo(Activity);
