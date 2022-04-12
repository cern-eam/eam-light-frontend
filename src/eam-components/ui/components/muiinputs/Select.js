import React from 'react';
import Autosuggest from 'react-autosuggest';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import SvgIcon from '@material-ui/core/SvgIcon';
import EAMTextField from './EAMTextField';
/**
 * Default input, if none is provided
 */
function renderInput(inputProps) {
    const { classes, value, label, disabled, error, helperText, required, ...other } = inputProps;
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
            label={label}
            className={classes.textField}
            value={value}
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


const styles = theme => ({
    container: {
        flexGrow: 1,
        position: 'relative'
    },
    suggestionsContainerOpen: {
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
        maxHeight: "400px"
    },
    textField: {
        width: '100%',
    },
});


class Select extends React.Component {

    state = {
        value: '',
        suggestions: []
    };

    componentDidMount() {
        this.find(this.props.value, this.props.values)
    }

    componentWillReceiveProps(nextProps) {
        this.find(nextProps.value, nextProps.values)
    }

    find(value, values) {
        // If values are no there (yet) just set the value
        if (!values || (values && !value)) {
            this.setState(() => ({
                value: value
            }));
        }
        // Try to lookup the value in values
        else if (value && values) {
            const test = values.find(v => (v.code.toUpperCase() === value.toUpperCase() ||
                                         v.desc.toUpperCase() === value.toUpperCase()))
            this.setState(() => ({
                value: test ? test.desc : value
            }))

        }
    }

    handleSuggestionsFetchRequested = ({ value, reason }) => {
        let suggestions = this.props.values
        if (!suggestions) {
            return
        }

        if (value && (reason !== 'input-focused')) {
            suggestions = suggestions.filter(suggestion => {
                return (suggestion.code.toUpperCase().startsWith(value.toUpperCase()) ||
                        suggestion.desc.toUpperCase().startsWith(value.toUpperCase()))
            })
        }

        this.setState({
            suggestions: suggestions
        });
    };

    handleSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        }, this.propagateChange);
    };
    
    handleSuggestionSelected = (event, { suggestionValue }) => {
        this.setState({ value: suggestionValue });
    }

    handleChange = (event, { newValue }) => {
        this.setState({ value: newValue });
    };

    propagateChange = () => {
        if (!this.props.values) {
            this.props.onChange(this.state.value)
            return
        }

        let temp = this.props.values.find(v => v.desc === this.state.value)
        if (temp) {
            this.props.onChange(temp.code)
        } else {
            this.props.onChange(this.state.value)
        }
    }

    getSuggestionValue = (suggestion) => {
        return suggestion.desc;
    }

    shouldRenderSuggestions() {
        // Returning true causes the suggestions to be
        // rendered when the input is blank and focused
        return true
    }

    renderSuggestion(suggestion) {
        return (<div>{suggestion.desc}</div>);
    }

    render() {
        const { classes } = this.props;
        return (
            <Autosuggest
                theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                }}
                shouldRenderSuggestions={this.shouldRenderSuggestions}
                onSuggestionSelected={this.handleSuggestionSelected}
                suggestions={this.state.suggestions}
                focusInputOnSuggestionClick={false}
                onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                renderSuggestionsContainer={renderSuggestionsContainer}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={(suggestion, { isHighlighted }) => renderSuggestionContainer(this.renderSuggestion(suggestion), suggestion, isHighlighted)}
                renderInputComponent={renderInput.bind(this)}
                inputProps={{
                    required: this.props.required,
                    error: this.props.error,
                    helperText: this.props.helperText,
                    classes,
                    label: this.props.label,
                    value: this.state.value,
                    onChange: this.handleChange,
                    disabled: this.props.disabled
                }}
            />
        );
    }
}

export default withStyles(styles)(Select);