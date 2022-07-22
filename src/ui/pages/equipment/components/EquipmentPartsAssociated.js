import React, {Component} from 'react';
import WSEquipment from '../../../../tools/WSEquipment';
import EISTable from 'eam-components/dist/ui/components/table';
import SimpleEmptyState from 'eam-components/dist/ui/components/emptystates/SimpleEmptyState'
import BlockUi from 'react-block-ui';
export default class EquipmentPartsAssociated extends Component {

    headers = ['Code', 'Description', 'Quantity', 'UOM'];
    propCodes = ['partCode', 'partDesc', 'quantity', 'uom'];
    linksMap = new Map([['partCode', {linkType: 'fixed', linkValue: 'part/', linkPrefix: '/'}]]);

    state = {
        data: [],
        blocking: true,
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
        this.setState({ blocking: true });
        WSEquipment.getEquipmentPartsAssociated(props.equipmentcode, props.parentScreen)
            .then(response => {
                this.setState(() => ({
                    data: response.body.data
                }))
            })
            .finally(() => {
                this.setState({ blocking: false })
            });
    };

    render() {
        const { blocking, data } = this.state;
        const isEmptyState = !blocking && data.length === 0;

        return (
            isEmptyState
            ? (
                <SimpleEmptyState message="No Parts to show." />
            )
            : (
                <BlockUi blocking={blocking} style={{ width: "100%" }}>
                    <EISTable
                        data={this.state.data}
                        headers={this.headers}
                        propCodes={this.propCodes}
                        linksMap={this.linksMap}
                    />
                </BlockUi>
            )
        )
    }
}