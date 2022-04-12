import React, {Component} from 'react';
import Thumbnail from './Thumbnail';

export default class FileRow extends Component {

    rowStyle = {
        display: "flex",
        margin: 5,
        marginLeft: 10,
        alignItems: "center"
    };

    fileNameStyle = {
        marginLeft: 5,
        marginRight: 5
    };

    fileLinkStyle = {
        textDecoration: 'none'
    };


    render() {
        let {file} = this.props;

        return (
            <div style={this.rowStyle}>
                <Thumbnail file={file}/>
                <div style={this.fileNameStyle}>
                    <a style={this.fileLinkStyle} href={file.fullPath} target='_blank'>
                        {file.fileName}
                    </a>
                </div>
            </div>
        )
    }
}