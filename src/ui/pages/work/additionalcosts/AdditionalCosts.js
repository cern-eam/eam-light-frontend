import React, { useState, useEffect } from 'react';
import WSWorkorders from "../../../../tools/WSWorkorders";
import EISTable from 'eam-components/ui/components/table';
import Button from '@mui/material/Button';
import AdditionalCostDialog from "./AdditionalCostDialog";
import BlockUi from 'react-block-ui';

const buttonStyle = {
    position: 'relative',
    float: 'left',
    bottom: '-13px',
    left: '5px',
};

const AdditionalCosts = (props) => {
    const headers = ['Activity', 'Cost Description', 'Cost Type', 'Quantity', 'Cost', 'Date'];
    const propCodes = ['activitytrade_display', 'costdescription', 'costtype_display', 'quantity', 'cost', 'additionalcostsdate'];

    const [data, setData] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState([]);

    useEffect(() => {
        fetchData(props.workorder.number);
    }, [props.workorder.number]);

    const adjustData = (data) => {
        return data.map((additionalCost) => ({
            ...additionalCost,
            activitytrade_display: additionalCost.activitytrade_display.split(' ')[0],
            additionalcostsdate: additionalCost.additionalcostsdate.split(' ')[0],
        }));
    };

    const fetchData = (workorder) => {
        setIsLoading(true)
        if (workorder) {
            WSWorkorders.getAdditionalCostsList(workorder).then((response) => {
                const data = adjustData(response.body.data);
                setData(data);
                setIsLoading(false);
            }).catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
        }
    };

    const successHandler = () => {
        props.showNotification('Additional cost created successfully');
        setIsDialogOpen(false);
        fetchData(props.workorder.number);
    }

    return (
        isLoading
        ?
            <BlockUi tag="div" blocking={isLoading} style={{ width: '100%' }} />
        :
        <>
            <div style={{ width: '100%', height: '100%' }}>
                <EISTable
                    data={data}
                    headers={headers}
                    propCodes={propCodes} />
                <Button onClick={() => setIsDialogOpen(true)} color="primary" style={buttonStyle} disabled={props.disabled}>
                    Add Additional Cost
                </Button>
            </div>
            <AdditionalCostDialog
                handleError={props.handleError}
                handleCancel={() => setIsDialogOpen(false)}
                tabLayout={props.tabLayout.fields}
                isDialogOpen={isDialogOpen}
                workorder={props.workorder}
                isLoading={isLoading}
                successHandler={successHandler}/>
        </>
    )
}

export default AdditionalCosts;