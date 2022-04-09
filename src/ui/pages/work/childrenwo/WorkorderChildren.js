import React, {Component} from 'react';
import WSWorkorders from '../../../../tools/WSWorkorders';
import EISTable from 'eam-components/ui/components/table';
import SimpleEmptyState from 'eam-components/ui/components/emptystates/SimpleEmptyState'
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
        const isEmptyState = this.state.data.length === 0;

        return (
            isEmptyState
            ? <SimpleEmptyState message="No Child Work Orders to show."/>
            : (
                <EISTable
                    data={this.state.data}
                    headers={this.headers}
                    propCodes={this.propCodes}
                    linksMap={this.linksMap}
                />
            )
        )
    }
}
