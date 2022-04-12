import React, { Component } from 'react';
import TextField from '@mui/material/TextField';
import DataGridFilterTypeMenu from './EAMGridFilterTypeMenu';
import withStyles from '@mui/styles/withStyles';
import { DatePicker, DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Icon } from '@mui/material';
import { format } from 'date-fns';
import EAMGridFilterInput from './EAMGridFilterInput'
import Constants from '../../../../../../enums/Constants'
import Tooltip from '@mui/material/Tooltip';
import ClickAwayListener from '@mui/material/ClickAwayListener';

const styles = {
    filterCell: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 5,
        marginRight: 5
    },

    filterInput: {
        width: "100%",
        backgroundColor: "#FFFFFF"
    },
    filterInnerInput: {
        fontSize: '10px'
    },
    input: {
        backgroundColor: 'red'
    }
};




/**
 * Data grid filter, with:
 *  - a select to choose which kind of filter (DataGridFilterTypeMenu component)
 *  - an input text to choose the actual value with which we want to filter
 */
class DataGridTableFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filterValue: props.filter.fieldValue,
            inputDisabled: false,
        }
    }

    componentWillReceiveProps (nextProps) {
        const filterValue = (nextProps.filter && nextProps.filter.fieldValue) || '';
        this.setState({filterValue})
    }

    _handleChangeValue = (event) => {
        this.setState({
            filterValue: event.target.value
        });

        this.props.setFilter({
            fieldName: this.props.filter.fieldName,
            fieldValue: event.target.value
        }, this.props.dataType);
    };

    _handleChangeDate = (date) => {
        this.setState({
            filterValue: date ? date : null
        });
        this.props.setFilter({
            fieldName: this.props.filter.fieldName,
            fieldValue: this._readDate(date)
        }, this.props.dataType);
    };

    _handleChangeDateTime = (date) => {
        this.setState({
            filterValue: date ? date : null
        });
        this.props.setFilter({
            fieldName: this.props.filter.fieldName,
            fieldValue: this._readDateTime(date)
        }, this.props.dataType);
    };

    _handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.props.runSearch();
        }
    };

    _readDate = date => date ? format(date, Constants.DATE_FORMAT_VALUE) : ''

    _readDateTime = date => date ? format(date, Constants.DATETIME_FORMAT_VALUE) : ''

    _onChange(option) {
        // Disable input text depending on filter operator chosen
        const disableInput = option.operator === 'IS EMPTY' || option.operator === 'NOT EMPTY';
        this.setState({
            inputDisabled: disableInput
        });
        this.props.setFilter(option);
    }

    render() {
        const { classes, dataType, filter, width } = this.props;
        const { filterValue } = this.state;
        const dataTypes = [
            'VARCHAR',
            'MIXVARCHAR',
            'DECIMAL',
            'NUMBER',
            'DATETIME',
            'DATE',
        ]

        const tooltips = {
            'DATE': Constants.DATE_FORMAT_DISPLAY.toUpperCase(),
            'DATETIME': Constants.DATETIME_FORMAT_DISPLAY.toUpperCase()
        }

        return (
            <div className={classes.filterCell}>
                <DataGridFilterTypeMenu
                    filter={filter}
                    onChange={this._onChange.bind(this)}
                    dataType={dataType}
                />

                {dataType && dataTypes.includes(dataType) &&
                    <TooltipWrapper text={tooltips[dataType]} enabled={tooltips[dataType]}>
                        {({ openTooltip }) => (
                            <EAMGridFilterInput
                                onClick={openTooltip}
                                disabled={this.state.inputDisabled}
                                width={width}
                                value={filterValue}
                                onChange={this._handleChangeValue}
                                onKeyPress = {this._handleKeyPress}
                                dataType={dataType}/>
                        )}
                    </TooltipWrapper>
                }
            </div>
        );
    }
}

const CustomTooltip = withStyles(() => ({
    tooltip: {
      fontSize: 'small',
    },
  }))(Tooltip);

const TooltipWrapper = (props) => {
    const { children, text, enabled } = props;
    const [open, setOpen] = React.useState(false);
    const closeTooltip = () => setOpen(false);
    const openTooltip = () => setOpen(true);

    return (
        enabled
        ? (
            <ClickAwayListener onClickAway={closeTooltip}>
                <CustomTooltip
                    onClose={closeTooltip}
                    open={open}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title={text}
                    arrow>
                    {children({ openTooltip })}
                </CustomTooltip>
            </ClickAwayListener>
        ): children({})
    )
}

export default withStyles(styles)(DataGridTableFilter);