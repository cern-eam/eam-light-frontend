import React, {useEffect, useState} from 'react';
import EISTable from 'eam-components/dist/ui/components/table';
import WSNCRs from '../../../../tools/WSNCRs';

function AssetNCRs({assetCode}) {

    let headers = ['NCR', 'Description', 'Status', 'Severity'];
    let propCodes = ['nonconformity', 'description', 'status_display', 'severity_display'];
    let linksMap = new Map([['nonconformity', {linkType: 'fixed', linkValue: 'ncr/', linkPrefix: '/'}]]);
    let [data, setData] = useState([]);

    useEffect(() => {
        fetchData(assetCode);
    }, [assetCode])

    let fetchData = (assetCode) => {
        if (assetCode) {
            WSNCRs.getAssetNonConformities(assetCode).then(response => {
                setData(response.body.data);
            }).catch(error => {
                console.log('Error loading data', error);
            });
        }
    };

    //Do not render if there is no data
    if (data.length === 0)
        return null;

    return (
        <div style={{padding: 15, width: "100%"}}>
            <EISTable
                data={data}
                headers={headers}
                propCodes={propCodes}
                linksMap={linksMap} />
        </div>
    );
}

export default AssetNCRs;