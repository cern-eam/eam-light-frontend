import React, { useState } from "react";
import {
    TextField,
    Checkbox,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Menu,
    IconButton,
    InputAdornment,
    Select,
    InputBase,
} from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import {
    ContainStart,
    ContainEnd,
    Contain,
    GreaterThan,
    GreaterThanOrEqual,
    LessThan,
    LessThanOrEqual,
    Equal,
    NotEqualVariant,
    Rhombus,
    RhombusOutline
} from 'mdi-material-ui';
import { DatePicker, DateTimePicker } from "@mui/lab";
import {
    Clear as ClearIcon,
    InsertInvitation as CalendarIcon
  } from "@mui/icons-material";
import { useAsyncDebounce, useMountedLayoutEffect } from "react-table";
import { format as formatDate } from "date-fns";


const BootstrapInput = withStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: "white",
        borderRadius: '4px',
        border: '1px solid #e4e3e3',
        '& .MuiInput-underline:before': {
            border: 'none',
            transition: 'none',
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottom: '2px solid #c5c5c5',
        },
        '& .MuiSelect-select:focus': {
            backgroundColor: "white",
            borderRadius: '4px',
        }
    },
    input: {
        paddingLeft: '4px'
    }
  }))(InputBase);

const FilterTextField = withStyles({
    root: {
        backgroundColor: "white",
        borderRadius: '4px',
        border: '1px solid #e4e3e3',
        width: '100%',
        '& .MuiInput-underline:before': {
            border: 'none',
            transition: 'none',
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottom: '2px solid #c5c5c5',
        }
    },
  })(TextField);

const CustomStartAdornment = withStyles({
    positionStart: {
        marginRight: 0
    }
})(InputAdornment);

const OPERATORS = {
    NOT_EQUAL: '!=',
    EQUAL: '=',
    BEGINS: 'BEGINS',
    CONTAINS: 'CONTAINS',
    ENDS: 'ENDS',
    GREATER_THAN: 'GREATER_THAN',
    GREATER_THAN_EQUALS: 'GREATER_THAN_EQUALS',
    IS_EMPTY: 'IS EMPTY',
    LESS_THAN: 'LESS_THAN',
    LESS_THAN_EQUALS: 'LESS_THAN_EQUALS',
    NOT_EMPTY: 'NOT EMPTY',
}

const CHECKBOX_FILTERS = {
    CHECKED: -1,
    UNCHECKED: 0,
    INDETERMINATE: undefined
}

const getCheckedValue = (valueType) => Number(valueType) === CHECKBOX_FILTERS.CHECKED;
const isIndeterminate = (valueType) => valueType === null || valueType === CHECKBOX_FILTERS.INDETERMINATE;

const getDefaultFilterValue = (column) => {
    const baseFitler = {
        fieldName: column.id,
        fieldValue: undefined,
        joiner: 'AND',
        operator: OPERATORS.BEGINS
    }
    switch(column.dataType){
        case 'DATE':
        case 'DATETIME':
        case 'DECIMAL':
        case 'NUMBER':
            return {
                ...baseFitler,
                operator: 'GREATER_THAN'
            }
        case 'CHKBOOLEAN':
            return {
                ...baseFitler,
                operator: '=',
                fieldValue: CHECKBOX_FILTERS.INDETERMINATE
            };
        default:
            return baseFitler
    }
}

const getEAMFilterOperators = ({ column }) => {
    const { dataType } = column;
    switch (dataType) {
        case "VARCHAR":
        case "MIXVARCHAR":
            return [
                {'value': OPERATORS.BEGINS, 'label': 'Starts with', 'icon': <ContainStart/>},
                {'value': OPERATORS.CONTAINS, 'label': 'Contains', 'icon': <Contain/>},
                {'value': OPERATORS.ENDS, 'label': 'Ends with', 'icon': <ContainEnd/>},
                {'value': OPERATORS.EQUAL, 'label': 'Equals', 'icon': <Equal/>},
                {'value': OPERATORS.NOT_EQUAL, 'label': 'Does not equal', 'icon': <NotEqualVariant/>},
                {'value': OPERATORS.IS_EMPTY, 'label': 'Is empty', 'icon': <RhombusOutline/>},
                {'value': OPERATORS.NOT_EMPTY, 'label': 'Is not empty', 'icon': <Rhombus/>}
            ];
        case "DATE":
        case "DATETIME":
            return [
                {'value': OPERATORS.GREATER_THAN, 'label': 'Greater than', 'icon': <GreaterThan/>},
                {'value': OPERATORS.EQUAL, 'label': 'Equals', 'icon': <Equal/>},
                {'value': OPERATORS.LESS_THAN, 'label': 'Less than', 'icon': <LessThan/>},
                {'value': OPERATORS.LESS_THAN_EQUALS, 'label': 'Less than or equals', 'icon': <LessThanOrEqual/>},
                {'value': OPERATORS.GREATER_THAN_EQUALS, 'label': 'Greater than or equals', 'icon': <GreaterThanOrEqual/>},
                {'value': OPERATORS.IS_EMPTY, 'label': 'Is empty', 'icon': <RhombusOutline/>},
                {'value': OPERATORS.NOT_EMPTY, 'label': 'Is not empty', 'icon': <Rhombus/>},
                {'value': OPERATORS.NOT_EQUAL, 'label': 'Does not equal', 'icon': <NotEqualVariant/>}
            ];
        case "DECIMAL":
        case "NUMBER":
            return [
                {'value': OPERATORS.EQUAL, 'label': 'Equals', 'icon': <Equal/>},
                {'value': OPERATORS.LESS_THAN, 'label': 'Less than', 'icon': <LessThan/>},
                {'value': OPERATORS.GREATER_THAN, 'label': 'Greater than', 'icon': <GreaterThan/>},
                {'value': OPERATORS.LESS_THAN_EQUALS, 'label': 'Less than or equals', 'icon': <LessThanOrEqual/>},
                {'value': OPERATORS.GREATER_THAN_EQUALS, 'label': 'Greater than or equals', 'icon': <GreaterThanOrEqual/>},
                {'value': OPERATORS.IS_EMPTY, 'label': 'Is empty', 'icon': <RhombusOutline/>},
                {'value': OPERATORS.NOT_EMPTY, 'label': 'Is not empty', 'icon': <Rhombus/>},
                {'value': OPERATORS.NOT_EQUAL, 'label': 'Does not equal', 'icon': <NotEqualVariant/>}
            ];
        default:
            return [];
    }
}

const QualifierMenuAdornment = ({ column, localFilter, setLocalFilter }) => {
    const [anchorEl, setAnchorEl] = useState();
    const operators = React.useMemo(() => getEAMFilterOperators({ column }), [column]);
    const currentQualifier = operators.find(q => q.value === localFilter.operator);
    const currentQualiferIcon = currentQualifier && currentQualifier.icon;
    const onMenuOpen = React.useCallback(e => {
        setAnchorEl(e.currentTarget);
        e.stopPropagation();
    }, []);
    const onMenuClose = React.useCallback(e => {
        setAnchorEl(null);
        e.stopPropagation();
    }, []);
    const onMenuOptionClick = React.useCallback(operator => e => {
        setAnchorEl(null)
        setLocalFilter({ ...localFilter, operator: operator.value })
        e.stopPropagation();
    }, [localFilter, setLocalFilter]);
    return React.useMemo(() => (
        <CustomStartAdornment position="start">
            <IconButton
                size="small"
                onClick={onMenuOpen}
            >
                {currentQualiferIcon}
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={onMenuClose}
            >
                {operators.map(operator => (
                <MenuItem
                    key={operator.value}
                    selected={operator.value === localFilter.operator}
                    onClick={onMenuOptionClick(operator)}>
                    <ListItemIcon>
                        {operator.icon}
                    </ListItemIcon>
                    <ListItemText primary={operator.label} />
                </MenuItem>
                ))}
            </Menu>
        </CustomStartAdornment>
    ), [anchorEl, currentQualiferIcon, localFilter.operator, onMenuClose, onMenuOpen, onMenuOptionClick, operators]);
}

const DateFilterAdornment = ({ localFilter, setLocalFilter }) => {
    return React.useMemo(() => localFilter.fieldValue ? (
            <InputAdornment position="end">
                <IconButton
                    size="small"
                    onClick={e => {
                        setLocalFilter({ ...localFilter, fieldValue: null, _dateValue: null })
                        e.stopPropagation();
                    }}>
                    <ClearIcon />
                </IconButton>
            </InputAdornment>
        ) : (
            <InputAdornment position="end">
                <IconButton size="small">
                    <CalendarIcon />
                </IconButton>
            </InputAdornment>
        )
    , [localFilter, setLocalFilter])
}

const EAMCellField = ({ column, value }) => {
    switch (column.dataType) {
        case "CHKBOOLEAN":
            return (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                }}>
                    <Checkbox
                        disabled
                        checked={(value ?? '').toLowerCase() === "true"}
                        indeterminate={!value}
                        style={{
                            padding: 0,
                        }}
                        color="primary" />
                </div>
            );
        default:
            return String(value);
    }
}

const EAMFilterField = ({ column }) => {
    const { dataType, filterValue: filter, setFilter } = column;
    const [localFilter, setLocalFilter] = useState(filter || getDefaultFilterValue(column));

    useMountedLayoutEffect(() => setLocalFilter(filter || getDefaultFilterValue(column)), [filter])

    const debouncedSetFilter = useAsyncDebounce(filter => setFilter(filter), process.env.NODE_ENV === 'development' ? 100 : 0);

    const updateFilter = React.useCallback((filter) => {
        setLocalFilter(filter);
        debouncedSetFilter(filter);
    }, [debouncedSetFilter]);

    const handleFilterTextFieldChange = React.useCallback(
        e => updateFilter({ ...localFilter, fieldValue: e.target.value })
    , [localFilter, updateFilter]);

    const handleCheckboxChange = React.useCallback(() => {
        const values = [CHECKBOX_FILTERS.CHECKED, CHECKBOX_FILTERS.UNCHECKED, CHECKBOX_FILTERS.INDETERMINATE];
        const nextValueIndex = (values.findIndex(e => e === Number(localFilter.fieldValue)) + 1) % values.length;
        const nextValue = values[nextValueIndex];
        updateFilter({
            ...localFilter,
            fieldValue: nextValue,
        });
    }, [localFilter, updateFilter]);

    const handleDatePickersChange = React.useCallback(
        value => updateFilter({ ...localFilter, fieldValue: formatDate(value, "dd-MMM-yyyy"), _dateValue: value })
    , [localFilter, updateFilter]);

    switch (dataType) {
        case "VARCHAR":
        case "MIXVARCHAR":
        case "DECIMAL":
        case "NUMBER":
            return (
                <FilterTextField
                    value={localFilter.fieldValue || ''}
                    onChange={handleFilterTextFieldChange}
                    disabled={[OPERATORS.IS_EMPTY, OPERATORS.NOT_EMPTY].includes(localFilter.operator)}
                    InputProps={{
                        startAdornment: (
                            <QualifierMenuAdornment
                                column={column}
                                localFilter={localFilter}
                                setLocalFilter={updateFilter} />
                        )
                    }}
                />
            )
        case "CHKBOOLEAN":
            return (
                <Checkbox
                    checked={getCheckedValue(localFilter.fieldValue)}
                    indeterminate={isIndeterminate(localFilter.fieldValue)}
                    onChange={handleCheckboxChange}
                    style={{
                        padding: 5,
                    }}
                    color="primary"
                />
            );
        case "DATE":
            return (
                <DatePicker
                    autoOk
                    clearable
                    variant="inline"
                    ampm={false}
                    value={localFilter._dateValue || null}
                    onChange={handleDatePickersChange}
                    inputFormat="dd-MMM-yyyy"
                    renderInput={(props) => <FilterTextField {...props} />}
                    InputProps={{
                        startAdornment: (
                            <QualifierMenuAdornment
                                column={column}
                                localFilter={localFilter}
                                setLocalFilter={updateFilter} />
                        ),
                        endAdornment: (
                            <DateFilterAdornment
                                localFilter={localFilter}
                                setLocalFilter={updateFilter} />
                        )
                    }}
                />
            );
        case "DATETIME":
            return (
                <DateTimePicker
                    autoOk
                    clearable
                    variant="inline"
                    ampm={false}
                    value={localFilter._dateValue || null}
                    onChange={handleDatePickersChange}
                    format="dd-MMM-yyyy HH:mm"
                    renderInput={(props) => <FilterTextField {...props}/>}
                    InputProps={{
                        startAdornment: (
                            <QualifierMenuAdornment
                                column={column}
                                localFilter={localFilter}
                                setLocalFilter={updateFilter} />
                        ),
                        endAdornment: (
                            <DateFilterAdornment
                                localFilter={localFilter}
                                setLocalFilter={updateFilter} />
                        )
                    }}
                />
            );
        case "__SELECT":
            return (
                <Select
                native
                    value={localFilter.fieldValue || ''}
                    onChange={handleFilterTextFieldChange}
                    input={<BootstrapInput />}
                >
                    <option value="" />
                    {column?.selectOptions?.map(e => (
                        <option value={column.getOptionValue(e)} key={column.getOptionValue(e)}>
                            {column.getOptionLabel(e)}
                        </option>
                    ))}
                </Select>
            )
        default:
            return null;
    }
}

const getRowAsAnObject = (row) => {
    return row.cell.reduce(
        (acc, cell) => ({
            ...acc,
            [cell.t]: cell.value || "",
        }),
        {}
    );
};

export {
    EAMFilterField,
    EAMCellField,
    getRowAsAnObject,
}

export default {
    getEAMFilterOperators,
}