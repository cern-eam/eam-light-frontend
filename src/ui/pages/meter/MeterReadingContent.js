import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Save from '@material-ui/icons/Save';
import './MeterReading.css';
import KeyCode from "../../../enums/KeyCode";

class MeterReadingContent extends React.Component {

    state = {
        readingValue: '',
    };

    componentWillReceiveProps(nextProps) {
        //To clear the value when we create a new reading
        if (nextProps) {
            const {reading} = nextProps;
            if (reading && reading.lastValue === this.state.readingValue) {
                this.setState(() => ({readingValue: ''}));
            }
        }
    }

    createNewReading = () => {
        //Destructuring of properties
        const {reading} = this.props;
        const {meterReading} = reading;
        //Initialize meter reading object
        const newReading = {
            ...meterReading,
            actualValue: this.state.readingValue
        };
        //Execute parent save handler
        this.props.parentProps.saveHandler(newReading);
    };

    handleReadingValue = (event) => {
        const value = event.target.value;
        this.setState(() => ({readingValue: value}));
    };

    handleKeyDown = (event) => {
        if (event.keyCode === KeyCode.ENTER) {
            this.createNewReading();
        }
    };


    render() {
        //Check that there is a meter reading to render
        if (!this.props.reading || !this.props.reading.meterReading) {
            return null;
        }
        const {reading} = this.props;
        const {meterReading} = reading;

        return (
            <div style={{width: '100%', height: '100%'}}>
                <ExpansionPanel defaultExpanded>
                    <ExpansionPanelSummary>
                        <div className={`meterContentDetails`}>
                            <div className={`meterContentDetail`}>
                                <div className={`meterContentTitleContentH`}>Equipment:</div>
                                <div className={`meterContentTitleContentC`}>{meterReading.equipmentCode}</div>
                            </div>
                            {reading.meterName &&
                            <div className={`meterContentDetail`}>
                                <div className={`meterContentTitleContentH`}>Meter Name:</div>

                                <div className={`meterContentTitleContentC`}>{reading.meterName}</div>
                            </div>
                            }
                        </div>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className={`meterContentDetails`}>
                            <div className={`meterContentDetail`}>
                                <div className={`meterContentTitleContentH`}>Last Reading Date:</div>
                                <div className={`meterContentTitleContentC`}>{reading.lastUpdateDate}</div>
                            </div>
                            <div className={`meterContentDetail`}>
                                <div className={`meterContentTitleContentH`}>Last Value:</div>
                                <div className={`meterContentTitleContentC`}>{reading.lastValue} [{reading.uomDesc}]
                                </div>
                            </div>
                        </div>
                    </ExpansionPanelDetails>
                    <Divider/>
                    <ExpansionPanelActions>

                        <FormControl style={{width: '100%', marginLeft: '15px', marginRight: '15px'}}>
                            <InputLabel htmlFor="readingValue">New Value</InputLabel>
                            <Input
                                id="readingValue"
                                type="number"
                                value={this.state.readingValue}
                                onChange={this.handleReadingValue}
                                onKeyDown={this.handleKeyDown}
                                endAdornment={<InputAdornment position="end"
                                                              className="readingValueUOM">[{reading.uomDesc}]</InputAdornment>}
                            />
                        </FormControl>

                        {this.state.readingValue &&
                        <Button style={{top: '8px'}} size="small" color="primary"
                                onClick={this.createNewReading}>
                            <Save/>
                            Save
                        </Button>
                        }
                    </ExpansionPanelActions>
                </ExpansionPanel>
            </div>
        );
    }
}

export default MeterReadingContent;