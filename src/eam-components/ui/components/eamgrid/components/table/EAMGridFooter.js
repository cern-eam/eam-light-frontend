import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import EAMGridExporter from './EAMGridExporter';

const styles = {
    footerStyle: {
        backgroundColor: '#fafafa',
        padding: '10px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
};

class DataGridFooter extends Component {

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.footerStyle}>
                <div>
                    { `Records: ${this.props.rows.length} of ${this.props.totalRecords}` }
                </div>

                <EAMGridExporter exporterBlocked={this.props.exporterBlocked}
                                 exportData={this.props.exportData}/>
            </div>
        );
    }
}

export default withStyles(styles)(DataGridFooter);