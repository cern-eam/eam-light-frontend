import React, {Component} from 'react';
import WSParts from '../../../tools/WSParts'
import EISTable from 'eam-components/dist/ui/components/table';
import EISPanel from 'eam-components/dist/ui/components/panel';
import {Link} from 'react-router-dom';

class PartStock extends Component {

    linkRenderer = (propCode, content) => {
        const userID = this.props.userData.eamAccount.cernId;
        const partCode = this.props.part.code;
        const linkValue = `/SSO/kiosk/${content[propCode]}/issue/employee?employee=${userID}&partCode=${partCode}`;
        console.log('linkRenderer ', linkValue);
        return (<a href={linkValue}
                   rel="noopener noreferrer"
                   target="_blank">{content[propCode]}</a>);
    };

    headers = ['Store', 'Description', 'Bin', 'Lot', 'Qty on Hand', 'Qty for Repair', 'Asset ID'];
    propCodes = ['storeCode', 'storeDesc', 'bin', 'lot', 'qtyOnHand', 'repairQuantity', 'assetCode'];

    state = {
        data: []
    };

    componentWillMount() {
        this.fetchData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.part.code && nextProps.part.code !== this.props.part.code)
            this.fetchData(nextProps);
        else if (!nextProps.part.code) {
            this.setState(() => ({
                data: []
            }));
        }
    }

    fetchData = (props) => {
        let partCode = props.part.code;
        const userID = this.props.userData.eamAccount.cernId;
        if (partCode) {
            WSParts.getPartStock(partCode).then(response => {
                let stockData = response.body.data.map(line => {
                    let linkValueAsset = '/asset/';
                    const linkValueStore = `/SSO/kiosk/${line.storeCode}/issue/employee?employee=${userID}&partCode=${partCode}`;
                    return {
                        ...line,
                        assetCode: line.assetCode ? <Link to={{pathname: linkValueAsset + line.assetCode}}>{line.assetCode}</Link> : '',
                        storeCode: line.storeCode ? <a href={linkValueStore} rel="noopener noreferrer" target="_blank">{line.storeCode}</a> : ''
                    }}
                );
                this.setState(() => ({
                    data: stockData
                }));
            }).catch(error => {
                console.log('Error loading data', error);
            });
        }
    };

    render() {
        //Do not render if there is no data
        if (this.state.data.length === 0)
            return null;

        return (
            <EISPanel heading="PART STOCK">
                <EISTable data={this.state.data} headers={this.headers} propCodes={this.propCodes}/>
            </EISPanel>
        );
    }
}

export default PartStock;