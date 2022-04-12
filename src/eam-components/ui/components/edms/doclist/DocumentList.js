import React, {Component} from 'react';
import DocumentRow from "./DocumentRow";

class DocumentList extends Component {

    listStyle = {
        width: "100%",
        marginTop: 10
    }

    headerStyle = {
        display: "flex",
        height: 40,
        alignItems: "center",
        color: "rgba(0, 0, 0, 0.54)",
        fontWeight: 500,
        borderBottom: "1px solid #e0e0e0"
    }

    idStyle = {
        margin: 7,
        marginLeft: 10,
        width: 100,
        flex: "0 0 auto",
        fontWeight: 500
    }

    titleStyle = {
        margin: 5,
        flexGrow: 1
    }

    statusStyle = {
        margin: 5,
        width: 110,
        flex: "0 0 auto",
        display: 'flex'
    }

    moreStyle = {
        width: 48,
        flex: "0 0 auto",
        display: 'flex'
    }

    generateDocumentList() {
        if (this.props.documents) {
            return this.props.documents.map( (document, index) => {
                return <DocumentRow document={document} index={index} key={index} filesUploadHandler={this.props.filesUploadHandler}/>
            })
        } else {
            return <div/>
        }
    }

    render() {
        return (
            <div style={this.listStyle}>
                <div style={this.headerStyle}>
                    <div style={this.moreStyle}>
                    </div>
                    <div style={this.idStyle}>
                       ID
                    </div>
                    <div style={this.titleStyle}>
                       Title
                    </div>
                    <div style={this.statusStyle}>
                        Status
                    </div>
                </div>
                {this.generateDocumentList()}
            </div>
        )
    }
}

export default DocumentList