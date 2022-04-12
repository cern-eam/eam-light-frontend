import React, {Component} from 'react';
import {ChevronDown, ChevronRight} from 'mdi-material-ui'
import IconButton from '@material-ui/core/IconButton';
import FileList from './FileList'
import MoreDetailsList from './MoreDetailsList'
import Dropzone from 'react-dropzone'
import StatusBox from "./StatusBox";

class DocumentRow extends Component {

    state = {
        filesVisible: false
    }

    //
    // STYLES
    //

    docStyle = {
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #e0e0e0"
    }

    idStyle = {
        margin: 7,
        marginLeft: 10,
        width: 100,
        flex: "0 0 auto"
    }

    idLinkStyle = {
        textDecoration: 'none'
    }

    titleStyle = {
        margin: 5,
        flexGrow: 1
    }

    statusStyle = {
        margin: 5,
        width: 110,
        flex: "0 0 auto",
        display: 'flex',
        alignItems: "center"
    }

    morePanelStyle = {
        backgroundColor: 'transparent',
        borderTop: '1px solid #e0e0e0',
        borderBottom: '2px solid #e0e0e0'
    }

    computeDropZoneStyle = () => ({
        border: "1px solid transparent",
        backgroundColor: (this.props.index%2) ? 'rgb(250, 250, 250)' : 'white'
    })

    computeDropZoneActiveStyle = () => ({
        border: "1px dashed #a7a7a7",
        backgroundColor: (this.props.index%2) ? 'rgb(250, 250, 250)' : 'white'
    })

    computeStatusBox = (status) => {
        let statusColor = ''
        switch(status){
            case 'In Work':
                statusColor = 'rgb(204, 0, 0)'
                break
            case 'Draft For Discussion':
                statusColor = 'rgb(255, 240, 0)'
                break
            case 'Released':
                statusColor = 'rgb(0, 204, 0)'
                break
            default:
                statusColor = 'rgb(119, 119, 119)'
        }
        return <StatusBox color={statusColor}/>
    }

    computeFilesButtonStyle() {
        if(this.props.document.files.length === 0)
            return {
                color: 'rgba(0, 0, 0, 0.20)'
            }
        else
            return {
                color: this.state.filesVisible ? 'rgb(0, 170, 255)' : 'rgba(0, 0, 0, 0.54)'
            }
    }

    //
    // DropZone handling
    //

    stopPropagation = (event) => {
        event.stopPropagation()
    }

    onFileDrop = (acceptedFiles, rejectedFiles) => {
        if(acceptedFiles.length > 0)
            this.props.filesUploadHandler(this.props.document.edmsId, this.props.document.version, acceptedFiles)
    }


    render(){
        return (
            <Dropzone style={this.computeDropZoneStyle()}
                      activeStyle={this.computeDropZoneActiveStyle()}
                      onDrop={this.onFileDrop}
                      disableClick
                      ref={dropzone => this.dropzone = dropzone}>
                <div>
                    <div style={this.docStyle}>
                        <div>
                            <IconButton onClick={() => this.setState({filesVisible: !this.state.filesVisible})}
                                        style={this.computeFilesButtonStyle()}>
                                {this.state.filesVisible ? <ChevronDown/> : <ChevronRight />}
                            </IconButton>
                        </div>
                        <div style={this.idStyle}>
                           <a style={this.idLinkStyle} href={this.props.document.url} target='_blank' onClick={this.stopPropagation}> {this.props.document.edmsId + ' v.' + this.props.document.version} </a>
                        </div>
                        <div style={this.titleStyle}>
                            {this.props.document.title}
                        </div>
                        <div style={this.statusStyle}>
                            {this.computeStatusBox(this.props.document.status)}
                            {this.props.document.status}
                        </div>
                    </div>

                    {this.state.filesVisible &&
                        <div style={this.morePanelStyle}>
                            {this.props.document.properties && this.props.document.properties.edms_property &&
                            <MoreDetailsList details={this.props.document.properties.edms_property}/>}

                            {<FileList files={this.props.document.files}
                                       dropzone={this.dropzone}/>}
                        </div>}
                </div>
            </Dropzone>
            )
    }
}

export default DocumentRow