import React, {useState, useEffect} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import WSEquipment from '../../../../tools/WSEquipment';
import EISTable from 'eam-components/dist/ui/components/table';

function EquipmentHistory(props)  {

    let headers = ['Date', 'Type', 'Related Value', 'Done By'];
    let propCodes = ['completedDate', 'desc', 'relatedObject', 'enteredBy'];
    let [historyData, setHistoryData] = useState([]);

    useEffect(() => {
        if (props.equipmentcode) {
            fetchData(props.equipmentcode);
        } else {
            setHistoryData([])
        }
    },[props.equipmentcode])

    let fetchData = (equipmentcode) => {
            WSEquipment.getEquipmentHistory(equipmentcode)
                .then(response => {
                    setHistoryData(response.body.data.map(line => ({
                        ...line,
                        relatedObject: (line.jobType === 'EDH') ? <a target="_blank"
                                                                     href={"https://edh.cern.ch/Document/" + line.relatedObject}>{line.relatedObject}</a> : line.relatedObject
                    })))
                });
    }

    if (historyData.length === 0) {
        return null;
    }

    return (
        <EISPanel heading="HISTORY">
            <EISTable data={historyData}
                      headers={headers}
                      propCodes={propCodes}
            />
        </EISPanel>
    )
}

export default React.memo(EquipmentHistory);