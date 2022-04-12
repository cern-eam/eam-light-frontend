import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import EAMTextField from './EAMTextField';
import axios from 'axios/index';
import React from 'react';
import Autosuggest from 'react-autosuggest';
import EAMBaseInput from './EAMBaseInput';

function getTextWidth(text) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = '16px Roboto';
    var metrics = context.measureText(text);
    return metrics.width;
}

function renderDefaultInput(inputProps) {
    const { classes, autoFocus, value, label, disabled, endAdornment, error, helperText, required, ...other } =
        inputProps;

    var inputAdornmentStyle = {
        top: 2,
        height: 20,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        left: 5 + getTextWidth(value),
        position: 'absolute',
        pointerEvents: 'none',
        fontSize: 16,
        color: '#9E9E9E',
    };

    return (
        <EAMTextField
            required={required}
            error={error}
            helperText={helperText}
            style={{ overflow: 'hidden' }}
            disabled={disabled}
            label={label}
            autoFocus={autoFocus}
            className={classes.textField}
            value={value}
            InputProps={{
                endAdornment: endAdornment && (
                    <InputAdornment style={inputAdornmentStyle}> — {endAdornment}</InputAdornment>
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
function renderSuggestionContainer(suggestion, isHighlighted) {
    return (
        <MenuItem selected={isHighlighted} component="div">
            <div>
                {
                    <div>
                        {suggestion.code} - {suggestion.desc}
                    </div>
                }
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

const styles = (theme) => ({
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        marginBottom: theme.spacing(3),
        width: '100%',
        zIndex: 10,
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: ({ maxHeight }) => ({
        margin: 0,
        padding: 0,
        listStyleType: 'none',
        ...(maxHeight && {
            maxHeight,
            overflowY: 'scroll',
        }),
    }),
    textField: {
        width: '100%',
    },
});

class EAMAutocomplete extends EAMBaseInput {
    state = {
        suggestions: [],
    };

    init = (props) => this.setValue({ code: props.value || '', desc: props.valueDesc || '' }, false);

    onSuggestionChange = (code, desc) => {
        // this.props.updateProperty(this.props.valueKey, code);
        // this.props.updateProperty(this.props.descKey, desc);
        this.setValue({ code, desc });
        this.onChangeHandler(code, { code, desc });
    };

    // Input rendering
    renderInput = (inputProps) => renderDefaultInput(inputProps);

    // Fetch suggestions
    handleSuggestionsFetchRequested = ({ value }) => {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            if (!!this.cancelSource) this.cancelSource.cancel();

            this.cancelSource = axios.CancelToken.source();

            if (value === this.state.suggestionsValue) {
                return;
            }
            this.props
                .autocompleteHandler(value, { cancelToken: this.cancelSource.token })
                .then((result) => {
                    this.setState(
                        {
                            suggestions: result.body.data,
                            suggestionsValue: value,
                        },
                        () => {
                            const valueFound = this.findValueInSuggestions(value, result.body.data);
                            if (
                                valueFound &&
                                (this.props.autoSelectSingleElement === undefined || this.props.autoSelectSingleElement)
                            ) {
                                this.onChangeHandler(valueFound.code, valueFound);
                            }
                        }
                    );
                })
                .catch((error) => {});
        }, 200);
    };

    handleChange = (event, { newValue }) => {
        // Initially, the onChange only happened on lose focus (onBlur) event. However, both events
        //(onChange and onBlur) are fired at the same time, causing the onBlur() event to not have
        //the updated state. Therefore, and until a complete redesign is in place, either the parent shall
        //be updated at every key stroke, or thehandleSuggestionsClearRequested must contain a workaround
        // const valueFound = this.findValueInSuggestions(newValue, this.state.suggestions)
        // if (valueFound) {
        //     this.onChangeHandler(valueFound.code, valueFound)
        //     this.setValue({code: valueFound.code, desc: valueFound.desc});
        // } else {
        //     this.setValue({code: newValue, desc: ''});
        // }
        this.setValue({ code: newValue, desc: '' });
    };

    findValueInSuggestions = (value, suggestions) => {
        const processedValue = value.trim();
        return suggestions.find((v) => processedValue === this.getSuggestionValue(v));
    };

    // Clear suggestions
    handleSuggestionsClearRequested = () => {};

    getSuggestionValue = (suggestion) => suggestion.code;

    shouldRenderSuggestions = (value) => !!value;

    onSuggestionSelected = (event, { suggestion }) => {
        if (suggestion) this.onSuggestionChange(suggestion.code, suggestion.desc);
    };

    renderComponent() {
        const { classes, elementInfo } = this.props;
        const { value, suggestions } = this.state;

        // Value should always be an object with code and desc
        if (!value) return null;

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
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestionsContainer={renderSuggestionsContainer}
                renderSuggestion={(suggestion, { isHighlighted }) =>
                    renderSuggestionContainer(suggestion, isHighlighted)
                }
                renderInputComponent={this.renderInput.bind(this)}
                shouldRenderSuggestions={this.shouldRenderSuggestions.bind(this)}
                inputProps={{
                    required: this.isRequired(),
                    error: this.state.error,
                    helperText: this.state.helperText,
                    endAdornment: value.desc,
                    classes,
                    placeholder: this.props.placeholder,
                    label: elementInfo && elementInfo.text,
                    value: value.code,
                    onChange: this.handleChange,
                    disabled: this.state.disabled || (elementInfo && elementInfo.readonly),
                    onBlur: () => {
                        setTimeout(() => {
                            const valueFound = this.findValueInSuggestions(
                                this.state.value ? this.state.value.code : '',
                                suggestions
                            );
                            if (!valueFound) this.onSuggestionChange('', '');
                        }, 100);
                    },
                }}
            />
        );
    }
}

export default withStyles(styles)(EAMAutocomplete);
