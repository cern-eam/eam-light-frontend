import React, {Component} from 'react';
import WSUDF from "../../../tools/WSUDF";
import EAMAutocomplete from "eam-components/ui/components/muiinputs/EAMAutocomplete";
import EAMSelect from "eam-components/ui/components/muiinputs/EAMSelect";
import EAMInput from "eam-components/ui/components/muiinputs/EAMInput";

const NONE = 'NONE';
const CODE = 'CODE';
const CODEDESC = 'CODEDESC';
const RENT = 'RENT';

class UDFChar extends Component {

    state = {
        dropdownValues: []
    };

    componentWillMount() {
        //If is code or codedesc, load the values
        const lookupType = this.props.fieldInfo.udfLookupType;
        const entity = this.props.fieldInfo.udfLookupEntity;
        const fieldId = this.props.fieldInfo.elementId;
        this.loadDropdownValues(lookupType, entity, fieldId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.fieldInfo !== this.props.fieldInfo) {
            const lookupType = nextProps.fieldInfo.udfLookupType;
            const entity = nextProps.fieldInfo.udfLookupEntity;
            const fieldId = nextProps.fieldInfo.elementId;
            this.loadDropdownValues(lookupType, entity, fieldId);
        }
    }

    loadDropdownValues = (lookupType, entity, fieldId) => {
        if (lookupType === CODE) {
            WSUDF.getUDFCodeValues(entity, fieldId).then(response => {
                this.setState(() => ({dropdownValues: response.body.data}));
            }).catch(error => console.log(`Error loading list`, error));
        } else if (lookupType === CODEDESC) {
            WSUDF.getUDFCodeDescValues(entity, fieldId).then(response => {
                this.setState(() => ({dropdownValues: response.body.data}));
            }).catch(error => console.log(`Error loading list`, error));
        }
    };


    render() {
        //Render depends on the type of field
        switch (this.props.fieldInfo.udfLookupType) {
            case CODE:
            case CODEDESC:
                return (
                    <EAMSelect
                        elementInfo={this.props.fieldInfo}
                        valueKey={this.props.fieldKey}
                        values={this.state.dropdownValues}
                        value={this.props.fieldValue}
                        updateProperty={this.props.updateUDFProperty}
                        children={this.props.children}
                        link={this.props.link}
                        icon={this.props.icon}
                    />
                );
            case RENT:
                return (
                    <EAMAutocomplete elementInfo={this.props.fieldInfo}
                                     value={this.props.fieldValue}
                                     updateProperty={this.props.updateUDFProperty}
                                     valueKey={this.props.fieldKey}
                                     valueDesc={this.props.fieldValueDesc}
                                     descKey={`${this.props.fieldKey}Desc`}
                                     autocompleteHandler={(value, config) => WSUDF.autocompleteUserDefinedField(this.props.fieldInfo.udfLookupEntity, value, config)}
                                     children={this.props.children}
                                     link={this.props.link}
                                     icon={this.props.icon}
                    />
                );
            case NONE:
            default:
                return (
                    <EAMInput elementInfo={this.props.fieldInfo}
                              value={this.props.fieldValue}
                              updateProperty={this.props.updateUDFProperty}
                              valueKey={this.props.fieldKey}
                              children={this.props.children}
                              link={this.props.link}
                              icon={this.props.icon}
                    />
                );
        }
    }
}

export default UDFChar;