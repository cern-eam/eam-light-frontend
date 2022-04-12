import React, { Component } from 'react';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import SaveIcon from '@mui/icons-material/Save';
import { FlagCheckered, Lock } from 'mdi-material-ui';

const notClosingButtonStyle = {
    backgroundColor: '#e0e0e0',
};

const saveIconStyle = {
    width: 16,
    height: 16,
    marginRight: 5,
};

const optionIconStyle = {
    width: 18,
    height: 18,
    margin: '0 5px',
};

class CommentBar extends Component {
    state = {
        isClosing: false,
        isPrivate: false,
        closingButtonStyle: notClosingButtonStyle,
    };

    barCommentSaveHandler = () => {
        //Show updating
        this.props.showUpdatingHandler();
        //Comment to be saved
        let comment = this.props.comment;
        //Set the closing
        if (this.state.isClosing) {
            comment.typeCode = '+';
        } else if (this.state.isPrivate) {
            comment.typeCode = 'P';
        }
        //Update the closing
        this.setState(() => ({
            isClosing: false,
            isPrivate: false,
            closingButtonStyle: notClosingButtonStyle,
        }));
        //Save the comment with the method received
        this.props.saveCommentHandler(comment);
    };

    render() {
        if (this.props.displayBar) {
            return (
                <div className="commentBarContainer">
                    <Button disableElevation onClick={this.barCommentSaveHandler} color="primary">
                        <SaveIcon style={saveIconStyle} /> Save
                    </Button>
                    {this.props.displayPrivateCheck && (
                        <FormControlLabel
                            style={{ height: 22, marginRight: -5 }}
                            control={
                                <Checkbox
                                    color="primary"
                                    icon={<Lock style={optionIconStyle} />}
                                    checkedIcon={<Lock style={optionIconStyle} />}
                                    checked={this.state.isPrivate}
                                    onChange={(event, checked) => this.setState({ isPrivate: checked })}
                                    title="Private comment"
                                />
                            }
                        />
                    )}

                    {this.props.displayClosingCheck && (
                        <FormControlLabel
                            style={{ height: 22, marginRight: -5 }}
                            control={
                                <Checkbox
                                    color="primary"
                                    icon={<FlagCheckered style={optionIconStyle} />}
                                    checkedIcon={<FlagCheckered style={optionIconStyle} />}
                                    checked={this.state.isClosing}
                                    onChange={(event, checked) => this.setState({ isClosing: checked })}
                                    title="Closing"
                                />
                            }
                        />
                    )}
                </div>
            );
        }
        return null;
    }
}

export default CommentBar;
