import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import DownloadLink from "react-download-link";
import BlockUi from 'react-block-ui';

const styles = {
    button: {
        background: 'rgba(0, 0, 0, 0)',
        border: '10px',
        cursor: 'pointer',
        fontFamily: 'Roboto, sans-serif',
        height: '36px',
        '&:hover': {
            background: 'rgba(153,153,153,0.2)',
            border: '10px'
        },
        '&:focus': {
            border: 'none',
            outline: 'none'
        }
    },
};

class EAMGridExporter extends Component {

    render() {
        const { classes } = this.props;

        return (
            <BlockUi tag="div" blocking={this.props.exporterBlocked}>
                <DownloadLink
                    color="primary" className={classes.button}
                    filename="exported_data.csv"
                    label="Export to CSV"
                    exportFile={this.props.exportData}
                    style={{textDecoration: 'none'}}
                    tagName="button"
                >
                </DownloadLink>
            </BlockUi>
        );
    }
}

export default withStyles(styles)(EAMGridExporter);