import React, {Component} from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {withStyles} from "@material-ui/core/styles/index";

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
                            disableUnderline={true}
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