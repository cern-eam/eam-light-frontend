import React, {Component} from 'react';
import CommentIcon from '@mui/icons-material/Comment';

export default class ChecklistItemNotes extends Component {
    constructor(props) {
        super(props);
        this.input = React.createRef();
    }

    componentWillMount() {
        if (this.props.checklistItem) {
            this.setState({
                value: this.props.checklistItem.notes
            })
        }
    }

    mainDivStyle = {
        padding: 2,
        position: "relative",
        flexGrow: "1",
        display: "flex",
        alignItems: "center",
        height: 42
    }

    notesStyle = {
        color: "rgb(117, 117, 117)",
        width: "calc(100% - 64px)",
        border: "0px solid #ebebeb",
        padding: "7px 29px",
        fontSize: 14,
        transition: "border-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        borderRadius: 4,
        backgroundColor: "#fff"
    }

    commentIconStyle = {
        position: "absolute",
        bottom: 12,
        left: 4,
        color: "#cecece"
    }

    handleChange = event => {
        this.setState({
            value: event.target.value
        })
    }

    handleBlur = event => {
        const oldValue = this.props.checklistItem.notes;
        if((oldValue === null ? '' : oldValue) === event.target.value) {
            return;
        }

        this.props.onChange({
            ...this.props.checklistItem,
            notes: event.target.value
        })
    }

    focus() {
        this.input.current.focus();
    }

    render() {
        return (
            <div style={this.mainDivStyle}>
                <input
                    style={this.notesStyle}
                    onChange={this.handleChange}
                    value={this.state.value || ''}
                    onBlur={this.handleBlur}
                    ref={this.input}
                    disabled={this.props.disabled}
                />
                <CommentIcon style={this.commentIconStyle}/>
            </div>
        )
    }

}

