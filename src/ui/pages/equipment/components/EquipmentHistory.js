import React, {useState, useEffect} from 'react';
import WSEquipment from '../../../../tools/WSEquipment';
import EISTable, {TRANSFORM_KEYS} from 'eam-components/dist/ui/components/table';
import SimpleEmptyState from 'eam-components/dist/ui/components/emptystates/SimpleEmptyState'
import BlockUi from 'react-block-ui';
import { withCernMode } from '../../../components/CERNMode';
import Constants from 'eam-components/dist/enums/Constants';

function EquipmentHistory(props)  {
    const headers = ['Date', 'Type', 'Related Value', 'Done By'];
    const propCodes = ['completedDate', 'desc', 'relatedObject', 'enteredBy'];
    const [historyData, setHistoryData] = useState([]);
    const [blocking, setBlocking] = useState(true);

    useEffect(() => {
        if (props.equipmentcode) {
            fetchData(props.equipmentcode);
        } else {
            setHistoryData([])
        }
    },[props.equipmentcode])

    const fetchData = (equipmentcode) => {
            WSEquipment.getEquipmentHistory(equipmentcode)
                .then(response => {
                    setHistoryData(response.body.data.map(line => ({
                        ...line,
                        relatedObject: (line.jobType === 'EDH')
                        ? (
                            <a
                                target="_blank"
                                href={"https://edh.cern.ch/Document/" + line.relatedObject}
                                rel="noopener noreferrer">
                                {line.relatedObject}
                            </a>
                        )
                        : line.relatedObject
                    })))
                })
                .finally(() => setBlocking(false));
    }

    const isEmptyState = !blocking && historyData.length === 0;

    const keyMap = {
        completedDate: TRANSFORM_KEYS.DATE_DD_MMM_YYYY_HH_MM
    }

    return (
        isEmptyState
        ? (
            <SimpleEmptyState message="No History to show." />
        )
        : (
            <BlockUi blocking={blocking} style={{ width: "100%" }}>
                <EISTable data={historyData}
                    headers={headers}
                    propCodes={propCodes}
                    keyMap={keyMap}
                />
            </BlockUi>
        )
    );
}

export default withCernMode(React.memo(EquipmentHistory));