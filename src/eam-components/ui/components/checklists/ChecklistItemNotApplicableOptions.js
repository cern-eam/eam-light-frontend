import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';

const style = {
    root: {
        margin: 5,
        marginLeft: 17,
        border: "1px solid #ced4da",
        borderRadius: 4
    },
    selectRoot: {
        fontSize: "0.95rem"
    },
    select: {
        paddingLeft: 10,
        width: 128,
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    icon: {
        paddingRight: 3
    }
}

const firstLine = {
    display: "flex",
    alignItems: "stretch",
    minHeight: 48,
    justifyContent: 'space-between',
    flexWrap: 'wrap'
};

const firstLineDesc = {
    float: "left",
    display: "flex",
    alignItems: "center",
    pointerEvents: "initial",
    color: "rgba(0, 0, 0, 0.87)"
};

const rowStyle = {
    flex: "0 0 186px",
    display: "flex",
    position: "relative",
    marginLeft: "auto",
    flexDirection: "column"
}

const ChecklistItemNotApplicableOptions = props => {
    const { notApplicableOptions, checklistItem, onChange, classes, disabled } = props;

    return <div style={firstLine}>
        <div style={firstLineDesc}>
            <CancelIcon style={{ marginRight: '5px', color: 'rgb(206, 206, 206)'}} />
            <label>Not Applicable Option</label>
        </div>
        <div style={rowStyle}>
            <FormControl classes={{root: classes.root}}>
                <Select classes={{root: classes.selectRoot, select: classes.select, icon: classes.icon}}
                        disableUnderline={true}
                        value={checklistItem.notApplicableOption || ''}
                        disabled={disabled}
                        onChange={event => onChange({
                            ...checklistItem,
                            notApplicableOption: event.target.value
                        })}>
                    <MenuItem value={''}>&#8203;</MenuItem>
                    {notApplicableOptions.map(option => (
                        <MenuItem key={option.code} value={option.code}>{option.desc}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    </div>;
};

export default withStyles(style)(ChecklistItemNotApplicableOptions);