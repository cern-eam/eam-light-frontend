import React from 'react';
import BlockUi from 'react-block-ui';
import Grid from '@material-ui/core/Grid';
import MeterReadingSearch from "./MeterReadingSearch";
import MeterReadingList from "./MeterReadingList";
import WSMeters from "../../../tools/WSMeters";
import './MeterReading.css';
import EAMConfirmDialog from "../../components/EAMConfirmDialog";

/**
 * Meter Readings main class
 */
const defaultMessageCreate = 'Are you sure you want to create this reading?';
const rollOverMessageCreate = 'Value is less than the Last Reading, which indicates the meter has rolled over. Is this correct?';

class MeterReading extends React.Component {

    state = {
        blocking: false,
        searchCriteria: {
            meterCode: '',
            meterDesc: '',
            equipmentCode: '',
            equipmentDesc: '',
        },
        meterReadings: [],
        dialogOpen: false,
        createMessage: defaultMessageCreate
    };

    meterReading = {};

    updateSearchProperty = (key, value) => {
        this.setState((prevState) => ({
            searchCriteria: {...prevState.searchCriteria, [key]: value}
        }));
    };

    onChangeMeterCode = (code) => {
        //Search meter readings for valid code
        if (code) {
            //Blocking
            this.setState(() => ({blocking: true}));
            WSMeters.getReadingsByMeterCode(code).then(response => {
                //Set readings
                this.setState(() => ({meterReadings: response.body.data}));
                //Empty Equipment search criteria
                this.updateSearchProperty('equipmentCode', '');
                this.updateSearchProperty('equipmentDesc', '');
                //Not Loading
                this.setState(() => ({blocking: false}));
            }).catch(error => {
                this.props.handleError(error);
                this.setState(() => ({blocking: false}));
            });
        }
    };

    onChangeEquipmentCode = (code) => {
        //Search meter readings for valid code
        if (code) {
            //Blocking
            this.setState(() => ({blocking: true}));
            WSMeters.getReadingsByEquipment(code).then(response => {
                //Set readings
                this.setState(() => ({meterReadings: response.body.data}));
                //Empty Meter search criteria
                this.updateSearchProperty('meterCode', '');
                this.updateSearchProperty('meterDesc', '');
                //Not Loading
                this.setState(() => ({blocking: false}));
            }).catch(error => {
                this.props.handleError(error);
                this.setState(() => ({blocking: false}));
            });
        }
    };

    saveHandler = (meterReading, isRollover) => {
        this.meterReading = meterReading;
        this.setState(() => ({
            dialogOpen: true,
            createMessage: isRollover ? rollOverMessageCreate : defaultMessageCreate
        }));
    };


    /**
     * This method will create the meter reading after the check of rollover
     */
    createMeterReadingHandler = () => {
        //Blocking
        this.setState(() => ({blocking: true}));

        //Call service to create the reading
        WSMeters.createMeterReading(this.meterReading).then(response => {
            //Close the dialog
            this.closeDialog();
            //Reload the data
            this.loadMeterReadings();
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
    loadMeterReadings = () => {
        //Load according to the selected filter
        if (this.state.searchCriteria.meterDesc) {
            this.onChangeMeterCode(this.state.searchCriteria.meterCode);
        } else {
            this.onChangeEquipmentCode(this.state.searchCriteria.equipmentCode);
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
            saveHandler: this.saveHandler
        };

        return (
            <div id="entityContainer">
                <BlockUi tag="div" blocking={this.state.blocking} style={{height: "100%", width: "100%"}}>
                    <div id="entityMain" style={{height: "100%", overflowY: "hidden"}}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <MeterReadingSearch parentProps={parentProps}/>
                                <MeterReadingList parentProps={parentProps} meterReadings={this.state.meterReadings}/>
                            </Grid>
                        </Grid>
                    </div>
                    <EAMConfirmDialog isOpen={this.state.dialogOpen} title={`Create Meter Reading`}
                                      message={this.state.createMessage} cancelHandler={this.closeDialog}
                                      confirmHandler={this.createMeterReadingHandler}
                                      blocking={this.state.blocking}
                    />
                </BlockUi>
            </div>
        )
    }
}

export default MeterReading;