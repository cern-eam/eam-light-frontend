import React, {Component} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import WSWorkorders from '../../../../tools/WSWorkorders';
import EISTable from 'eam-components/dist/ui/components/table';


export default class WorkorderChildren extends Component {

    headers = ['Child WO', 'Description', 'Equipment', 'Status', 'Type'];
    propCodes = ['number', 'description', 'equipment', 'status', 'type'];
    linksMap = new Map([['number', {linkType: 'fixed', linkValue: 'workorder/', linkPrefix: '/'}],
        ['equipment', {linkType: 'fixed', linkValue: 'equipment/', linkPrefix: '/'}]
    ]);

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
        WSWorkorders.getChildrenWorkOrder(props.workorder)
            .then(response => {
                //Assign data
                this.setState(() => ({data: response.body.data}));
            });
    };

    render() {
        if (this.state.data.length === 0) {
            return null;
        }

        return (
            <EISPanel heading="CHILD WORK ORDERS">
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
