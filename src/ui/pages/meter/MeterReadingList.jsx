import * as React from "react";
import EISPanel from "eam-components/dist/ui/components/panel";
import MeterReadingContent from "./MeterReadingContent";
import "./MeterReading.css";

class MeterReadingList extends React.Component {
  renderMetersList = () => {
    const meterReadings = this.props.meterReadings;
    if (!meterReadings || meterReadings.length === 0 || !meterReadings[0]) {
      return (
        <p style={{ marginLeft: "23px" }}>
          No meter readings were found for the current search criteria.
        </p>
      );
    }
    //There are meter readings
    return meterReadings.map((reading, index) => {
      return (
        <div key={`meter_${index}`}>
          <MeterReadingContent
            key={`meter_${index}`}
            reading={reading}
            parentProps={this.props.parentProps}
          />
        </div>
      );
    });
  };

  render() {
    const { parentProps } = this.props;
    const { searchCriteria } = parentProps;
    if (!searchCriteria.meterCode && !searchCriteria.equipmentCode) {
      return <div />;
    }
    //There is some search
    return (
      <EISPanel
        heading="METER READINGS"
        alwaysExpanded={true}
        detailsStyle={{ padding: "0" }}
      >
        <div style={{ width: "100%", marginTop: 0 }}>
          {this.renderMetersList()}
        </div>
      </EISPanel>
    );
  }
}

export default MeterReadingList;
