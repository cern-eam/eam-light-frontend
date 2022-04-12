import React from 'react';
import Select from '@mui/material/Select';
import FilterListIcon from '@mui/icons-material/FilterList';
import MenuItem from '@mui/material/MenuItem';

const filterSelectStyle = {
    fontSize: '0.8125rem',
};

const EISTableFilter = (props) => {
    const { filters, handleFilterChange, activeFilter } = props;

    const propagateFilterChange = (e) => {
        handleFilterChange(e.target.value);
    };

    return (
        filters &&
        Object.keys(filters).length && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <FilterListIcon style={{ marginLeft: 'auto' }} />
                <Select
                    style={filterSelectStyle}
                    value={filters[activeFilter].text}
                    onChange={propagateFilterChange}
                    renderValue={(value) => <span>{value}</span>}
                >
                    {Object.keys(filters).map((key) => (
                        <MenuItem key={key} value={key}>
                            {filters[key].text}
                        </MenuItem>
                    ))}
                </Select>
            </div>
        )
    );
};

export default EISTableFilter;
