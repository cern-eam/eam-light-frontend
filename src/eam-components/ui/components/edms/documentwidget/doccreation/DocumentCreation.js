import React, {Component} from 'react';
import Dropzone from 'react-dropzone'
import Tune from 'mdi-material-ui/Tune'
import ContentSaveOutline from 'mdi-material-ui/ContentSaveOutline'
import IconButton from '@material-ui/core/IconButton';
import FilePlus from 'mdi-material-ui/FilePlus'
import DocumentCreationOptions from "./DocumentCreationOptions";
import FileList from "../../FileList";
import EAMInput from "../../../inputs/EAMInput";

class DocumentCreation extends Component {

    state = {
        optionsVisible: false,
        files: [],
        title: "",
        type: "",
        description: ""
    };

    //
    // STYLES
    //
    mainDivStyle = {
        borderBottom: "3px solid rgb(238, 238, 238)",
        borderTop: "2px solid rgb(238, 238, 238)"
    };

    newDocStyle = {
        display: "flex",
        alignItems: "center"
    };

    idStyle = {
        margin: 5,
        marginLeft: 10,
        width: 100,
        flex: "0 0 auto",
        fontWeight: 500
    };

    titleStyle = {
        margin: 5,
        flexGrow: 1,
        display: "flex"
    };

    dropZoneStyle = {
        border: "1px solid white"
    };

    dropZoneActiveStyle = {
        border: "1px dashed #a7a7a7"
    };

    inputStyle = {
        flex: "1 1 auto",
        border: "1px solid #ced4da",
        padding: "5px 10px",
        fontSize: 16,
        transition: "border-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        borderRadius: 4,
        backgroundColor: "#fff",
    };

    computeOptionsButtonStyle() {
        return {
            color: this.state.optionsVisible ? 'rgb(0, 170, 255)' : 'rgba(0, 0, 0, 0.54)'
        }
    }

    //
    // HANDLERS
    //
    optionsClickerHandler = (event) => {
        event.stopPropagation();
        this.setState({optionsVisible: !this.state.optionsVisible})
    };

    createDocumentHandler = (event) => {
        let document = {
            title: this.state.title,
            type: 'Report',
            description: this.state.description
        };
        this.props.createDocument(document, this.state.files)
    };

    onFileDrop = (acceptedFiles, rejectedFiles) => {
        this.setState({files: acceptedFiles})
    };

    setStateProperty = (key, value) => {
        this.setState({
            [key] : value
        })
    };

    //
    // RENDER
    //
    render() {
        return (
            <div style={this.mainDivStyle}>
                <Dropzone style={this.dropZoneStyle}
                          activeStyle={this.dropZoneActiveStyle}
                          disableClick
                          onDrop={this.onFileDrop}
                          ref={dropzone => this.dropzone = dropzone}>
                <div style={this.newDocStyle}>
                    <div style={this.titleStyle}>
                        <EAMInput label="New Document:"
                               placeholder="Title"
                               value={this.state.title}
                               valueKey="title"
                               updateProperty={(key, value) => this.setStateProperty(key, value)}/>
                    </div>

                    {/*
                    <div>
                        <IconButton onClick={this.optionsClickerHandler}
                                    style={this.computeOptionsButtonStyle()}>
                            <Tune/>
                        </IconButton>
                    </div>
                    */}
                    <div>
                    <IconButton onClick={() => this.dropzone.open()}>
                        <FilePlus/>
                    </IconButton>
                    </div>
                    <div>
                        <IconButton onClick={this.createDocumentHandler}
                                    disabled={this.state.files.length === 0}>
                            <ContentSaveOutline/>
                        </IconButton>
                    </div>

                </div>

                {(this.state.files.length > 0) && <FileList files={this.state.files}/>}

                {this.state.optionsVisible && <DocumentCreationOptions onPropertyChange={this.setStateProperty}
                                                                       type={this.state.type}
                                                                       description={this.state.description}/>}
                </Dropzone>
            </div>
        )
    }
}

export default DocumentCreation