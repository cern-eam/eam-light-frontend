import React from 'react';
import Autosuggest from 'react-autosuggest';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import withStyles from '@mui/styles/withStyles';
import InputAdornment from '@mui/material/InputAdornment';
import axios from "axios/index";

/**
 * Default input, if none is provided
 */

function getTextWidth (text) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    context.font = '16px Roboto';
    var metrics = context.measureText(text);
    return metrics.width;
}

function renderDefaultInput (inputProps) {
    const { classes, autoFocus, value, label, disabled, endAdornment, error, helperText, required, ...other } = inputProps;

    var inputAdornmentStyle = {
        height: 20,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        top: 6,
        left: 5 + getTextWidth(value),
        position: "absolute",
        pointerEvents: "none",
        fontSize: 16,
        color: "#9E9E9E"
    }

    return (
        <TextField
            required = {required}
            error={error}
            helperText={helperText}
            style={{overflow: "hidden"}}
            disabled = {disabled}
            margin="normal"
            label={label}
            autoFocus={autoFocus}
            className={classes.textField}
            value={value}
            InputProps={{
                endAdornment: (endAdornment && <InputAdornment style={inputAdornmentStyle}> — {endAdornment}</InputAdornment>),
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
        position: 'relative',
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        marginBottom: theme.spacing(3),
        left: 0,
        right: 0,
        zIndex: 10
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    textField: {
        width: '100%',
    },
});

/**
 * Autocomplete component
 * Possible props:
 *  - getSuggestions (required): should return a Promise of an object
 *  - placeholder (not required): Placeholder to display inside the input. Only needed if you use the default input rendering
 *  - getSuggestionValue(suggestion) (not required): return the value to display inside the input once a suggestion is selected
 *  - renderSuggestion (not required): define how you want to render a suggestion.
 *  - label (not required): label of the input
 */
class Autocomplete extends React.Component {
    state = {
        value: '',
        suggestions: []
    };

    componentDidMount () {
        this.setStateFromProps(this.props)
    }

    componentWillReceiveProps (nextProps) {
        this.setStateFromProps(nextProps)
    }

    setStateFromProps (props) {
        this.setValue({
            code: props.value || '',
            desc: props.valueDesc || ''
        })
    }

    // Input rendering
    renderInput = inputProps => renderDefaultInput(inputProps)

    // Fetch suggestions
    handleSuggestionsFetchRequested = ({ value }) => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {

            if (!!this.cancelSource) this.cancelSource.cancel();

            this.cancelSource = axios.CancelToken.source()

            this.props.getSuggestions(value, {cancelToken: this.cancelSource.token})
                .then(result => {
                    this.setState({
                        suggestions: result.body.data
                    });
                }).catch(error => {

                });
        }, 200)
    };

    handleChange = (event, { newValue }) => {
        // Initially, the onChange only happened on lose focus (onBlur) event. However, both events
        //(onChange and onBlur) are fired at the same time, causing the onBlur() event to not have 
        //the updated state. Therefore, and until a complete redesign is in place, either the parent shall
        //be updated at every key stroke, or thehandleSuggestionsClearRequested must contain a workaround
        // this.setState({
        //     value: newValue,
        //     endAdornment: ''
        // })
        this.setValue({code: value, desc: endAdornment});
        //this.props.onChange(newValue); // This triggers a re-render all parent's child components
    }

    // Clear suggestions
    handleSuggestionsClearRequested = () =>
        this.setState({suggestions: []}, _ => {
            // Not the cleaniest of ways to achieve the parent update on the value: the parent should save 
            //a ref and call getValue for that purpose. However, and to avoid manipulating state directly,
            //we update it as a callback which should have the state updated
            this.props.onSuggestionChange(this.getValue().code, this.getValue().desc)
        })

    onSuggestionSelected = (event, { suggestion }) => {
        if (suggestion) this.props.onSuggestionChange(suggestion.code, suggestion.desc)
    }

    // Render
    renderSuggestion = suggestion =>
        this.props.renderSuggestion ? 
            this.props.renderSuggestion(suggestion)
            : (<div>
                {suggestion.code}
            </div>)

    getSuggestionValue = suggestion => suggestion.desc;

    shouldRenderSuggestions = value => !!value

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
                focusInputOnSuggestionClick={false}
                onSuggestionSelected={this.onSuggestionSelected.bind(this)}
                suggestions={this.state.suggestions}
                onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                renderSuggestionsContainer={renderSuggestionsContainer}
                getSuggestionValue={suggestion => suggestion.desc}
                renderSuggestion={(suggestion, { isHighlighted }) => renderSuggestionContainer(this.renderSuggestion(suggestion), suggestion, isHighlighted)}
                renderInputComponent={this.renderInput.bind(this)}
                shouldRenderSuggestions={this.shouldRenderSuggestions.bind(this)}
                inputProps={{
                    required: this.props.required,
                    error: this.props.error,
                    helperText: this.props.helperText,
                    endAdornment: this.getValue().desc,
                    classes,
                    placeholder: this.props.placeholder,
                    label: this.props.label,
                    value: this.getValue().code,
                    onChange: this.handleChange,
                    disabled: this.props.disabled
                }}
            />
        );
    }
}

export default withStyles(styles)(Autocomplete);