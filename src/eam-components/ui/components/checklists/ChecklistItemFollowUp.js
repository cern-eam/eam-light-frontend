import React, {Component} from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Link } from 'react-router-dom';

export default class ChecklistItemFollowUp extends Component {

    mainStyle = {
        flex: "1",
        display: "flex",
        marginLeft: 10
    }

    followUpWOCodeStyle = {
        paddingLeft: '8px', 
        paddingRight: '16px',
        fontSize: '12px'
    }

    handleChange = event => {
        // invert the input since we are using an onMouseDown/onTouchStart handler, before the input is changed
        this.props.onChange({
            ...this.props.checklistItem,
            followUp: !event.target.checked
        })
    }

    render() {
        let { checklistItem, getWoLink } = this.props;
        return (
            <div style={{padding: 2}}>
                <div style={this.mainStyle}>
                    <FormControlLabel
                        control={
                            checklistItem.followUpWorkOrder ? 
                            <div style={this.followUpWOCodeStyle}>
                                <Link to={getWoLink(checklistItem.followUpWorkOrder)} target="_blank">
                                    {checklistItem.followUpWorkOrder} 
                                </Link>
                            </div> :
                            <Checkbox
                                color="primary"
                                checked={checklistItem.followUp === '+' || checklistItem.followUp === true}
                                disabled={Boolean(checklistItem.followUpWorkOrder)}
                                onMouseDown={this.handleChange}
                                onTouchStart={this.handleChange}
                                disabled={this.props.disabled} />
                        }
                        labelPlacement='start'
                        label={"Follow-up"}
                    />
                </div>
            </div>
        )
    }
}
