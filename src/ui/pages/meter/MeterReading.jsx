import * as React from "react";
import BlockUi from "react-block-ui";
import Grid from "@mui/material/Grid";
import MeterReadingSearch from "./MeterReadingSearch";
import MeterReadingList from "./MeterReadingList";
import WSMeters from "../../../tools/WSMeters";
import "./MeterReading.css";
import EAMConfirmDialog from "../../components/EAMConfirmDialog";
import useSnackbarStore from "../../../state/useSnackbarStore";

/**
 * Meter Readings main class
 */
const defaultMessageCreate = "Are you sure you want to create this reading?";
const rollOverMessageCreate = "Value is less than the Last Reading, which indicates the meter has rolled over. Is this correct?";

class MeterReading extends React.Component {
  constructor(props) {
    super(props);
    this.handleError = useSnackbarStore.getState().handleError;
    this.showNotification = useSnackbarStore.getState().showNotification;
  }

  state = {
    blocking: false,
    searchCriteria: {
      meterCode: "",
      equipmentCode: "",
      org: ""
    },
    meterReadings: [],
    dialogOpen: false,
    createMessage: defaultMessageCreate,
  };

  meterReading = {};

  updateSearchProperty = (key, value) => {
    this.setState((prevState) => ({
      searchCriteria: { ...prevState.searchCriteria, [key]: value },
    }));
  };

  onChangeMeterCode = (meter) => {
    this.updateSearchProperty("meterCode", meter?.code);
    this.updateSearchProperty("org", meter?.org);
    //Search meter readings for valid code
    if (meter) {
      //Blocking
      this.setState(() => ({ blocking: true }));
      WSMeters.getReadingsByMeterCode(meter.code, meter.org)
        .then((response) => {
          //Set readings
          this.setState(() => ({ meterReadings: [response] }));
          //Empty Equipment search criteria
          this.updateSearchProperty("equipmentCode", "");
          //Not Loading
          this.setState(() => ({ blocking: false }));
        })
        .catch((error) => {
          this.handleError(error);
          this.setState(() => ({ blocking: false }));
        });
    } 
  };

  onChangeEquipmentCode = (equipment) => {
    this.updateSearchProperty("equipmentCode", equipment?.code);
    this.updateSearchProperty("org", equipment?.org);
    //Search meter readings for valid code
    if (equipment) {
      //Blocking
      this.setState(() => ({ blocking: true }));
      WSMeters.getReadingsByEquipment(equipment.code, equipment.org)
        .then((response) => {
          //Set readings
          this.setState(() => ({ meterReadings: response }));
          //Empty Meter search criteria
          this.updateSearchProperty("meterCode", "");
          //Not Loading
          this.setState(() => ({ blocking: false }));
        })
        .catch((error) => {
          this.handleError(error);
          this.setState(() => ({ blocking: false }));
        });
    }
  };

  saveHandler = (meterReading, isRollover) => {
    this.meterReading = meterReading;
    this.setState(() => ({
      dialogOpen: true,
      createMessage: isRollover ? rollOverMessageCreate : defaultMessageCreate,
    }));
  };

  /**
   * This method will create the meter reading after the check of rollover
   */
  createMeterReadingHandler = () => {
    this.setState(() => ({ blocking: true }));
    //Call service to create the reading
    WSMeters.createMeterReading(this.meterReading)
      .then((response) => {
        //Reload the data
        this.loadMeterReadings();
        //Message
        this.showNotification("Meter Reading created successfully");
      })
      .catch((error) => {
        this.handleError(error);
      })
      .finally( () => {
        this.closeDialog();
        this.setState(() => ({ blocking: false }));
      })
  };

  /**
   * To load the meter reading
   */
  loadMeterReadings = () => {
    //Load according to the selected filter
    if (this.state.searchCriteria.meterCode) {
      this.onChangeMeterCode({code: this.state.searchCriteria.meterCode, org: this.state.searchCriteria.org});
    } else {
      this.onChangeEquipmentCode({code: this.state.searchCriteria.equipmentCode, org: this.state.searchCriteria.org});
    }
  };

  closeDialog = () => {
    this.setState(() => ({
      dialogOpen: false,
    }));
  };

  render() {
    //Properties to pass to the children
    const parentProps = {
      ...this.props,
      ...this.state,
      updateSearchProperty: this.updateSearchProperty,
      onChangeMeterCode: this.onChangeMeterCode,
      onChangeEquipmentCode: this.onChangeEquipmentCode,
      saveHandler: this.saveHandler,
    };

    return (
      <div id="entityContainer" style={{ height: "100%" }}>
        <BlockUi
          tag="div"
          blocking={this.state.blocking}
          style={{ height: "100%", width: "100%" }}
        >
          <div
            id="entityContent"
            style={{ height: "100%", overflowY: "hidden" }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <MeterReadingSearch parentProps={parentProps} />
                <MeterReadingList
                  parentProps={parentProps}
                  meterReadings={this.state.meterReadings}
                />
              </Grid>
            </Grid>
          </div>
          <EAMConfirmDialog
            isOpen={this.state.dialogOpen}
            title={`Create Meter Reading`}
            message={this.state.createMessage}
            cancelHandler={this.closeDialog}
            confirmHandler={this.createMeterReadingHandler}
            blocking={this.state.blocking}
          />
        </BlockUi>
      </div>
    );
  }
}

export default MeterReading;
