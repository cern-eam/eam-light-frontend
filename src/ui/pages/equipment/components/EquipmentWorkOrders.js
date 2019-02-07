import React, {Component} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import WSEquipment from '../../../../tools/WSEquipment';
import EISTable from 'eam-components/dist/ui/components/table';


export default class EquipmentWorkOrders extends Component {

    headers = ['Work Order', 'Description', 'Status', 'Creation Date'];
    propCodes = ['number', 'desc', 'status', 'createdDate'];
    linksMap = new Map([['number', {linkType: 'fixed', linkValue: 'workorder/', linkPrefix: '/'}]]);

    state = {
        data: []
    };

    componentWillMount() {
        this.fetchData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.equipmentcode && nextProps.equipmentcode !== this.props.equipmentcode)
            this.fetchData(nextProps);
        else if (!nextProps.equipmentcode) {
            this.setState(() => ({
                data: []
            }));
        }
    }

    fetchData(props) {
        WSEquipment.getEquipmentWorkOrders(props.equipmentcode)
            .then(response => {
                response.body.data.forEach(element => {
                    // convert the dates from UNIX time to readable format
                    let date = new Date(element.createdDate);
                    let year = date.getFullYear().toString();
                    let month = (date.getMonth() + 1).toString();
                    let day = (date.getDate()).toString();

                    if (month.length < 2) month = '0' + month;
                    if (day.length < 2) day = '0' + day;

                    element.createdDate = [year, month, day].join('-');
                });

                this.setState(() => ({
                    data: response.body.data
                }))
            });
    }

    render() {
        if (this.state.data.length === 0) {
            return null;
        }

        return (
            <EISPanel heading="WORK ORDERS">
                <EISTable
                    data={this.state.data}
                    headers={this.headers}
                    propCodes={this.propCodes}
                    linksMap={this.linksMap}
                />
            </EISPanel>
        )
    }
}