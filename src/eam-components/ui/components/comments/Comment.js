import React, {Component} from 'react';
import './Comments.css';
import CommentUser from "./CommentUser";
import CommentBar from "./CommentBar";
import CommentAvatar from "./CommentAvatar"
import TextareaAutosize from 'react-autosize-textarea';
import ListItem from '@mui/material/ListItem';
import withStyles from '@mui/styles/withStyles';
import { FlagCheckered, PlusBoxOutline, Pencil } from 'mdi-material-ui';

import CKEditor from '@ckeditor/ckeditor5-react';

import BalloonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor';
import sanitizeHtml from 'sanitize-html';


const iconStyle = {height: 15};
const initialContainerStyle = {opacity: 1.0, pointerEvents: 'all'};

const styles = {
    root: {
        alignItems: "start",
        paddingTop: 6,
        paddingBottom: 6
    }
};

class Comment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: this.props.comment.text,
            displayBar: false,
            comment: this.props.comment,
            containerStyle: initialContainerStyle
        };
    }

    componentWillReceiveProps(nextProps) {
        this.updateState(nextProps.comment.text, false, nextProps.comment, initialContainerStyle);
    }

    inputTextArea = (event) => {
        let element = event.target;
        //Calculate display bar
        const initialText = this.state.text;
        const displayBar = element.value !== '' && initialText !== element.value;
        //The text
        let comment = this.state.comment;
        comment.text = element.value;
        this.updateState(initialText, displayBar, comment, initialContainerStyle);
    };

    showUpdating = () => {
        this.setState(() =>
            ({containerStyle: {opacity: 0.4, pointerEvents: 'none'}})
        );
    };

    updateState = (text, displayBar, comment, containerStyle) => {
        this.setState(() => ({
                text: text,
                displayBar: displayBar,
                comment: comment,
                containerStyle: containerStyle
            }
        ));
    };

    onKeyDownHandler = (event) => {
        if (event.keyCode === 13 || event.keyCode === 121) {
            event.stopPropagation();
        }
    }

    render() {
        const { allowHtml } = this.props;
        const { comment } = this.state;

        let a = allowHtml && comment && comment.text 
            && comment.text.startsWith("<html>") 
            && comment.text.endsWith("</html>")


        return (
            <ListItem classes={{root: this.props.classes.root}}>


                <CommentAvatar name={this.state.comment.creationUserCode} />

                <div className="commentContainer" style={this.state.containerStyle}>

                    <div className="triangle"/>
                    <div className="innerTriangle"/>

                        <div className="commentInfoContainer">

                            <div>
                                <CommentUser userDesc={comment.creationUserDesc}
                                             userDate={comment.creationDate}
                                             icon={<PlusBoxOutline style={iconStyle}/>}
                                />
                                {this.props.comment.updateUserCode &&
                                <CommentUser userDesc={comment.updateUserDesc}
                                             userDate={comment.updateDate}
                                             icon={<Pencil style={iconStyle}/>}
                                />}
                            </div>

                            <div style={{display: "flex", alignItems: "center", height: 25, marginRight: 7}}>
                                <CommentBar saveCommentHandler={this.props.updateCommentHandler}
                                            displayBar={this.state.displayBar} comment={comment}
                                            displayClosingCheck={false} showUpdatingHandler={this.showUpdating}/>

                                {this.props.comment.typeCode === '+' && <FlagCheckered color="primary"/>}
                            </div>
                        </div>


                    <div className="commentTextContainer" onKeyDown={this.onKeyDownHandler}>
                        {(allowHtml && comment && comment.text && comment.text.startsWith("<html>") && comment.text.endsWith("</html>")) ?
                            <div className="commentText" style={{width: '100%', height: '100%'}}>
                                <CKEditor 
                                    onInit={ editor => { console.log( 'Editor is ready to use!', editor) }}
                                    editor={ BalloonEditor }
                                    data={this.sanitizeText(comment.text)}
                                />       
                            </div>
                            :  <TextareaAutosize 
                                    defaultValue={comment.text} 
                                    className="commentText"
                                    onInput={this.inputTextArea}
                            />
                        }
                    </div>

                    {
                        this.props.commentFooter && (
                            <div className="commentFooter">
                                {this.props.commentFooter}
                            </div>
                        )
                    }
                    

                </div>


            </ListItem>
        );
    }

    sanitizeText = (text) =>        
        sanitizeHtml(text, {
            allowedTags: [ 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
                'nl', 'li', 'b', 'i', 'u', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
                'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'font', 'span'
            ],
            allowedAttributes: {
                font: [ 'color',  'style'],
                div: ['style'],
                span: ['style']
            }
        })
}




export default withStyles(styles)(Comment)