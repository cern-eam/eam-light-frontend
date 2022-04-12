import React, {Component} from 'react';
import EAMSelect from "../../../inputs/EAMSelect";
import EAMInput from "../../../inputs/EAMInput";

const COMBOBOX = 'COMBOBOX'

class NCRCreationProperties extends Component {

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

    computeMainDivStyle = () => ({
        display: this.props.showNCRProperties ? "flex" : "none",
        flexDirection: "column"
    })

    optionsStyle = {
        display: "flex",
        flexDirection: "column"
    }

    generatePropertyList = (properties) => {
        return properties.map(
            property => {
                if(property.displayType === COMBOBOX){
                    let propValues = property.listOfValues.value.map((value) => {return {code: value, desc: value}})
                    return <EAMSelect label={property.label}
                                      required={property.mandatory}
                                      valueKey={property.name}
                                      value={(this.props.currentProperties[property.name] && this.props.currentProperties[property.name].value) || ''}
                                      values={propValues}
                                      updateProperty={(key, value) => this.props.onNCRPropertyChange(key, value)}/>
                } else {
                    return <EAMInput label={property.label}
                                     required={property.mandatory}
                                     valueKey={property.name}
                                     value={(this.props.currentProperties[property.name] && this.props.currentProperties[property.name].value) || ''}
                                     updateProperty={(key, value) => this.props.onNCRPropertyChange(key, value)}/>
                }
            })
    }

    //
    // RENDER
    //
    render() {
        return (
            <div style={this.computeMainDivStyle()}>
                <div style={this.optionsStyle}>
                    {this.generatePropertyList(this.props.NCRProperties)}
                </div>
            </div>
        )
    }
}


export default NCRCreationProperties