import React, {useEffect, useState} from 'react';
import WSParts from '../../../tools/WSParts'
import EISTable from 'eam-components/ui/components/table';
import {Link} from 'react-router-dom';
import { isCernMode } from '../../components/CERNMode';

function PartStock(props) {

    let headers = ['Store', 'Description', 'Bin', 'Lot', 'Qty on Hand', 'Qty for Repair', 'Asset ID'];
    let propCodes = ['storeCode', 'storeDesc', 'bin', 'lot', 'qtyOnHand', 'repairQuantity', 'assetCode'];
    let [data, setData] = useState([])

    let fetchData = (partCode) => {
        const userID = props.userData.eamAccount.employeeCode;
        if (partCode) {
            WSParts.getPartStock(partCode).then(response => {
                let stockData = response.body.data.map(line => {
                    let linkValueAsset = '/asset/';
                    const linkValueStore = `/SSO/kiosk/${line.storeCode}/issue/employee?employee=${userID}&partCode=${partCode}`;

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
       fetchData(props.part.code);
    },[props.part.code])

    //Do not render if there is no data
    if (data.length === 0)
        return null;

    return (
        <EISTable data={data} headers={headers} propCodes={propCodes}/>
    );

}

export default PartStock;