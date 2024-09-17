import React, {Component} from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FontIcon from '@mui/material/Icon';

export default class InfoPage extends Component
{
    mainDivStyle = {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#fafafa"
    }

    fontIconStyle = {
        fontSize: 30,
        color: "darkblue",
        margin: 10
    }

    paperStyle = {
        padding: 15,
        margin: 10
    }

    render()
    {
        return (
            (
                <div style={this.mainDivStyle}>
                    <Paper style={this.paperStyle}>
                        <Typography type="headline" component="h3">
                            <FontIcon style={this.fontIconStyle} className="fa fa-user-times" />
                            {this.props.title}
                        </Typography>
                        <Typography component="p">
                            {this.props.message}
                        </Typography>
                    </Paper>
                </div>
            )
        )
    }
}

