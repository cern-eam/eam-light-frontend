import {useEffect, useState} from 'react';
import EISTable from 'eam-components/dist/ui/components/table';
import GridRequest, { GridTypes } from '../../../tools/entities/GridRequest';
import { getGridData, transformResponse } from '../../../tools/WSGrids';

const keyMap = {
    entity: "epaentity_display",
    code: "code",
    description: "epadesc",
    quantity: "quantity",
    epatypeshow: "qtyOnHand"
  }

 function getPartsAssociated(partCode, partOrganization) {
    let gridRequest = new GridRequest("SSPART_EPA", GridTypes.LIST, "SSPART")
    gridRequest.addParam("partcode", partCode)
    gridRequest.addParam("partorg", partOrganization)
    return getGridData(gridRequest).then(response => transformResponse(response, keyMap))
}

function PartWhereUsed(props) {

    let headers = ['Entity', 'Code', 'Description', 'Quantity'];
    let propCodes = ['entity', 'code', 'description', 'quantity'];
    let linksMap = new Map([['code', {linkType: 'prop', linkValue: 'redirectLink', linkPrefix: '/'}]]);
    let [data, setData] = useState([]);

    useEffect(() => {
        fetchData(props.id.code, props.id.org);
    }, [props.id])

    let fetchData = (partCode, partOrganization) => {
        if (partCode) {
            getPartsAssociated(partCode, partOrganization)
             .then(response => {
                        let modifiedData = response.body.data.map(item => ({
                    ...item,
                    redirectLink: item.entity ? `${item.entity.toLowerCase()}/${item.code}`: item.code
                }));
                setData(modifiedData);
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