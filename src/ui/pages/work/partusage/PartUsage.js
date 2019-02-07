import React, {Component} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import WSWorkorders from "../../../../tools/WSWorkorders";
import EISTable from 'eam-components/dist/ui/components/table';
import Button from '@material-ui/core/Button';
import PartUsageDialog from "./PartUsageDialog";
import BlockUi from 'react-block-ui';


const buttonStyle = {
    position: 'relative',
    float: 'left',
    bottom: '-13px',
    left: '5px',
};

class PartUsage extends Component {

    headers = ['Transaction', 'Part', 'Activity', 'Store', 'Quantity'];
    propCodes = ['transType', 'partCode', 'activity', 'storeCode', 'quantity'];
    linksMap = new Map([['partCode', {linkType: 'fixed', linkValue: 'part/', linkPrefix: '/'}]]);

    state = {
        data: [],
        isDialogOpen: false,
        isLoading: false
    };

    children = {};

    componentWillMount() {
        this.fetchData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.workorder.number && nextProps.workorder.number !== this.props.workorder.number)
            this.fetchData(nextProps);
        else if (!nextProps.workorder.number) {
            this.setState(() => ({
                data: []
            }));
        }
    }

    fetchData = (props) => {
        this.setState(() => ({isLoading: true}));
        let woNumber = props.workorder.number;
        if (woNumber) {
            WSWorkorders.getPartUsageList(woNumber).then(response => {
                this.setState(() => ({
                    data: response.body.data,
                    isLoading: false
                }));
            }).catch(error => {
                this.props.handleError(error);
                this.setState(() => ({isLoading: false}));
            });
        }
    };

    openPartUsageDialog = () => {
        this.setState(() => ({isDialogOpen: true}));
    };

    closePartUsageDialog = () => {
        this.setState(() => ({isDialogOpen: false}));
    };

    handleAddPartUsage = (partUsage, partUsageLine) => {
        //Validate fields first
        if (!this.validateFields()) {
            this.props.showError('Please fill all the required fields');
            return;
        }
        this.setState(() => ({isLoading: true}));
        //Set the part usage Line
        partUsage.transactionlines = [partUsageLine];
        //Remove transaction info prop
        delete partUsage.transactionInfo;
        //Save the record
        WSWorkorders.createPartUsage(partUsage).then(response => {
            //Notification
            this.props.showNotification('Part usage created successfully');
            //Close dialog
            this.closePartUsageDialog();
            //Init the list of part usage again
            this.fetchData(this.props);
            this.setState(() => ({isLoading: false}));
        }).catch(error => {
            this.props.handleError(error);
            this.setState(() => ({isLoading: false}));
        });
    };

    validateFields = () => {
        let validationPassed = true;
        Object.keys(this.children).forEach(key => {
            if (!this.children[key].validate()) {
                validationPassed = false;
            }
        });
        return validationPassed;
    };

    render() {

        return (
            <EISPanel heading="PART USAGE">
                {this.state.isLoading ? <BlockUi tag="div" blocking={this.props.isLoading}>
                        <div>Loading Part usage...</div>
                    </BlockUi> :
                    <div style={{width: '100%', height: '100%'}}>
                        <EISTable data={this.state.data} headers={this.headers} propCodes={this.propCodes}
                                  linksMap={this.linksMap}/>
                        <Button onClick={this.openPartUsageDialog} color="primary" style={buttonStyle}>
                            Add Part Usage
                        </Button>
                    </div>}
                <PartUsageDialog handleSave={this.handleAddPartUsage}
                                 showNotification={this.props.showNotification}
                                 handleError={this.props.handleError}
                                 handleCancel={this.closePartUsageDialog} tabLayout={this.props.tabLayout}
                                 isDialogOpen={this.state.isDialogOpen} workorder={this.props.workorder}
                                 isLoading={this.state.isLoading}
                                 children={this.children}/>
            </EISPanel>
        )
    }
}

export default PartUsage;