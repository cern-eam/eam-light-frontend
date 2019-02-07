import React, {Component} from 'react';
import Icon from '@material-ui/core/Icon';
import EAMGrid from 'eam-components/dist/ui/components/eamgrid';

class ImpactActGrid extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    selectRow = row => () => {
        const activityIds = row.cell.filter(c => c.t === 'activity_id');
        if (activityIds) {
            const activityId = activityIds[0]['value'];
            this.props.attachToExistingActivity(activityId);
        }
    };

    _cellRenderer = (cell, row) => {
        if (cell.t === 'selectAction') {
            return (
                <Icon onClick={this.selectRow(row)}
                      color="secondary"
                      style={{cursor:'pointer'}}
                >
                    add_circle
                </Icon>
            );
        }
        return false;
    };

    render() {
        const data = this.props.applicationData;
        return (
            <div style={{marginTop:70,height:'calc(100% - 80px)'}}>
                <EAMGrid
                    gridId={data.existingImpactActivitiesGridId}
                    screenCode={data.existingImpactActivitiesGridName}
                    handleError={this.props.handleError}
                    cellRenderer={this._cellRenderer}
                    extraColumns={[
                        {
                            width: '50px',
                            headerLabel: '',
                            t: 'selectAction'
                        }]}
                />
            </div>
        )
    }

}

export default ImpactActGrid;