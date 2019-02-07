import React, {Component} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import WSEquipment from '../../../../tools/WSEquipment';
import EISTable from 'eam-components/dist/ui/components/table';

export default class EquipmentPartsAssociated extends Component {

    headers = ['Code', 'Description', 'Quantity', 'UOM'];
    propCodes = ['partCode', 'partDesc', 'quantity', 'uom'];
    linksMap = new Map([['partCode', {linkType: 'fixed', linkValue: 'part/', linkPrefix: '/'}]]);

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

    fetchData = (props) => {
        WSEquipment.getEquipmentPartsAssociated(props.equipmentcode, props.parentScreen)
            .then(response => {
                this.setState(() => ({
                    data: response.body.data
                }))
            });
    };

    render() {
        if (this.state.data.length === 0) {
            return null;
        }

        return (
            <EISPanel heading="PARTS ASSOCIATED">
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