import React from 'react';
import {getEDMSFileUrl} from '../utils/EDMSUtils';

export default class Thumbnail extends React.Component {

    thumbnailStyle = {
        maxWidth: 90,
        maxHeight: 90,
        marginRight: 10
    }

    render() {
        return (
            <div>
                <img style={this.thumbnailStyle}
                     id={this.props.file.edmsId + "###" + this.props.file.innerId}
                     src={getEDMSFileUrl(this.props.file)}/>
            </div>
        );
    }
}