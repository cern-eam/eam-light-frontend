import React, {Component} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import WSWorkorders from '../../../../tools/WSWorkorders';
import EISTable from 'eam-components/dist/ui/components/table';


export default class WorkorderMultiequipment extends Component {

    headers = ['Equipment', 'Description', 'Type'];
    propCodes = ['equipmentCode', 'equipmentDesc', 'equipmentTypeCD'];
    linksMap = new Map([['equipmentCode', {linkType: 'fixed', linkValue: 'equipment/', linkPrefix: '/'}]]);

    state = {
        data: []
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
        WSWorkorders.getWorkOrderEquipmentMEC(props.workorder)
            .then(response => {
                //Set type in just one field
                const data = response.body.data.map(elem => ({
                    ...elem,
                    equipmentTypeCD: `${elem.equipmentType} - ${elem.equipmentTypeDesc}`
                }));
                //Assign data
                this.setState(() => ({data}));
            });
    };

    render() {
        if (this.state.data.length === 0) {
            return null;
        }

        return (
            <EISPanel heading="EQUIPMENT">
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
