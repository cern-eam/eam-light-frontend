import React, { useState, useEffect } from 'react';
import WSWorkorders from "../../../../tools/WSWorkorders";
import {getPartUsageList} from "../../../../tools/WSGrids";
import EISTable from 'eam-components/dist/ui/components/table';
import Button from '@mui/material/Button';
import PartUsageDialog from "./PartUsageDialog";
import BlockUi from 'react-block-ui';
import useSnackbarStore from '@/state/useSnackbarStore';

function PartUsage(props) {

    let headers = ['Transaction', 'Part', 'Part Description', 'Activity', 'Store', 'Quantity'];
    let propCodes = ['transType', 'partCode', 'partDesc', 'activityDesc', 'storeCode', 'quantity'];
    let linksMap = new Map([['partCode', {linkType: 'fixed', linkValue: 'part/', linkPrefix: '/'}]]);

    let [data, setData] = useState([]);
    let [isDialogOpen, setIsDialogOpen] = useState(false);
    let [isLoading, setIsLoading] = useState([]);

    const {showError, showWarning, showNotification, handleError} = useSnackbarStore();

    useEffect(() => {
        fetchData(props.workOrderCode)
    }, [props.workOrderCode])

    let formatQuantity = (data) => {
        data.forEach(part => {
            part.transType =
                part.plannedQty > 0 ? "Planned" :
                part.usedQty > 0 ? "Issue" :
                part.usedQty < 0 ? "Return" :
                null;

            part.quantity =
            part.plannedQty > 0 ? part.plannedQty :
                part.usedQty !== 0 && part.usedQty != null ? Math.abs(part.usedQty) :
                null;

            part.quantity = part.quantity ? part.quantity + (part.partUoM ? " " + part.partUoM : "") : ""
        }
        )
    }

    let fetchData = (workorder) => {
        setIsLoading(true)
        if (workorder) {
            getPartUsageList(workorder).then(response => {
                formatQuantity(response.body.data);
                setData(response.body.data);
                setIsLoading(false);
            }).catch(error => {
                handleError(error);
                setIsLoading(false);
            });
        }
    };

    let successHandler = () => {
        showNotification('Part usage created successfully');
        //Close dialog
        setIsDialogOpen(false);
        //Init the list of part usage again
        fetchData(props.workOrderCode);
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
                showNotification={showNotification}
                showError={showError}
                showWarning={showWarning}
                handleError={handleError}
                handleCancel={() => setIsDialogOpen(false)}
                tabLayout={props.tabLayout.fields}
                isDialogOpen={isDialogOpen}
                workOrderCode={props.workOrderCode}
                workOrder={props.workOrder}
                isLoading={isLoading}
                successHandler={successHandler}
                equipmentMEC={props.equipmentMEC}/>
        </>
    )
}

export default PartUsage;