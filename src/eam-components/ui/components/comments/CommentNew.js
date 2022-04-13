import React, {Component} from 'react';
import './Comments.css';
import CommentBar from "./CommentBar";
import CommentAvatar from "./CommentAvatar"
import TextareaAutosize from 'react-autosize-textarea';
import ListItem from '@mui/material/ListItem';
import withStyles from '@mui/styles/withStyles';

const initialContainerStyle = {opacity: 1.0, pointerEvents: 'all'};

const styles = {
    root: {
        alignItems: "start",
        paddingTop: 6,
        paddingBottom: 6
    }
};

class CommentNew extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayBar: false,
            comment: this.initNewComment(this.props),
            containerStyle: initialContainerStyle
        };
    }

    componentWillReceiveProps(nextProps) {
        //Display bar
        const displayBar = nextProps.newCommentText !== '' && !!this.props.entityKeyCode;
        this.updateState(displayBar, this.initNewComment(nextProps), initialContainerStyle);
    }

    initNewComment = (props) => {
        return {
            entityCode: this.props.entityCode,
            entityKeyCode: this.props.entityKeyCode,
            text: props.newCommentText
        };
    };

    inputTextArea = (event) => {
        let element = event.target;
        const displayBar = element.value !== '' && !!this.props.entityKeyCode;
        //The text
        let comment = this.state.comment;
        comment.text = element.value;
        this.updateState(displayBar, comment);
        //Value
        this.props.updateNewCommentText(comment.text);
    };

    showUpdating = () => {
        this.setState(() => ({
            containerStyle: {opacity: 0.4, pointerEvents: 'none'}
        }));
    };

    updateState = (displayBar, comment, containerStyle) => {
        this.setState(() => ({
            displayBar,
            comment,
            containerStyle
        }));
    };

    onKeyDownHandler = (event) => {
        if (event.keyCode === 13 || event.keyCode === 121) {
            event.stopPropagation();
        }
    }

    render() {
        const { disabled } = this.props;
        const placeholder = disabled ? 'Commenting is disabled' : 'Enter new comment here';
        return (
            <ListItem classes={{root: this.props.classes.root}}>

                <CommentAvatar name={this.props.userCode} />

                <div className="commentContainer" style={this.state.containerStyle}>

                    <div className="triangle"/>
                    <div className="innerTriangle"/>

                        {this.state.displayBar &&
                        <div className="commentInfoContainer">

                            <div style={{height: 20}}></div>

                            <CommentBar saveCommentHandler={this.props.createCommentHandler}
                                        displayBar={this.state.displayBar}
                                        comment={this.state.comment}
                                        displayClosingCheck={this.props.entityCode === 'EVNT'}
                                        displayPrivateCheck={this.props.displayPrivateCheck}
                                        showUpdatingHandler={this.showUpdating}/>
                        </div>}

                    <div className="commentTextContainer" onKeyDown={this.onKeyDownHandler}>
                        <TextareaAutosize placeholder={placeholder}
                                          className="commentText" onInput={this.inputTextArea}
                                          value={this.props.newCommentText}
                                          onFocus={this.inputTextArea}
                                          disabled={disabled} />
                    </div>

                </div>

            </ListItem>
        );
    }
}

export default withStyles(styles)(CommentNew)