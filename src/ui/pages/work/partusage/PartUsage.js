import React, {Component, useEffect, useState} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import WSWorkorders from "../../../../tools/WSWorkorders";
import EISTable from 'eam-components/dist/ui/components/table';
import Button from '@material-ui/core/Button';
import PartUsageDialog from "./PartUsageDialog";
import BlockUi from 'react-block-ui';


const buttonStyle = {
    position: 'relative',
    float: 'left',
    bottom: '-13px',
    left: '5px',
};

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

    let fetchData = (workorder) => {
        setIsLoading(true)
        if (workorder) {
            WSWorkorders.getPartUsageList(workorder).then(response => {
                setData(response.body.data);
                setIsLoading(false);
            }).catch(error => {
                props.handleError(error);
                setIsLoading(false);
            });
        }
    };

    let handleAddPartUsage = (partUsage, partUsageLine) => {
        setIsLoading(true);
        //Set the part usage Line
        partUsage.transactionlines = [partUsageLine];
        //Remove transaction info prop
        delete partUsage.transactionInfo;
        //Save the record
        WSWorkorders.createPartUsage(partUsage).then(response => {
            //Notification
            props.showNotification('Part usage created successfully');
            //Close dialog
            setIsDialogOpen(false);
            //Init the list of part usage again
            fetchData(props.workorder.number);
            setIsLoading(false);
        }).catch(error => {
            props.handleError(error);
            setIsLoading(false);
        });
    };



    return (
        <EISPanel heading="PART USAGE">
            <BlockUi tag="div" blocking={isLoading}>
                <div style={{width: '100%', height: '100%'}}>
                    <EISTable data={data} headers={headers} propCodes={propCodes}
                              linksMap={linksMap}/>
                    <Button onClick={() => setIsDialogOpen(true)} color="primary" style={buttonStyle}>
                        Add Part Usage
                    </Button>
                </div>
            </BlockUi>
            <PartUsageDialog handleSave={handleAddPartUsage}
                             showNotification={props.showNotification}
                             handleError={props.handleError}
                             handleCancel={() => setIsDialogOpen(false)}
                             tabLayout={props.tabLayout}
                             isDialogOpen={isDialogOpen}
                             workorder={props.workorder}
                             isLoading={isLoading}/>
        </EISPanel>
    )

}

export default PartUsage;