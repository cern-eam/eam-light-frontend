import React, {Component} from 'react';

class EAMBaseInput extends Component {

    state = {
        error: false,
        helperText: null,
        disabled: false
    };

    componentWillMount () {
        let { elementInfo, formFields } = this.props;
        this.updateFormField(elementInfo, formFields);
    }

    componentWillReceiveProps (nextProps) {
        let { elementInfo, formFields } = nextProps;
        this.updateFormField(elementInfo, formFields);
    }

    componentWillUnmount () {
        const { elementInfo, formFields } = this.props;
        if (elementInfo && formFields) formFields[elementInfo.xpath] = null;
    }

    updateFormField = (elementInfo, formFields) => {
        if (!elementInfo || !formFields) return;
        formFields[elementInfo.xpath] = this;
    }

    enable = () => this.setState({disabled: false})

    disable = () => this.setState({disabled: true})

    isRequired = () => this.props.elementInfo && (this.props.elementInfo.attribute === 'R' || this.props.elementInfo.attribute === 'S')

    isHidden = () => this.props.elementInfo && this.props.elementInfo.attribute === 'H'

    markFieldAsValid = () => this.setState({error: false, helperText: null});

    markFieldAsInvalid = () => this.setState({error: true})

    validate() {
        const { required } = this.state;

        if (!required) return true;

        //Execute own validation
        if (this.props.validate && this.props.validate(this.props.value) ||
                !this.props.validate && this.props.value) {
            this.markFieldAsValid();
            return true;
        }
        this.markFieldAsInvalid();
        return false;
    }

    onChangeHandler = (key, value, selectedObject = undefined, executeExtra = true) => {
        let { elementInfo } = this.props;
        //Uppercase field if needed
        if (elementInfo && elementInfo.characterCase === 'uppercase' && value) {
            //If normal value
            if (value.toUpperCase) {
                value = value.toUpperCase();
            } else if (value.code && value.code.toUpperCase) {
                //code, desc Pair object
                value.code = value.code.toUpperCase();
            } else if (Array.isArray(value)) {
                //For arrays
                value = value.map(elem => {
                    if (elem.code) {
                        return {
                            ...elem,
                            code: elem.code.toUpperCase(),
                        }
                    } else if (elem.toUpperCase) {
                        return elem.toUpperCase();
                    }
                    return elem;
                });
            }
        }

        // Don't set the value if it is about to (or has already) exceeded the max length
        if (value &&
            value.length &&
            elementInfo &&
            elementInfo.maxLength &&
            value.length > elementInfo.maxLength) {
            return
        }

        if (this.props.updateProperty) {
            this.props.updateProperty(key, value);
        }
        //Extra function if needed
        if (executeExtra && this.props.onChangeValue) {
            this.props.onChangeValue(value, selectedObject);
        }
    };

    renderHelperText = () => {
        //left: this.props.labelStyle.width
        const {labelStyle} = this.props;
        const left = labelStyle && labelStyle.width ? labelStyle.width + 35 : 165;

        const helperTextStyle = {
            margin: 0,
            fontSize: '0.75rem',
            textAlign: 'right',
            marginTop: '8px',
            minHeight: '1em',
            lineHeight: '1em',
            color: '#f44336',
            bottom: '12px',
            position: 'absolute',
            left
        };
        return (
            <p style={helperTextStyle}>
                {this.state.helperText}
            </p>
        );
    }
}

EAMBaseInput.defaultProps = {
    validate: value => !!value
};

export default EAMBaseInput;

export const formStyles = theme => ({
    fieldContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline',
        flex: 1,
    },
    formControlRoot: {
        margin: 0,
        flexGrow: 1,
    },
    textFieldRoot: {
        padding: 0,
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    textFieldInput: {
        borderRadius: 4,
        backgroundColor: '#fafafa',//theme.palette.common.white,
        color: "#333",
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '6px 9px',
        marginTop: '8px',
        marginBottom: '8px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        }
    },
    select: {
        flexGrow: 1,
        marginTop: '8px',
        marginBottom: '8px',
        borderRadius: 4,
        '& > div': {
            borderRadius: 4,
            backgroundColor: '#fafafa',//theme.palette.common.white,
            border: '1px solid #ced4da',
            fontSize: 16,
            transition: theme.transitions.create(['border-color', 'box-shadow']),
        },
        '& .Select-menu-outer': {
            zIndex: 2
        }
    },
    textFieldFormLabel: {
        fontSize: 18,
    },
    addon: {
        padding: '6px 9px',
        marginTop: '8px',
        marginBottom: '8px',
        fontSize: "1rem",
        fontWeight: "400",
        color: "#464a4c",
        textAlign: "center",
        backgroundColor: "#eceeef",
        border: "1px solid rgba(0,0,0,.15)",
        borderLeft: "0px",
        borderBottomRightRadius: ".25rem",
        borderTopRightRadius: ".25rem"
    },
    rightAddon: {
        '& input': {
            borderBottomRightRadius: "0",
            borderTopRightRadius: "0"
        }
    },
    fieldInvalid: {
        border: '1px solid #f03369 !important'
    },
    fieldInvalidInput: {
        '& input': {
            border: '1px solid #f03369 !important'
        }
    }
});
