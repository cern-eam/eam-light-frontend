import React, {Component} from 'react';
import EAMInput from "../../../inputs/EAMInput";

class DocumentCreationOptions extends Component {

    //
    // STYLES
    //
    inputStyle = {
        flex: "1 1 auto",
        border: "1px solid #ced4da",
        padding: "5px 10px",
        fontSize: 16,
        transition: "border-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        borderRadius: 4,
        backgroundColor: "#fff",
        marginTop: 5,
        marginBottom: 5
    }

    mainDivStyle = {
        margin: 5,
        display: "flex"
    }

    optionsLabelStyle = {
        marginTop: 11,
        width: 110,
        fontWeight: 500
    }

    optionsStyle = {
        display: "flex",
        flexDirection: "column"
    }

    //
    // RENDER
    //
    render() {
        return (
            <div style={this.mainDivStyle}>
                <div style={this.optionsStyle}>
                    <EAMInput label="Description"
                              placeholder="Description"
                              valueKey="description"
                              value={this.props.description}
                              updateProperty={(key, value) => this.props.onPropertyChange(key, value)}
                              />
                </div>
            </div>
        )
    }
}


export default DocumentCreationOptions