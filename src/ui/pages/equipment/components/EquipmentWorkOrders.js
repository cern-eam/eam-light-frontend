import React, {useState, useEffect} from 'react';
import {format} from 'date-fns'
import EISPanel from 'eam-components/dist/ui/components/panel';
import WSEquipment from '../../../../tools/WSEquipment';
import EISTable from 'eam-components/dist/ui/components/table';
import EISTableFilter from 'eam-components/dist/ui/components/table/EISTableFilter';
import EquipmentMTFWorkOrders from "./EquipmentMTFWorkOrders"

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
            });
    }

    if (data.length === 0) {
        return null;
    }

    return (
        <EISPanel
            detailsStyle={{display: 'flex', flexDirection: 'column'}}
            heading="WORK ORDERS">
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
                <EISTable
                    data={getFilteredWorkOrderList(data)}
                    headers={headers}
                    propCodes={propCodes}
                    linksMap={linksMap}
                />
            }
        </EISPanel>
    )

}

export default React.memo(EquipmentWorkOrders)