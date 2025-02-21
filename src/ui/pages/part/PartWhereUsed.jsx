import React, {useEffect, useState} from 'react';
import EISTable from 'eam-components/dist/ui/components/table';
import GridRequest from '../../../tools/entities/GridRequest';
import { getGridData, transformResponse } from '../../../tools/WSGrids';

const keyMap = {
    entity: "epaentity_display",
    code: "code",
    description: "epadesc",
    quantity: "quantity",
    epatypeshow: "qtyOnHand"
  }

 function getPartsAssociated(partCode, partOrganization) {
    let gridRequest = new GridRequest("SSPART_EPA")
    gridRequest.userFunctionName = "SSPART"
    gridRequest.addParam("partcode", partCode)
    gridRequest.addParam("partorg", partOrganization)
    return getGridData(gridRequest).then(response => transformResponse(response, keyMap))
}

function PartWhereUsed(props) {

    let headers = ['Entity', 'Code', 'Description', 'Quantity'];
    let propCodes = ['entity', 'code', 'description', 'quantity'];
    let linksMap = new Map([['code', {linkType: 'prop', linkValue: 'link', linkPrefix: '/'}]]);
    let [data, setData] = useState([]);

    useEffect(() => {
        fetchData(props.part.code, props.part.organization);
    }, [props.part.code])

    let fetchData = (partCode, partOrganization) => {
        if (partCode) {
            getPartsAssociated(partCode, partOrganization)
             .then(response => {
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