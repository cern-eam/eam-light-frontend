import React, {useState, useEffect} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import WSEquipment from '../../../../tools/WSEquipment';
import EISTable from 'eam-components/dist/ui/components/table';

function EquipmentWorkOrders(props) {
    
    let workOrderFilterTypes = {
        ALL: 'ALL',
        OPEN: 'OPEN',
        MTF: 'MTF'
    }

    let workOrderFilters = {
        [workOrderFilterTypes.ALL]: {
            text: 'All',
            process: (data) => {
                return [...data];
            }
        },
        [workOrderFilterTypes.OPEN]: {
            text: 'Open',
            process: (data) => {
                return data.filter((workOrder) => !workOrder.status.startsWith("T"));
            }
        },
        [workOrderFilterTypes.MTF]: {
            text: 'MTF',
            process: (data) => {
                return data.filter((workOrder) => {
                    return workOrder.type.startsWith("ICF") || workOrder.type.startsWith("MTF");
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
                    // convert the dates from UNIX time to readable format
                    let date = new Date(element.createdDate);
                    let year = date.getFullYear().toString();
                    let month = (date.getMonth() + 1).toString();
                    let day = (date.getDate()).toString();

                    if (month.length < 2) month = '0' + month;
                    if (day.length < 2) day = '0' + day;

                    element.createdDate = [year, month, day].join('-');
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
            <EISTable
               data={getFilteredWorkOrderList(data)}
               headers={headers}
               propCodes={propCodes}
               filters={workOrderFilters}
               activeFilter={workOrderFilter}
               handleFilterChange={newFilter => setWorkOrderFilter(newFilter)}
               linksMap={linksMap} />
        </EISPanel>
    )

}

export default React.memo(EquipmentWorkOrders)