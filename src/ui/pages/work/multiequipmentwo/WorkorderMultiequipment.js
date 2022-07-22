import React, {Component} from 'react';
import WSWorkorders from '../../../../tools/WSWorkorders';
import EISTable from 'eam-components/dist/ui/components/table';
import SimpleEmptyState from 'eam-components/dist/ui/components/emptystates/SimpleEmptyState'
import BlockUi from 'react-block-ui';

export default class WorkorderMultiequipment extends Component {

    headers = ['Equipment', 'Description', 'Type'];
    propCodes = ['equipmentCode', 'equipmentDesc', 'equipmentTypeCD'];
    linksMap = new Map([['equipmentCode', {linkType: 'fixed', linkValue: 'equipment/', linkPrefix: '/'}]]);

    state = {
        data: [],
        blocking: true,
    };

    componentWillMount() {
        this.fetchData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.workorder && nextProps.workorder !== this.props.workorder)
            this.fetchData(nextProps);
        else if (!nextProps.workorder) {
            this.setState(() => ({
                data: []
            }));
        }
    }

    fetchData = (props) => {
        this.setState({ blocking: true });
        WSWorkorders.getWorkOrderEquipmentMEC(props.workorder)
            .then(response => {
                //Set type in just one field
                const data = response.body.data.map(elem => ({
                    ...elem,
                    equipmentTypeCD: `${elem.equipmentType} - ${elem.equipmentTypeDesc}`
                }));
                //Assign data
                this.setState(() => ({data}));
                if (props.setEquipmentMEC) {
                    props.setEquipmentMEC(data);
                }
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
                <SimpleEmptyState message="No Equipment to show." />
            )
            : (
                <BlockUi blocking={blocking} style={{ width: "100%" }}>
                    <EISTable
                        data={this.state.data}
                        headers={this.headers}
                        propCodes={this.propCodes}
                        linksMap={this.linksMap} />
                </BlockUi>
            )
        )
    }
}
