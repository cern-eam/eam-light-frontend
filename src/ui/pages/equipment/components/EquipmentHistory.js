import React, {Component} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import WSEquipment from '../../../../tools/WSEquipment';
import EISTable from 'eam-components/dist/ui/components/table';


export default class EquipmentHistory extends Component {

    headers = ['Date', 'Type', 'Related Value', 'Done By'];
    propCodes = ['completedDate', 'desc', 'relatedObject', 'enteredBy'];

    state = {
        historyData: []
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
        WSEquipment.getEquipmentHistory(props.equipmentcode)
            .then(response => {
                let historyData = response.body.data.map(line => ({
                    ...line,
                    relatedObject: (line.jobType === 'EDH') ? <a target="_blank" href={"https://edh.cern.ch/Document/" + line.relatedObject}>{line.relatedObject}</a> : line.relatedObject
                    })
                )

                this.setState(() => ({
                    historyData
                }))
            });
    }

    render() {
        if (this.state.historyData.length === 0) {
            return null;
        }

        return (
            <EISPanel heading="HISTORY">
                <EISTable
                    data={this.state.historyData}
                    headers={this.headers}
                    propCodes={this.propCodes}
                />
            </EISPanel>
        )
    }
}