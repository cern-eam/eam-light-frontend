import React, {useEffect, useState} from 'react';
import EISTable from 'eam-components/dist/ui/components/table';
import {Link} from 'react-router-dom';
import { isCernMode } from '../../components/CERNMode';
import queryString from 'query-string';
import GridRequest from '../../../tools/entities/GridRequest';
import {getGridData, transformResponse} from '../../../tools/WSGrids';

const keyMap = { storeCode: "bisstore", storeDesc: "storedesc", bin: "bisbin", lot: "bislot", qtyOnHand: "bisqty",partCode: "conditionpartcode", repairQuantity: "repairquantity", assetCode: "bisassetid" };

export function getPartStock(partCode, partOrganization) {
    let gridRequest = new GridRequest("SSPART_BIS")
    gridRequest.userFunctionName = "SSPART"
    gridRequest.addParam("partcode", partCode)
    gridRequest.addParam("partorg", partOrganization)
    return getGridData(gridRequest).then(response => transformResponse(response, keyMap))
}

function PartStock(props) {

    let headers = ['Store', 'Description', 'Bin', 'Lot', 'Qty on Hand', 'Qty for Repair', 'Asset ID'];
    let propCodes = ['storeCode', 'storeDesc', 'bin', 'lot', 'qtyOnHand', 'repairQuantity', 'assetCode'];
    let [data, setData] = useState([])

    
    let fetchData = (partCode, partOrganization) => {
        const userID = props.userData.eamAccount.employeeCode;
        if (partCode) {
            getPartStock(partCode, partOrganization)
            .then(response => {
                let stockData = response.body.data.map(line => {
                    let linkValueAsset = '/asset/';
                    const linkValueStore = `${props.applicationData.EL_TEKLI}/${line.storeCode}/issue/employee?${queryString.stringify({employee: userID, partCode: partCode,})}`;

                    const storeCodeCell = line.storeCode ?
                        isCernMode ? <a href={linkValueStore} rel="noopener noreferrer" target="_blank">{line.storeCode}</a> : line.storeCode
                        : ''
                    return {
                        ...line,
                        assetCode: line.assetCode ? <Link to={{pathname: linkValueAsset + line.assetCode}}>{line.assetCode}</Link> : '',
                        storeCode: storeCodeCell
                    }}
                );
                setData(stockData)
            }).catch(error => {
                console.log('Error loading data', error);
            });
        }
    };

    useEffect(() => {
       fetchData(props.part.code, props.part.organization);
    },[props.part.code])

    //Do not render if there is no data
    if (data.length === 0)
        return null;

    return (
        <EISTable data={data} headers={headers} propCodes={propCodes}/>
    );

}

export default PartStock;