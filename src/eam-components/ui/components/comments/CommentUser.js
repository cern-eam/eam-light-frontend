import React from 'react';

const CommentUser = (props) => (
    <div className="commentUserContainer">
            {props.icon}
            <label> {props.userDate}</label> by
            <label> {props.userDesc}</label>
    </div>
)

export default CommentUser;