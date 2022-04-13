import React, {Component, Fragment} from 'react';
import withStyles from '@mui/styles/withStyles';
import Button from '@mui/material/Button';
import CheckBox from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlank from '@mui/icons-material/CheckBoxOutlineBlank';

const styles = {
  actionBar: {
    '& > button': {
      marginRight: "10px"
    }
  }
};

/**
 * Action bar on top of the grid
 */
class DataGridActions extends Component {

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.actionBar}>
              {this.props.selectButtons &&
                <Fragment>
                  <Button variant="raised"
                          color="secondary"
                          size="small"
                          onClick={this.props.onSelectAll}
                  >
                    <CheckBox/>Select all
                  </Button>

                  <Button variant="raised"
                          color="secondary"
                          size="small"
                          onClick={this.props.onUnselectAll}
                  >
                    <CheckBoxOutlineBlank/>Unselect all
                  </Button>
                </Fragment>
              }
            </div>
        );
    }
}

export default withStyles(styles)(DataGridActions);