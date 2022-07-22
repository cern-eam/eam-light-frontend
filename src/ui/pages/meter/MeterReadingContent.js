import React, {useEffect, useState} from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Save from '@mui/icons-material/Save';
import './MeterReading.css';
import KeyCode from "eam-components/dist/enums/KeyCode";

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
            <Accordion defaultExpanded>
                <AccordionSummary>
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
                </AccordionSummary>
                <AccordionDetails>
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
                </AccordionDetails>
                <Divider/>
                <AccordionActions>

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
                </AccordionActions>
            </Accordion>
        </div>
    );
}

export default MeterReadingContent;