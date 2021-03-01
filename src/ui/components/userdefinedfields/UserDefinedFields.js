import React, {Component} from 'react';
import UDFChar from "./UDFChar";
import EAMInput from "eam-components/dist/ui/components/muiinputs/EAMInput";
import EAMDatePicker from "eam-components/dist/ui/components/muiinputs/EAMDatePicker";
import EAMDateTimePicker from "eam-components/dist/ui/components/muiinputs/EAMDateTimePicker";
import EAMCheckbox from "eam-components/dist/ui/components/muiinputs/EAMCheckbox";


/**
 * Receive props:
 * fields: The user defined fields of the entity
 * entityLayout: Layout to identify which fields to render
 * updateUDFProperty: Function to update the property of a udf
 */
class UserDefinedFields extends Component {

    renderUdfChars = () => {
        if (!this.props.entityLayout)
            return null;
        let udfChars = [];
        this.sortProperties().forEach(prop => {
            if (prop.indexOf('udfchar') !== -1 && prop.indexOf('Desc') === -1) {
                udfChars.push(<UDFChar key={prop} fieldInfo={this.props.entityLayout[prop]}
                                       fieldValue={this.props.fields[prop]}
                                       fieldValueDesc={this.props.fields[`${prop}Desc`]}
                                       fieldKey={`userDefinedFields.${prop}`}
                                       updateUDFProperty={this.props.updateUDFProperty}
                                       children={this.props.children}/>);
            }
        });
        return udfChars;

    };

    renderUdfNums = () => {
        if (!this.props.entityLayout)
            return null;
        let udfNums = [];
        this.sortProperties().forEach(prop => {
            if (prop.indexOf('udfnum') !== -1) {
                udfNums.push(<EAMInput key={prop} elementInfo={this.props.entityLayout[prop]}
                                       value={this.props.fields[prop]}
                                       updateProperty={this.props.updateUDFProperty}
                                       valueKey={`userDefinedFields.${prop}`}
                                       children={this.props.children}/>);
            }
        });
        return udfNums;

    };

    renderUdfDates = () => {
        if (!this.props.entityLayout)
            return null;
        let udfDates = [];
        this.sortProperties().forEach(prop => {
            if (prop.indexOf('udfdate') !== -1) {
                if (this.props.entityLayout[prop].fieldType === 'datetime') {
                    udfDates.push(<EAMDateTimePicker key={prop} elementInfo={this.props.entityLayout[prop]}
                                                     value={this.props.fields[prop]}
                                                     updateProperty={this.props.updateUDFProperty}
                                                     valueKey={`userDefinedFields.${prop}`}
                                                     children={this.props.children}/>);
                } else {
                    udfDates.push(<EAMDatePicker key={prop} elementInfo={this.props.entityLayout[prop]}
                                                 value={this.props.fields[prop]}
                                                 updateProperty={this.props.updateUDFProperty}
                                                 valueKey={`userDefinedFields.${prop}`}
                                                 children={this.props.children}/>);
                }
            }
        });
        return udfDates;

    };

    renderUdfCheckboxs = () => {
        if (!this.props.entityLayout)
            return null;
        let udfChecks = [];
        this.sortProperties().forEach(prop => {
            if (prop.indexOf('udfchk') !== -1) {
                udfChecks.push(<EAMCheckbox key={prop} elementInfo={this.props.entityLayout[prop]}
                                            value={this.props.fields[prop]}
                                            updateProperty={this.props.updateUDFProperty}
                                            valueKey={`userDefinedFields.${prop}`}
                                            children={this.props.children}/>);

            }
        });
        return udfChecks;
    };

    sortProperties = () => {
        let sortableProps = [];
        for (let prop in this.props.entityLayout) {
            if (this.props.entityLayout.hasOwnProperty(prop))
                sortableProps.push(prop);
        }
        sortableProps.sort((x, y) => x < y ? -1 : x > y ? 1 : 0);
        return sortableProps;
    };

    render() {
        return (
            <div style={{width: "100%", marginTop: 0}}>
                {this.renderUdfChars()}
                {this.renderUdfNums()}
                {this.renderUdfDates()}
                {this.renderUdfCheckboxs()}
            </div>
        );
    }
}

export default UserDefinedFields;