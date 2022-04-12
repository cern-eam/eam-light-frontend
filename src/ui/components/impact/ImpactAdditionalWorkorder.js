import React, {Component} from 'react';
import EAMGrid from 'eam-components/ui/components/eamgrid';

class ImpactAdditionalWorkorder extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    onSelectRow = (row, checked, selectedRows) => {
        this.props.selectAdditionalWorkorders(selectedRows);
    };

    _isRowSelectable = (row, selectedRecords) => {
        return true;
    };

    render() {

        return (
            <div style={{marginTop:70,height:'calc(100% - 80px)'}}>
                <EAMGrid
                    gridId={this.props.workOrderScreen.gridId}
                    screenCode={this.props.workOrderScreen.screenCode}
                    handleError={this.props.handleError}
                    allowRowSelection={true}
                    isRowSelectable={this._isRowSelectable}
                    onSelectRow={this.onSelectRow}
                />
            </div>
        )
    }

}

export default ImpactAdditionalWorkorder;