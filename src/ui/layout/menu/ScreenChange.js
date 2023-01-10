import React, {Component} from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import withStyles from '@mui/styles/withStyles';

const styles = {
    root: {
        marginLeft: 10
    },
    icon: {
        color: 'white'
    },
};

class ScreenChange extends Component {


    handleScreenChange = (event) => {
        this.props.updateScreenLayout(event.target.value)
    };

    render() {
        return (
            <div style={{display: "flex", justifyContent: "center"}}>
                <FormControl>
                    <Select style={{color: "white"}}
                            classes={{
                                root: this.props.classes.root,
                                icon: this.props.classes.icon
                            }}
                            value={this.props.screen}
                            onChange={this.handleScreenChange.bind(this)}
                    >
                    {this.props.screens.map(screen => (
                        <MenuItem key={screen.screenCode} value={screen.screenCode}>{screen.screenDesc}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </div>
        )

    }
}

export default withStyles(styles)(ScreenChange);