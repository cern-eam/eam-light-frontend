import React, {Component} from 'react';
import WSComments from "../../../tools/WSComments";
import Comment from "./Comment";
import CommentNew from "./CommentNew";
import EISPanel from '../panel';
import List from '@material-ui/core/List';
import PropTypes from "prop-types";

const datatablePanelStyle = {
    marginLeft: -18,
    marginRight: -18,
    marginBottom: -22,
};

class Comments extends Component {

    state = {
        comments: [],
        newCommentText: ''
    };

    componentWillMount() {
        //Just read for existing object
        if (this.props.entityKeyCode)
            this.readComments(this.props.entityCode, this.props.entityKeyCode);
    }

    componentDidUpdate(prevProps) {
        //Just read for existing object
        if ((prevProps.entityKeyCode !== this.props.entityKeyCode || prevProps.entityCode !== this.props.entityCode)
            && this.props.entityKeyCode) {
            //Just read the comments
            this.readComments(this.props.entityCode, this.props.entityKeyCode);
        } else if (prevProps.entityKeyCode && !this.props.entityKeyCode) { /*It's new object again*/
            this.setState(() => ({comments: [], newCommentText: ''}));
        }
    }

    readComments = (entityCode, entityKeyCode) => {
        this.props.readComments(entityCode, entityKeyCode).then(response => {
            this.setState(() =>
                ({comments: response.body.data, newCommentText: ''})
            )
        }).catch(reason => {
            this.props.handleError(reason);
            //No comments...
            this.setState(() => ({comments: []}));
        });
    };

    createComment = (comment) => {
        //Remove pk property
        delete comment.pk;
        //Create the comment and set the new list
        this.props.createComment(comment).then(response => {
            this.setState(() =>
                ({
                    comments: response.body.data,
                    newCommentText: ''
                })
            )
            if (this.props.onCommentAdded) {
                this.props.onCommentAdded(comment);
            }
        }).catch(reason => {
            this.props.handleError(reason);
            //Try to read comments again
            this.readComments(this.props.entityCode, this.props.entityKeyCode);
        });
    };

    updateComment = (comment) => {
        //Remove pk property
        delete comment.pk;
        delete comment.updateCount;
        //Update the comment and set the new list
        this.props.updateComment(comment).then(response => {
            this.setState(() =>
                ({comments: response.body.data})
            )

            if (this.props.onCommentUpdated) {
                this.props.onCommentUpdated(comment);
            }
        }).catch(reason => {
            this.props.handleError(reason);
            //Try to read comments again
            this.readComments(this.props.entityCode, this.props.entityKeyCode);
        });
    };

    updateNewCommentText = (text) => {
        this.setState(() =>
            ({
                newCommentText: text
            })
        )
    };

    createCommentForNewEntity = () => {
        if (this.state.newCommentText) {
            this.createComment({
                entityCode: this.props.entityCode,
                entityKeyCode: this.props.entityKeyCode,
                text: this.state.newCommentText
            });
        }
    };

    render() {
        const { allowHtml, disabled } = this.props;

        return (
            <List style={{width: "100%"}}>
                {
                    this.state.comments.map(comment =>
                        <Comment 
                            allowHtml={allowHtml} 
                            key={comment.pk} 
                            comment={comment} 
                            updateCommentHandler={this.updateComment}
                            commentFooter={this.props.commentFooterMapper?.({ comment })}
                        />
                    )
                }

                <CommentNew userCode={this.props.userCode}
                    createCommentHandler={this.createComment}
                    entityCode={this.props.entityCode}
                    entityKeyCode={this.props.entityKeyCode}
                    newCommentText={this.state.newCommentText}
                    updateNewCommentText={this.updateNewCommentText}
                    displayPrivateCheck={this.props.displayPrivateCheck}
                    disabled={disabled} />
            </List>
        );
    }
}

Comments.defaultProps = {
    title: 'COMMENTS',
    readComments: WSComments.readComments,
    updateComment: WSComments.updateComment,
    createComment: WSComments.createComment
};

Comments.propTypes = {
    entityCode: PropTypes.string,
    entityKeyCode: PropTypes.string,
    userDesc: PropTypes.string.isRequired,
    onCommentAdded: PropTypes.func,
    onCommentUpdated: PropTypes.func,
    title: PropTypes.string,
    readComments: PropTypes.func,
    updateComment: PropTypes.func,
    createComment: PropTypes.func,
    commentFooterMapper: PropTypes.func,
    displayPrivateCheck: PropTypes.bool,
};

export default Comments;