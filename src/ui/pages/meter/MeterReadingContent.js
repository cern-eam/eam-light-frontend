import React, {useEffect, useState} from 'react';
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
import KeyCode from "../../../enums/KeyCode";;

function MeterReadingContent(props) {

    const {reading} = props;
    let [readingValue, setReadingValue] = useState('');

    // Clean the input field
    useEffect(() => {
        if (reading.lastValue == readingValue) {
           setReadingValue('');
        }
    },[reading.lastValue])

    let createNewReading = () => {
        const isRollover = reading.rolloverValue && reading.rolloverValue < readingValue;
        //Initialize meter reading object
        const newReading = {
            uom: reading.uom,
            equipmentCode: reading.equipmentCode,
            actualValue: readingValue
        };
        //Execute parent save handler
        props.parentProps.saveHandler(newReading, isRollover);
    };

    let handleKeyDown = (event) => {
        if (event.keyCode === KeyCode.ENTER) {
            createNewReading();
        }
    };

    //Check that there is a meter reading to render
    if (!props.reading) {
        return null;
    }


    return (
        <div style={{width: '100%', height: '100%'}}>
            <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary>
                    <div className={`meterContentDetails`}>
                        <div className={`meterContentDetail`}>
                            <div className={`meterContentTitleContentH`}>Equipment:</div>
                            <div className={`meterContentTitleContentC`}>{reading.equipmentCode}</div>
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
                        <InputLabel htmlFor="readingValue">{props.disabled ? 'Recording meter readings is disabled' : 'New Value'}</InputLabel>
                        <Input
                            id="readingValue"
                            type="number"
                            value={readingValue}
                            onChange={event => setReadingValue(event.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={props.disabled}
                            endAdornment={<InputAdornment position="end"
                                                          className="readingValueUOM">[{reading.uomDesc}]</InputAdornment>}
                        />
                    </FormControl>

                    {readingValue &&
                    <Button style={{top: '8px'}} size="small" color="primary"
                            onClick={createNewReading}>
                        <Save/>
                        Save
                    </Button>
                    }
                </ExpansionPanelActions>
            </ExpansionPanel>
        </div>
    );
}

export default MeterReadingContent;