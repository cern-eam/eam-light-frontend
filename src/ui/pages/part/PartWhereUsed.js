import React, {Component} from 'react';
import WSParts from "../../../tools/WSParts";
import EISTable from 'eam-components/dist/ui/components/table';
import EISPanel from 'eam-components/dist/ui/components/panel';

class PartWhereUsed extends Component {

    headers = ['Entity', 'Code', 'Description', 'Quantity'];
    propCodes = ['entity', 'code', 'description', 'quantity'];
    linksMap = new Map([['code', {linkType: 'prop', linkValue: 'link', linkPrefix: '/'}]]);

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
        if (partCode) {
            WSParts.getPartWhereUsed(partCode).then(response => {
                this.setState(() => ({
                    data: response.body.data
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
            <EISPanel heading="WHERE USED">
                <EISTable data={this.state.data} headers={this.headers} propCodes={this.propCodes}
                          linksMap={this.linksMap}/>
            </EISPanel>
        );
    }
}

export default PartWhereUsed;