import React, {Component} from 'react';
import FileRow from './FileRow'
import FilePlus from 'mdi-material-ui/FilePlus'
import IconButton from '@mui/material/IconButton';

class FileList extends Component {

    generateFileList() {
        if (this.props.files) {
            return this.props.files.map(file => {
                return <FileRow file={file}/>
            })
        } else {
            return <h6>No docs yet</h6>
        }
    }

    fileAttachmentStyle = {
        position: "absolute",
        right: 0,
        top: 0
    }

    fileListStyle = {
        position: "relative",
        borderTop: "1px solid #e0e0e0",
        minHeight: 40,
        wordBreak: "break-all",
        paddingRight: 40
    }

    render() {
        return (
            <div style={this.fileListStyle}>
                <div style={this.fileAttachmentStyle}>
                    <IconButton
                        style={{color: "rgb(0, 170, 255)"}}
                        onClick={() => this.props.dropzone.open()}
                        size="large">
                        <FilePlus/>
                    </IconButton>
                </div>
                {this.generateFileList()}
            </div>
        );
    }
}

export default FileList