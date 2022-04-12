import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';
import Autosuggest from 'react-autosuggest';
import EAMBaseInput from './EAMBaseInput';
import EAMTextField from './EAMTextField';

/**
 * Default input, if none is provided
 */
function renderInput(inputProps) {
    const { classes, autoFocus, value, label, disabled, error, helperText, required, ...other } = inputProps;

    const arrowIconStyle = {
        color: "rgba(0, 0, 0, 0.54)",
        pointerEvents: 'none',
        position: "absolute",
        right: 0
    }

    return (
        <EAMTextField
            required = {required}
            error={error}
            helperText={helperText}
            disabled={disabled}
            autoFocus={autoFocus}
            label={label}
            value={value}
            className={classes.textField}
            InputProps={{
                endAdornment: (!disabled &&
                    <InputAdornment position="end">
                        <SvgIcon style={arrowIconStyle}>
                            <path d="M7 10l5 5 5-5z" />
                        </SvgIcon>
                    </InputAdornment>
                ),
                classes: {
                    input: classes.input,
                },
                ...other,
            }}
        />
    );
}

/**
 * Container that will encapsulate every suggestion
 */
function renderSuggestionContainer(child, suggestion, isHighlighted) {
    return (
        <MenuItem selected={isHighlighted} component="div">
            <div>
                {child}
            </div>
        </MenuItem>
    );
}

/**
 * Global container containing all suggestions
 */
function renderSuggestionsContainer(options) {
    const { containerProps, children } = options;
    return (
        <Paper {...containerProps} square>
            {children}
        </Paper>
    );
}

const useStyles = makeStyles(theme => ({
    container: {
        flexGrow: 1,
        position: 'relative'
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        marginBottom: theme.spacing(3),
        left: 0,
        right: 0,
        zIndex: 9999
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
        overflowY: "auto",
        overflowX: "hidden",
        maxHeight: props => (props.suggestionsPixelHeight || 400) + 'px'
    },
}));

class EAMSelect extends EAMBaseInput {

    state = {
        suggestions: []
    };

    init = props => {
        const value = props.value || ''
        const values = props.values
        const valueFound = this.findValueInValues(value, values)
        this.setValue({
            code: valueFound && valueFound.code || value,
            desc: valueFound && valueFound.desc || value
        },
        false)
    }

    onSuggestionChange = (code, desc) => {
        this.props.updateProperty(this.props.valueKey, (code || ''));
        
        if (this.props && this.props.valueDesc) {
            this.props.updateProperty(this.props.valueDesc, desc);
        }
    }

    findValueInValues = (value, values) => {
        const processedValue = value.trim()
        return (values || []).find(v => (
            v.code.toUpperCase() === processedValue.toUpperCase() ||
            v.desc && v.desc.toUpperCase() === processedValue.toUpperCase()))
    }

    handleSuggestionsFetchRequested = ({ value, reason }) => {
        let suggestions = this.props.values
        if (!suggestions) {
            return
        }

        if (value && (reason !== 'input-focused')) {
            suggestions = suggestions.filter(suggestion => {
                const codeParts = suggestion.code.toUpperCase().split(' ').filter(p => p.length > 1);
                return (codeParts.some(p => p.startsWith(value.toUpperCase())) ||
                        suggestion.desc && suggestion.desc.toUpperCase().startsWith(value.toUpperCase()))
            })
        }

        this.setState({suggestions});
    };

    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        }, () => {
            const dropdownValue = this.state.value 
                && this.findValueInValues(this.state.value.code, this.props.values);
                
            const value = dropdownValue || this.state.value;
            value && this.onSuggestionChange(value.code, value.desc);
        });
    };
    
    handleSuggestionSelected = (event, { suggestion }) => {
        if (suggestion) this.onSuggestionChange(suggestion.code, suggestion.desc)
    }

    handleChange = (event, { newValue }) => {
        this.setValue({code: newValue, desc: ''});
    };

    getSuggestionValue = (suggestion) => {
        return suggestion.code;
    }

    shouldRenderSuggestions = (value) => {
        // Returning true causes the suggestions to be
        // rendered when the input is blank and focused
        return true
    }

    renderValue(value) {
        return [...new Set([value.code, value.desc])].filter(Boolean).join(' - ');
    }

    renderComponent() {
        const { classes, elementInfo, renderSuggestion, renderValue } = this.props;
        const { value, error, helperText, disabled } = this.state;
        const suggestionRenderer = renderSuggestion || this.renderValue;
        const valueRenderer = renderValue || this.renderValue;
        if (!value) return null

        return (
            <Autosuggest
                theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                }}
                focusInputOnSuggestionClick={false}
                onSuggestionSelected={this.handleSuggestionSelected}
                suggestions={this.state.suggestions}
                onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestionsContainer={renderSuggestionsContainer}
                renderSuggestion={(suggestion, { isHighlighted }) => renderSuggestionContainer(suggestionRenderer(suggestion), suggestion, isHighlighted)}
                renderInputComponent={renderInput.bind(this)}
                shouldRenderSuggestions={this.shouldRenderSuggestions}
                inputProps={{
                    required: this.isRequired(),
                    error,
                    helperText,
                    classes,
                    value: valueRenderer(value),
                    label: elementInfo && elementInfo.text,
                    disabled: disabled || ( elementInfo && elementInfo.readonly),
                    onChange: this.handleChange,
                }}
            />
        );
    }
}

const ClassComponentStyler = props => {
    const classes = useStyles(props);
    const Component = props.component;
    
    return <Component classes={classes} {...props}/>
}

export default props => <ClassComponentStyler component={EAMSelect} {...props}/>;