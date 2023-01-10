import React, { useState, useEffect } from 'react';
import WSWorkorders from "../../../../tools/WSWorkorders";
import EISTable from 'eam-components/dist/ui/components/table';
import Button from '@mui/material/Button';
import PartUsageDialog from "./PartUsageDialog";
import BlockUi from 'react-block-ui';

function PartUsage(props) {

    let headers = ['Transaction', 'Part', 'Activity', 'Store', 'Quantity'];
    let propCodes = ['transType', 'partCode', 'activityDesc', 'storeCode', 'quantity'];
    let linksMap = new Map([['partCode', {linkType: 'fixed', linkValue: 'part/', linkPrefix: '/'}]]);

    let [data, setData] = useState([]);
    let [isDialogOpen, setIsDialogOpen] = useState(false);
    let [isLoading, setIsLoading] = useState([]);

    useEffect(() => {
        fetchData(props.workorder.number)
    }, [props.workorder.number])

    let formatQuantity = (data) => {
        data.forEach(part =>
            part.quantity = part.quantity ? part.quantity + (part.partUoM ? " " + part.partUoM : "") : ""
        )
    }

    let fetchData = (workorder) => {
        setIsLoading(true)
        if (workorder) {
            WSWorkorders.getPartUsageList(workorder).then(response => {
                formatQuantity(response.body.data);
                setData(response.body.data);
                setIsLoading(false);
            }).catch(error => {
                props.handleError(error);
                setIsLoading(false);
            });
        }
    };

    let successHandler = () => {
        props.showNotification('Part usage created successfully');
        //Close dialog
        setIsDialogOpen(false);
        //Init the list of part usage again
        fetchData(props.workorder.number);
    }

    return (
        isLoading
        ?
            <BlockUi tag="div" blocking={isLoading} style={{ width: '100%' }} />
        :
        <>
            <div style={{ width: '100%', height: '100%' }}>
                {data?.length > 0 &&
                    <EISTable
                        data={data}
                        headers={headers}
                        propCodes={propCodes}
                        linksMap={linksMap} />
                }
                <div style={{height: 15}} />
                <Button onClick={() => setIsDialogOpen(true)} color="primary" 
                        disabled={props.disabled} variant="outlined">
                    Add Part Usage
                </Button>
            </div>
            <PartUsageDialog
                showNotification={props.showNotification}
                showError={props.showError}
                handleError={props.handleError}
                handleCancel={() => setIsDialogOpen(false)}
                tabLayout={props.tabLayout.fields}
                isDialogOpen={isDialogOpen}
                workorder={props.workorder}
                isLoading={isLoading}
                successHandler={successHandler}
                equipmentMEC={props.equipmentMEC}/>
        </>
    )
}

export default PartUsage;