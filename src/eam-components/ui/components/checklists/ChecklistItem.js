import React, {Component} from 'react';
import ChecklistItemInput from './ChecklistItemInput';
import ChecklistItemNotes from './ChecklistItemNotes';
import Collapse from '@material-ui/core/Collapse';
import ChecklistItemFollowUp from "./ChecklistItemFollowUp";
import ChecklistItemNotApplicableOptions from './ChecklistItemNotApplicableOptions';
import WSChecklists from '../../../tools/WSChecklists';

export default class ChecklistItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailsVisible: false,
            blocked: false,
            debounce: null
        }

        this.notes = React.createRef();
    }

    componentWillMount() {
        this.init(this.props.checklistItem);
    }

    componentWillUnmount() {
        const { debounce } = this.state;

        if(debounce !== null) {
            clearTimeout(debounce.timeout);
        }
    }

    componentWillReceiveProps(nextProps) {
        let checklistItemProps = nextProps.checklistItem;
        let checklistItemState = this.props.checklistItem;
        if (checklistItemProps && checklistItemState) {
            if (checklistItemProps.workOrderCode !== checklistItemState.workOrderCode) {
                this.init(checklistItemProps);
            }
            if (checklistItemProps.followUpWorkOrder !== checklistItemState.followUpWorkOrder) {
                let checklistItem = {
                    ...checklistItemState,
                    followUpWorkOrder: checklistItemProps.followUpWorkOrder
                }
                this.init(checklistItem);
            }
        }
    }

    init(checklistItem) {
        if (checklistItem) {
            this.setState({
                detailsVisible: !!checklistItem.notes || !!checklistItem.followUpWorkOrder  || checklistItem.followUp === '+'
            })
        }
    }

    getCheckListItemStyle = blocked => ({
        paddingTop: 5,
        paddingBottom: 5,
        pointerEvents: blocked ? 'none' : 'auto',
        flex: '1 1 auto',
    })

    firstLine = {
        display: "flex",
        alignItems: "stretch",
        minHeight: 48,
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    };

    firstLineDesc = {
        float: "left",
        display: "flex",
        alignItems: "center",
        pointerEvents: "initial",
        color: "rgba(0, 0, 0, 0.87)"
    };

    /**
     * Compute the style for notes div container
     *
     * @returns {{marginLeft: number, marginTop: number, position: string, display: string}}
     */
    checklistDetailsStyle = {
            marginLeft: -5,
            marginTop: -5,
            marginRight: -8,
            paddingRight: 3,
            display: "flex",
            flexDirection: "row"
    }

    checklistNotApplicableStyle = {
        paddingTop: 5,
        paddingBottom: 5,
        flex: '1 1 auto',
    }


    onChange(checklistItem, onFail) {
        const handleError = this.props.handleError;
        const DEBOUNCE_TIME_MS = 50;

        const request = () => {
            this.props.updateChecklistItem(checklistItem)
                .then(() =>{
                    this.props.resetSignatures(checklistItem.activityCode);
                }).catch(error => {
                    handleError(error);
                    this.props.onUpdateChecklistItem(this.state.debounce.oldChecklistItem);
                    this.setState({debounce: null});
                    onFail && onFail();
                }).finally(() => {
                    this.setState({blocked: false});
                });
        };

        this.setState(state => {
            if(state.debounce !== null) {
                clearTimeout(state.debounce.timeout);
            }

            this.props.onUpdateChecklistItem(checklistItem);

            return {
                blocked: true,
                debounce: {
                    oldChecklistItem: this.props.checklistItem,
                    ...state.debounce,
                    timeout: setTimeout(request, DEBOUNCE_TIME_MS),
                    // Copy the oldest checklist item (will be used to restore the UI)
                }
            }
        });
    }

    descClickHandler() {
        const notes = this.notes.current;

        this.setState((state, props) => {
            const detailsVisible = !state.detailsVisible;

            if(detailsVisible) {
                setTimeout(() => this.notes.current.focus(), 0);
            }

            return {detailsVisible}
        });

        const { checklistItem, taskCode } = this.props;
        if (checklistItem && checklistItem.notApplicableOptions === undefined) {
            WSChecklists.getChecklistDefinition(taskCode, checklistItem.checklistDefinitionCode).then(response => {
                this.setState({
                    notApplicableOptions: response.body.data.notApplicableOptions
                });
            });
        }
    }

    renderChecklistItemInput() {
        const { checklistItem, showError, disabled } = this.props;

        let fields = [];
        let options = {};

        // use until use of numeric values in result field is deprecated
        const clearResult = (newProps, type, value) => {
            delete newProps.result;
            return newProps;
        };

        const createField = ChecklistItemInput.createField;
        const {CHECKBOX, FINDING, NUMERIC} = ChecklistItemInput.FIELD;

        switch(checklistItem.type) {
            case "01":
                fields = [
                    createField(CHECKBOX, {code: "COMPLETED", desc:"Completed"})
                ];
                options.style = ChecklistItemInput.STYLE.SINGLE;
                break;
            case "02":
                fields = [
                    createField(CHECKBOX, {code: "YES", desc: "Yes"}),
                    createField(CHECKBOX, {code: "NO", desc: "No"})
                ];
                options.style = ChecklistItemInput.STYLE.SAMELINE;
                break;
            case "03":
                const MINIMUM_MIN_FINDINGS = 4;
                fields = [
                    createField(FINDING, {
                        dropdown:
                            checklistItem.possibleFindings.length >= Math.min(this.props.minFindingsDropdown, MINIMUM_MIN_FINDINGS)
                    })
                ];
                break;
            case "04":
            case "05":
                fields = [
                    createField(NUMERIC)
                ];
                options.beforeOnChange = clearResult;
                break;
            case "06":
                fields = [
                    createField(FINDING),
                    createField(NUMERIC)
                ];

                options.beforeOnChange = clearResult;
                break;
            case "07":
                fields = [
                    createField(CHECKBOX, {code: "OK", desc: "OK"}),
                    createField(CHECKBOX, {code: "REPAIRSNEEDED", desc: "Repairs Needed"}),
                    createField(FINDING)
                ];

                switch(checklistItem.result) {
                    case null:
                        checklistItem.possibleFindings = [];
                        break;
                    case "OK":
                        checklistItem.possibleFindings = [{code: "AM", desc: "Adjustments Made"}];
                        break;
                    case "REPAIRSNEEDED":
                        checklistItem.possibleFindings = [
                            {code: "RC", desc: "Repair Completed"},
                            {code: "TR", desc: "Temporary Repair"}
                        ];
                        break;
                }

                options.beforeOnChange = (newProps, type, value) => {
                    if(type === ChecklistItemInput.FIELD.CHECKBOX) {
                        delete newProps.finding;
                    }
                    return newProps;
                }
                break;
            case "08":
                fields = [
                    createField(CHECKBOX, {code: "GOOD", desc: "Good"}),
                    createField(CHECKBOX, {code: "POOR", desc: "Poor"})
                ];
                options.style = ChecklistItemInput.STYLE.SAMELINE;
                break;
            case "09":
            case "10":
                fields = [
                    createField(CHECKBOX, {code: "OK", desc: "OK"}),
                    createField(CHECKBOX, {code: "ADJUSTED", desc: "Adjusted"})
                ];

                if(checklistItem.type === "10") {
                    fields.push(createField(NUMERIC))
                }

                options.style = ChecklistItemInput.STYLE.SAMELINE;
                break;
            case "11":
            case "12":
                fields = [
                    createField(CHECKBOX, {code: "OK", desc: "OK"}),
                    createField(CHECKBOX, {code: "NONCONFORMITY", desc: "Nonconformity"}),
                ];

                if(checklistItem.type === "12") {
                    fields.push(createField(ChecklistItemInput.FIELD.NUMERIC))
                    options.beforeOnChange = (newProps, type, value) => {
                        if(type === ChecklistItemInput.FIELD.NUMERIC && newProps.result === null) {
                            newProps.result = "OK";
                        }
                        return newProps;
                    }
                }

                options.style = ChecklistItemInput.STYLE.SAMELINE;
                break;
        }

        if(fields === undefined) return <div/>

        return <ChecklistItemInput checklistItem={checklistItem} 
                                onChange={(value, onFail) => this.onChange(value, onFail)} 
                                fields={fields} options={options} 
                                showError={showError} 
                                disabled={disabled} />
    }

    colorStyle = color => ({
        display: "flex",
        marginRight: "15px",
        backgroundColor: color ? `#${color}` : undefined,
        border: 'solid 1px #d1d3d4',
        flex: '0 1 auto',
        width: '5px',
        margin: '10px 15px 10px 0px',
        marginRight: '15px',
        borderRadius: '30px'
    })

    containerStyle = blocked => ({
        display: 'flex',
        alignItems: "stretch",
        minHeight: 48,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: "dashed 1px #d1d3d4",
        opacity: blocked ? 0.5 : 1
    })

    render() {
        const { checklistItem } = this.props;
        const { notApplicableOptions } = this.state;
        return (
            <div style={this.containerStyle(this.state.blocked)}>
                {checklistItem.color ? <div style={this.colorStyle(checklistItem.color)}></div> : null}
                <div style={this.getCheckListItemStyle(this.state.blocked)}>
                    <div style={this.firstLine}>
                        <div style={this.firstLineDesc} onClick={this.descClickHandler.bind(this)}>
                            <label>{checklistItem.desc}</label>
                            {checklistItem.requiredToClose === true && <label style={{color: "red"}}> *</label>}
                        </div>
                        {this.renderChecklistItemInput()}
                    </div>

                    <Collapse in={this.state.detailsVisible}>
                        <div style={this.checklistDetailsStyle} >
                            <ChecklistItemNotes
                                ref={this.notes}
                                checklistItem={checklistItem}
                                onChange={value => this.onChange(value)}
                                disabled={this.props.disabled}
                            />
                            {!checklistItem.hideFollowUp && <ChecklistItemFollowUp
                                    checklistItem={checklistItem}
                                    onChange={value => this.onChange(value)}
                                    getWoLink={this.props.getWoLink}
                                    disabled={this.props.disabled}
                            />}
                        </div>
                        {Array.isArray(notApplicableOptions) && notApplicableOptions.length > 0 && <div style={this.checklistNotApplicableStyle} >
                            <ChecklistItemNotApplicableOptions
                                checklistItem={checklistItem}
                                notApplicableOptions={notApplicableOptions}
                                onChange={value => this.onChange(value)}
                                disabled={this.props.disabled}
                            />
                        </div>}
                    </Collapse>
                </div>
            </div>
        )
    }
}