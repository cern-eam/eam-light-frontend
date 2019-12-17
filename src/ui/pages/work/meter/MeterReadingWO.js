import React from 'react';
import WSMeters from '../../../../tools/WSMeters';
import EISPanel from 'eam-components/dist/ui/components/panel';
import MeterReadingContent from "../../meter/MeterReadingContent";
import EAMConfirmDialog from "../../../components/EAMConfirmDialog";

/**
 * Meter Readings inside the work order number (workorder).
 * Receive as properties the work order
 */
const defaultMessageCreate = 'Are you sure you want to create this reading?';
const rollOverMessageCreate = 'Value is less than the Last Reading, which indicates the meter has rolled over. Is this correct?';

class MeterReadingWO extends React.Component {

    state = {
        blocking: false,
        meterReadings: [],
        dialogOpen: false,
        createMessage: defaultMessageCreate
    };

    //Meter reading to be saved
    meterReading = {};

    componentWillMount() {
        //If there is work order, then read
        if (this.props.equipment) {
            this.loadMeterReadings(this.props.equipment);
        }
    }

    componentWillReceiveProps(nextProps) {
        //Reload if the work order change
        if (nextProps.equipment && nextProps.equipment !== this.props.equipment) {
            this.loadMeterReadings(nextProps.equipment);
        } else if (!nextProps.equipment) {
            //No work order, so clear readings
            this.setState(() => ({meterReadings: []}));
        }
    }


    saveHandler = (meterReading, isRollover) => {
        this.meterReading = meterReading;
        this.setState(() => ({
            dialogOpen: true,
            createMessage: isRollover ? rollOverMessageCreate : defaultMessageCreate
        }));
    };


    /**
     * This method will create the meter reading after the check of rollover
     * @param meterReading Meter reading to be created
     */
    createMeterReadingHandler = () => {
        //Blocking
        this.setState(() => ({blocking: true}));
        //Call service to create the reading
        WSMeters.createMeterReading(this.meterReading).then(response => {
            //Close the dialog
            this.closeDialog();
            //Reload the data
            this.loadMeterReadings(this.props.equipment);
            //Message
            this.props.showNotification('Meter Reading created successfully');
        }).catch(error => {
            this.props.handleError(error);
            this.setState(() => ({blocking: false}));
        });
    };

    /**
     * To load the meter reading
     */
    loadMeterReadings = (equipment) => {
        //Loading
        this.setState(() => ({blocking: true}));
        WSMeters.getReadingsByEquipment(equipment).then(response => {
            //Readings
            const meterReadings = response.body.data ? response.body.data : [];
            //Set readings
            this.setState(() => ({meterReadings}));
            //Not Loading
            this.setState(() => ({blocking: false}));
        }).catch(error => {
            this.props.handleError(error);
            this.setState(() => ({blocking: false}));
        });
    };

    closeDialog = () => {
        this.setState(() => ({
            dialogOpen: false,
        }));
    };

    renderMetersList = () => {
        //Properties to pass to the children
        const parentProps = {
            saveHandler: this.saveHandler
        };

        const meterReadings = this.state.meterReadings;
        //There are meter readings
        return (
            meterReadings.map((reading, index) => {
                return (
                    <div key={`meter_${index}`}>
                        <MeterReadingContent key={`meter_${index}`} reading={reading}
                                             parentProps={parentProps}/>
                    </div>);
            }));
    };

    render() {
        //Render if there are readings
        if (this.state.meterReadings.length === 0) {
            return <div/>;
        }

        //Readings, so render the region
        return (
            <EISPanel heading="METER READINGS"
                           detailsStyle={{padding: '0'}}>
                <div style={{width: "100%", marginTop: 0}}>
                    {this.renderMetersList()}
                </div>
                <EAMConfirmDialog isOpen={this.state.dialogOpen} title={`Create Meter Reading`}
                                  message={this.state.createMessage} cancelHandler={this.closeDialog}
                                  confirmHandler={this.createMeterReadingHandler}
                                  blocking={this.state.blocking}
                />
            </EISPanel>
        )
    }
}

export default MeterReadingWO;