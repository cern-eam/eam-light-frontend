import React, {useState, useEffect} from 'react';
import {format} from 'date-fns'
import WSEquipment from '../../../../tools/WSEquipment';
import EISTable from 'eam-components/dist/ui/components/table';
import EISTableFilter from 'eam-components/dist/ui/components/table/EISTableFilter';
import EquipmentMTFWorkOrders from "./EquipmentMTFWorkOrders"
import BlockUi from 'react-block-ui';

function EquipmentWorkOrders(props) {    
    let workOrderFilterTypes = {
        ALL: 'All',
        OPEN: 'Open',
        MTF: 'MTF'
    }

    let workOrderFilters = {
        [workOrderFilterTypes.ALL]: {
            text: workOrderFilterTypes.ALL,
            process: (data) => {
                return [...data];
            }
        },
        [workOrderFilterTypes.OPEN]: {
            text: workOrderFilterTypes.OPEN,
            process: (data) => {
                return data.filter((workOrder) => workOrder.status && !workOrder.status.startsWith("T"));
            }
        },
        [workOrderFilterTypes.MTF]: {
            text: workOrderFilterTypes.MTF,
            process: (data) => {
                return data.filter((workOrder) => {
                    return workOrder.mrc && (workOrder.mrc.startsWith("ICF") || workOrder.mrc.startsWith("MTF"));
                })
            }
        }
    }

    let headers = ['Work Order', 'Description', 'Status', 'Creation Date'];
    let propCodes = ['number', 'desc', 'status', 'createdDate'];
    let linksMap = new Map([['number', {linkType: 'fixed', linkValue: 'workorder/', linkPrefix: '/'}]]);

    let [data, setData] = useState([]);
    let [workOrderFilter, setWorkOrderFilter] = useState(workOrderFilterTypes.ALL)
    const [loadingData, setLoadingData] = useState(true);

    let getFilteredWorkOrderList = (workOrders) => {
        return workOrderFilters[workOrderFilter].process(workOrders)
    }

    useEffect(() => {
        if (props.equipmentcode) {
            fetchData(props.equipmentcode)
        } else {
            setData([]);
        }
    },[props.equipmentcode])

    let fetchData = (equipmentcode) => {
        WSEquipment.getEquipmentWorkOrders(equipmentcode)
            .then(response => {
                response.body.data.forEach(element => {
                    element.createdDate = element.createdDate && format(new Date(element.createdDate),'dd-MMM-yyyy');
                });
                setData(response.body.data)
            })
            .finally(() => setLoadingData(false));
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            <EISTableFilter
                filters={workOrderFilters}
                handleFilterChange={newFilter =>
                    setWorkOrderFilter(newFilter)
                }
                activeFilter={workOrderFilter}
                />
                
            {workOrderFilter === workOrderFilterTypes.MTF ?
                <EquipmentMTFWorkOrders equipmentcode={props.equipmentcode} />
                :
                <BlockUi blocking={loadingData}>
                    <EISTable
                    data={getFilteredWorkOrderList(data)}
                    headers={headers}
                    propCodes={propCodes}
                    linksMap={linksMap}
                    />
                </BlockUi>
            }
        </div>
    )

}

export default React.memo(EquipmentWorkOrders)