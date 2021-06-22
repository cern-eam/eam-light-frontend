import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {ArrowUpBoldBox} from 'mdi-material-ui';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {withStyles} from '@material-ui/core/styles';
import TreeIcon from './TreeIcon';

const ITEM_HEIGHT = 48;

const styles = theme => ({
    root: {
      width: 30,
      height: 30,
      marginLeft: '-20px',
      marginTop: '-45px'
    },
    menuItem: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& $primary, & $icon': {
                color: theme.palette.common.white,
            },
        },
    },
    primary: {},
    icon: {},
});

class TreeSelectParent extends React.Component {
  state = {
    anchorEl: null,
    options: this.props.parents
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = (option) => {
    this.setState({ anchorEl: null });
    if(option && option.parentCode && option.parentType !== 'L') {
        this.props.reloadData(option.parentCode);
    }
  };

  componentWillReceiveProps(nextProps) {
    this.setState(() => ({
        options: nextProps.parents
    }));
  }

  render() {
    const { anchorEl } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <IconButton
          className={classes.root}
          aria-label="More"
          aria-owns={anchorEl ? 'long-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <ArrowUpBoldBox />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={this.state.anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => this.handleClose()}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5
            },
          }}
        >
          {this.state.options.map(option => (
            <MenuItem key={option.parentCode} onClick={() => this.handleClose(option)}
                      disabled={option.parentType === 'L'}>
                <ListItemIcon className={classes.icon}>
                    <TreeIcon
                        eqtype={option.parentType}
                        style={{
                            width: 15,
                            height: 15,
                            marginRight: 5,
                            marginTop: 6,
                            color: '#282828'
                        }}
                    />
                </ListItemIcon>
                <ListItemText classes={{ primary: classes.primary }}
                              style={{padding: 0}}
                              inset primary={option.parentCode} />
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

export default withStyles(styles)(TreeSelectParent);
