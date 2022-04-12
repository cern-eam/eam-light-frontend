import React, {Component} from 'react';

class FileList extends Component {

    //
    // STYLES
    //
    mainDivStyle = {
        margin: 7,
        marginLeft: 10,
        marginBottom: 15,
        display: "flex"
    }

    filesLabelStyle = {
        width: 110,
        fontWeight: 500
    }

    filesStyle = {
        display: "flex",
        flexDirection: "column"
    }

    //
    // HANDLERS
    //
    generateFilesInfo = () => {
        return this.props.files.map(file => <div>{file.name} ({this.bytesToSize(file.size)})</div>)
    }

    //
    // HELPER METHODS
    //
    bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    };

    //
    // RENDER
    //
    render() {
        return (
            <div style={this.mainDivStyle}>
                <div style={this.filesLabelStyle}>
                    Files:
                </div>
                <div style={this.filesStyle}>
                    {this.generateFilesInfo()}
                </div>
            </div>
        )
    }
}

export default FileList