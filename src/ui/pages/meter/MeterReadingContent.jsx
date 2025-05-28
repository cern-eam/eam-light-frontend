import React, {useEffect, useState} from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Save from '@mui/icons-material/Save';
import './MeterReading.css';
import EAMTextField from 'eam-components/dist/ui/components/inputs-ng/EAMTextField';
import { formatDateTime } from '../EntityTools';

function MeterReadingContent(props) {

    const { reading, disabled, parentProps } = props;
    const [readingValue, setReadingValue] = useState('');

    // Clean the input field
    useEffect(() => {
        if (reading.lastValue == readingValue) {
           setReadingValue('');
        }
    },[reading.lastValue])

    const createNewReading = () => {
        const isRollover = reading.rolloverValue && reading.rolloverValue < readingValue;
        //Initialize meter reading object
        const newReading = {
            uom: reading.uom,
            equipmentCode: reading.equipmentCode,
            actualValue: readingValue,
            equipmentOrganization: reading.equipmentOrg
        };
        //Execute parent save handler
        parentProps.saveHandler(newReading, isRollover);
    };

    //Check that there is a meter reading to render
    if (!reading) {
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
                            <div className={`meterContentTitleContentC`}>{formatDateTime(reading.lastUpdateDate)}</div>
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
                    <EAMTextField
                        value={readingValue}
                        disabled={disabled}
                        onChange={setReadingValue}
                        onChangeInput={setReadingValue}
                        endTextAdornment={reading.uomDesc}
                        endAdornment={
                            <Button
                                size="small"
                                onClick={createNewReading}
                                disabled={!readingValue}
                            >
                                <Save /> Save
                            </Button>
                        }
                    />
                </AccordionActions>
            </Accordion>
        </div>
    );
}

export default MeterReadingContent;