import React, { useState, useEffect } from 'react';
import WSWorkorders from "../../../../tools/WSWorkorders";
import EISTable from 'eam-components/dist/ui/components/table';
import Button from '@mui/material/Button';
import AdditionalCostDialog from "./AdditionalCostDialog";
import BlockUi from 'react-block-ui';
import useSnackbarStore from '../../../../state/useSnackbarStore';

const buttonStyle = {
    //position: 'relative',
    //float: 'left',
    //bottom: '-13px',
   // left: '5px',
   padding: 10
};

const AdditionalCosts = (props) => {
    const headers = ['Activity', 'Cost Description', 'Cost Type', 'Quantity', 'Cost', 'Date'];
    const propCodes = ['activitytrade_display', 'costdescription', 'costtype_display', 'quantity', 'cost', 'additionalcostsdate'];

    const [data, setData] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState([]);
    const {showError, showNotification, handleError} = useSnackbarStore();

    useEffect(() => {
        fetchData(props.workOrderNumber);
    }, [props.workOrderNumber]);

    const adjustData = (data) => {
        return data.map((additionalCost) => ({
            ...additionalCost,
            activitytrade_display: additionalCost.activitytrade_display.split(' ')[0],
            additionalcostsdate: additionalCost.additionalcostsdate.split(' ')[0],
        }));
    };

    const fetchData = (workOrderNumber) => {
        setIsLoading(true)
        if (workOrderNumber) {
            WSWorkorders.getAdditionalCostsList(workOrderNumber).then((response) => {
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
        showNotification('Additional cost created successfully');
        setIsDialogOpen(false);
        fetchData(props.workOrderNumber);
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
                        propCodes={propCodes} />
                }
                <div style={{height: 15}} />
                <Button onClick={() => setIsDialogOpen(true)} color="primary" 
                        disabled={props.disabled} variant="outlined">
                    Add Additional Cost
                </Button>
            </div>
            <AdditionalCostDialog
                handleError={handleError}
                handleCancel={() => setIsDialogOpen(false)}
                tabLayout={props.tabLayout.fields}
                isDialogOpen={isDialogOpen}
                workOrderNumber={props.workOrderNumber}
                isLoading={isLoading}
                successHandler={successHandler}/>
        </>
    )
}

export default AdditionalCosts;