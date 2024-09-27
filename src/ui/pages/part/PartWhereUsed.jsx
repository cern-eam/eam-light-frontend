import React, {useEffect, useState} from 'react';
import WSParts from "../../../tools/WSParts";
import EISTable from 'eam-components/dist/ui/components/table';

function PartWhereUsed(props) {

    let headers = ['Entity', 'Code', 'Description', 'Quantity'];
    let propCodes = ['entity', 'code', 'description', 'quantity'];
    let linksMap = new Map([['code', {linkType: 'prop', linkValue: 'link', linkPrefix: '/'}]]);
    let [data, setData] = useState([]);

    useEffect(() => {
        fetchData(props.part.code);
    }, [props.part.code])

    let fetchData = (partCode) => {
        if (partCode) {
            WSParts.getPartWhereUsed(partCode).then(response => {
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
        <EISTable
            data={data}
            headers={headers}
            propCodes={propCodes}
            linksMap={linksMap} />
    );
}

export default PartWhereUsed;