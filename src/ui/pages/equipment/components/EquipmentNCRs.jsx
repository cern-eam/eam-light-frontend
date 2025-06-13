import React, {useEffect, useState} from 'react';
import EISTable from 'eam-components/dist/ui/components/table';
import WSNCRs from '../../../../tools/WSNCRs';
import SimpleEmptyState from 'eam-components/dist/ui/components/emptystates/SimpleEmptyState'

function AssetNCRs({equipment}) {

    let headers = ['NCR', 'Description', 'Status', 'Severity'];
    let propCodes = ['nonconformity', 'description', 'status_display', 'severity_display'];
    let linksMap = new Map([['nonconformity', {linkType: 'fixed', linkValue: 'ncr/', linkPrefix: '/'}]]);
    let [data, setData] = useState(null);

    useEffect(() => {
        fetchData(equipment);
    }, [equipment])

    let fetchData = (equipment) => {
        if (equipment) {
            WSNCRs.getEquipmentNonConformities(equipment).then(response => {
                setData(response.body.data);
            }).catch(error => {
                console.log('Error loading data', error);
            });
        }
    };

    if (!data) {
        return <SimpleEmptyState message="Loading..."/>;
    }

    if (data.length === 0) {
        return <SimpleEmptyState message="No NCRs to show."/>;
    }

    return (
        <EISTable
            data={data}
            headers={headers}
            propCodes={propCodes}
            linksMap={linksMap} />
    );
}

export default AssetNCRs;