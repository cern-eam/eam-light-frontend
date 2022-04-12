import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {withStyles} from '@material-ui/core/styles';
import EAMBaseInput, {formStyles} from "./EAMBaseInput";
import EAMFormLabel from "./EAMFormLabel";
import classNames from 'classnames';
import axios from "axios/index";
import 'react-select/dist/react-select.css';

const autocompleteOptionStyles = () => ({
    rowMenuDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline'
    },
    cell: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        marginRight: 5
    }
});

class AutocompleteOption extends Component {

    render() {
        const {classes, columnsCodes, columnsWidth} = this.props;
        return (
            <div className={this.props.className}
                 title={this.props.option.code}>
                <div className={classes.rowMenuDiv}>
                    {
                        columnsCodes.map((columnCode, index) =>
                            <div key={index} className={classes.cell} style={{width: columnsWidth[index]}}>
                                {this.props.option[columnCode]}
                            </div>
                        )
                    }
                </div>

            </div>
        );
    }
}

AutocompleteOption.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    isDisabled: PropTypes.bool,
    isFocused: PropTypes.bool,
    isSelected: PropTypes.bool,
    onFocus: PropTypes.func,
    onSelect: PropTypes.func,
    option: PropTypes.object.isRequired,
};

AutocompleteOption = withStyles(autocompleteOptionStyles)(AutocompleteOption);

const autocompleteValueStyles = () => ({
    rowMenuDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'baseline'
    },
    cell: {
        marginRight: 5
    },
    cellCode: {},
    cellDesc: {
        color: 'grey',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '100%'
    }
});

class AutocompleteValue extends Component {

    removeOption = () => {
        if (this.props.onRemove) {
            this.props.onRemove(this.props.value);
        }
    };

    render() {
        const {classes} = this.props;
        return (
            <div className="Select-value" title={this.props.value.code}>
                <span className="Select-value-icon" aria-hidden="true" onClick={this.removeOption}>x</span>
                <span className="Select-value-label">
                    <div className={classes.rowMenuDiv}>
                        <div className={classNames(classes.cell, classes.cellCode)}>
                        {this.props.value.code}
                        </div>
                        {
                            this.props.value.desc &&
                            <div className={classNames(classes.cell, classes.cellDesc)}>
                                - {this.props.value.desc}
                            </div>
                        }
                    </div>
                </span>
            </div>
        );
    }
}

AutocompleteValue.propTypes = {
    children: PropTypes.node,
    value: PropTypes.object
};

AutocompleteValue = withStyles(autocompleteValueStyles)(AutocompleteValue);

class AutocompleteValueSingle extends Component {

    render() {
        const {classes} = this.props;
        return (
            <div className="Select-value" title={this.props.value.code}>
                <span className="Select-value-label">
                    <div className={classes.rowMenuDiv}>
                        <div className={classNames(classes.cell, classes.cellCode)}>
                        {this.props.value.code}
                        </div>
                        {
                            this.props.value.desc &&
                            <div className={classNames(classes.cell, classes.cellDesc)}>
                                - {this.props.value.desc}
                            </div>
                        }
                    </div>
                </span>
            </div>
        );
    }
}

AutocompleteValueSingle.propTypes = {
    children: PropTypes.node,
    value: PropTypes.object
};

AutocompleteValueSingle = withStyles(autocompleteValueStyles)(AutocompleteValueSingle);

/**
 * Use the following property to override the width style
 * menuContainerStyle={{width: '400px'}}
 *
 * To make it a COMBO use
 * creatable={true}
 *
 * To make a multiple selection use
 * multi={false}
 * To avoid to delete selections with the backspace when multi is true use
 * backspaceRemoves={false}
 */

class EAMAutocomplete extends EAMBaseInput {

    constructor(props) {
        super(props);

        let newvalue = '';
        if (this.props.multi) {
            newvalue = this._adaptStringToArray(this.props.value);
        } else {
            newvalue = {
                code: this.props.value,
                desc: this.props.valueDesc
            }
        }

        this.state = {
            value: newvalue
        };
    }

    //To know if we are fetching desc
    fetchingDesc = false;

    componentDidMount() {
        if (this.props.refToReactSelect) {
            this.props.refToReactSelect(this.asyncComponent);
        }
        //If there is code, but not desc, fetch the desc if possible
        this.fetchAutocompleteDescription();
    }

    componentDidUpdate() {
        //If there is code, but not desc, fetch the desc if possible
        this.fetchAutocompleteDescription();
    }

    fetchAutocompleteDescription = () => {
        const {value, valueDesc, descKey, loadOptions} = this.props;
        if (!this.fetchingDesc && value && descKey && loadOptions && !valueDesc) {
            this.fetchingDesc = true;
            loadOptions(value).then(response => {
                //The response is
                const data = response.body.data;
                //Set desc if possible
                if (data && data.length > 0) {
                    this.onChange(data[0]);
                }
            }).catch(error => {
                console.log(error);
            })
        }
    };

    onChange = (selectedObject) => {
        this.setState({
            value: selectedObject,
        }, () => {
            this.onChangeHandler(this.props.valueKey, selectedObject && selectedObject.code ? selectedObject.code : selectedObject, selectedObject);
            if (this.props.descKey) {
                this.onChangeHandler(this.props.descKey, selectedObject && selectedObject.desc ? selectedObject.desc : selectedObject, selectedObject, false);
            }
            if (this.props.autoSelectSingleElement && this.props.multi) {
                this.asyncComponent.select.focus();
            }
        });
    };

    _adaptStringToArray = (string) => {
        if (string) {
            return string.split(',').map(s => ({
                code: s
            }));
        } else {
            return [];
        }
    };

    _getAutocompleteSuggestions = (code, autocompleteFunction) => {
        if (!code) {
            return Promise.resolve({options: []});
        }

        //Clear timeout
        clearTimeout(this.timeout);

        return this.makeDelay(this.props.delay).then(() => {
            //Cancel if there was request
            if (!!this.cancelSource) {
                this.cancelSource.cancel();
            }
            this.cancelSource = axios.CancelToken.source();
            return autocompleteFunction(code, {cancelToken: this.cancelSource.token})
        }).then(response => {
            // if there is only one result then select it automatically
            if (this.props.autoSelectSingleElement) {
                if (response.body.data && response.body.data.length === 1
                    && (!this.props.value || this.props.value.indexOf(response.body.data[0].code) < 0)) {
                    this.asyncComponent.select.selectValue(response.body.data[0]);
                    if (this.props.multi)
                        this.asyncComponent.select.focus();
                }
            }
            return response.body.data;
        }).then((json) => {
            return {options: json};
        }).catch(error => {
            /*Nothing*/
        });
    };

    makeDelay = (t, v) => {
        return new Promise((resolve) => {
            this.timeout = setTimeout(resolve.bind(null, v), t);
        });
    };

    componentWillReceiveProps = (nextProps) => {
        if (!nextProps.value) {
            this.setState({
                value: undefined
            });
        } else {
            this.setState(prevState => {
                let newvalue = '';
                if (nextProps.multi) {
                    newvalue = this._adaptStringToArray(nextProps.value);
                } else {
                    newvalue = {
                        ...prevState.value,
                        code: nextProps.value,
                        desc: nextProps.valueDesc,
                    }
                }
                return {
                    value: newvalue
                }
            });
        }
    };

    onFocusHandler = () => {
        //If no multi, set the value to be able to select it
        if (!this.props.multi && this.asyncComponent)
            this.asyncComponent.select.setState(({inputValue: this.props.value}));
    };

    render() {

        if (this.isHidden()) {
            return <div/>
        }

        const {elementInfo, classes, values, value, label, labelStyle, loadOptions, valueKey, columnsCodes, columnsWidth, validate, ...otherProps} = this.props;

        const AsyncComponent = this.props.creatable
            ? Select.AsyncCreatable
            : Select.Async;

        const selectClasses = this.props.selectStyle ? classNames(classes.select, this.props.selectStyle) : classes.select;

        return (
            <div className={classes.fieldContainer}>
                <EAMFormLabel required={this.isRequired()} label={label || (elementInfo && elementInfo.text)}
                              labelStyle={labelStyle} error={this.state.error}/>
                <AsyncComponent ref={ref => this.asyncComponent = ref}
                                multi={this.props.multi}
                                value={this.state.value}
                                onChange={this.onChange}
                                onFocus={this.onFocusHandler}
                                disabled={this.state.disabled || (elementInfo && elementInfo.readonly)}
                                className={!this.state.error ? selectClasses : `${selectClasses} ${classes.fieldInvalid}`}
                                valueKey="code"
                                labelKey="desc"
                                loadOptions={(code) => this._getAutocompleteSuggestions(code, loadOptions)}
                                backspaceRemoves={this.props.backspaceRemoves}
                                optionRenderer={(option) => <AutocompleteOption option={option}
                                                                                columnsCodes={columnsCodes}
                                                                                columnsWidth={columnsWidth}/>}
                                valueComponent={this.props.multi ? AutocompleteValue : AutocompleteValueSingle}
                                cache={false}
                                openOnFocus={true}
                                placeholder={this.props.placeholder}
                                searchPromptText={this.props.searchPromptText}
                                promptTextCreator={this.props.promptTextCreator}
                                arrowRenderer={() => (<span/>)}
                                filterOptions={(options, label) => options
                                    .filter(option => !this.props.creatable || option !== this.props.promptTextCreator(label))}
                                clearable={true}
                                {...otherProps}

                />
                {this.state.helperText && this.renderHelperText()}
            </div>
        );
    }

}

EAMAutocomplete.propTypes = {
    columnsCodes: PropTypes.array,
    columnsWidth: PropTypes.array,
    autoSelectSingleElement: PropTypes.bool,
    backspaceRemoves: PropTypes.bool
};

EAMAutocomplete.defaultProps = {
    columnsCodes: ['code', 'desc'],
    columnsWidth: ['30%', '70%'],
    delay: 200,
    searchPromptText: '',
    promptTextCreator: (label) => `Insert Code: ${label}`,
    autoSelectSingleElement: false,
    backspaceRemoves: true,
    placeholder: ''
};

export default withStyles(formStyles)(EAMAutocomplete);