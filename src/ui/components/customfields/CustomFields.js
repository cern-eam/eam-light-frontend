import React, {Component} from 'react';
import EISPanel from 'eam-components/dist/ui/components/panel';
import CustomFieldInput from './CustomFieldInput';
import WSCustomFields from "../../../tools/WSCustomFields";

class CustomFields extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lookupValues: {}
        };
        this.children = {};
    }

    enable() {
        Object.keys(this.children).forEach(key => {
            this.children[key].enable()
        })
    }

    disable() {
        Object.keys(this.children).forEach(key => {
            this.children[key].disable()
        })
    }

    validate() {
        return true;
    }

    componentWillMount() {
        //
        WSCustomFields.getCustomFieldsLookupValues(this.props.entityCode, this.props.classCode)
            .then(response => {
                this.setState({lookupValues: response.body.data})
            })
        //
        if (this.props.children) {
            this.props.children.customFields = this
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.classCode !== this.props.classCode) {
            // Class has changed; fetch new lookup values
            WSCustomFields.getCustomFieldsLookupValues(nextProps.entityCode, nextProps.classCode)
                .then(response => {
                    this.setState({lookupValues: response.body.data})
                })

            // Class has changed, but the entity key code did not; update custom fields
            if (nextProps.entityKeyCode === this.props.entityKeyCode) {
                this.updateCustomFields(nextProps.classCode)
            }
        }
    }

    updateCustomFields(classCode) {
        WSCustomFields.getCustomFields(this.props.entityCode, classCode)
            .then(response => {
                let newCustomFields = response.body.data
                for (var i = 0; i < newCustomFields.length; i++) {
                    var temp = this.props.customFields.find(cf => (cf.code === newCustomFields[i].code));
                    if (temp) {
                        newCustomFields[i].value = temp.value;
                    }
                }
                this.props.updateEntityProperty('customField', newCustomFields)
                this.children = {}
            })
    }

    updateCustomFieldValue(index, valueKey, value) {
        this.props.customFields[index][valueKey] = value
        this.props.updateEntityProperty('customField', this.props.customFields)
    }

    renderCustomFields(customFields) {
        return customFields.map((customField, index) => (
                <CustomFieldInput children={this.children}
                                  key={index}
                                  updateCustomFieldValue={this.updateCustomFieldValue.bind(this, index)}
                                  customField={customField}
                                  index={index}
                                  lookupValues={this.state.lookupValues}
                                  readonly={this.props.readonly}/>
            )
        )
    }

    render() {
        if (!this.props.customFields || this.props.customFields.length === 0) {
            return (
                <div/>
            )
        }

        return (
            <EISPanel heading={this.props.title}>
                <div style={{width: "100%", marginTop: 0}}>
                    {this.props.customFields && this.renderCustomFields(this.props.customFields)}
                </div>
            </EISPanel>
        )
    }
}

CustomFields.defaultProps = {
    title: 'CUSTOM FIELDS',
    readonly: false,
};

export default CustomFields;