import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';
import './EISTable.css';
import { Link } from 'react-router-dom';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import Constants from '../../../enums/Constants';
import { parse } from 'date-fns';

const whiteBackground = {
    backgroundColor: '#ffffff',
};

const greyBackground = {
    backgroundColor: '#eeeeee',
};

/**
 * Receive as props:
 * data: Containing all the results from the server
 * headers: Headers to display
 * propCodes: Properties of the data to be displayed (In the desired order)
 * linksMap: Information of the columns that will be displayed as links
 */
class EISTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowWidth: window.innerWidth,
            orderBy: props.defaultOrderBy === undefined ? -1 : props.propCodes.indexOf(props.defaultOrderBy),
            order: props.defaultOrder === undefined ? Constants.SORT_ASC : props.defaultOrder,
            data: [],
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.onWindowSizeChange);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowSizeChange);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data !== state.data) {
            return {
                ...state,
                data: props.data,
            };
        }
        return null;
    }

    onWindowSizeChange = () => {
        this.setState(() => ({
            windowWidth: window.innerWidth,
        }));
    };

    resetSort = () => {
        this.setState(() => ({
            orderBy: -1,
            order: Constants.SORT_ASC,
        }));
    };
    createSortHandler = (property) => (event) => {
        this.handleRequestSort(event, property);
    };

    createSortHandlerMobile = (event) => {
        this.handleRequestSort(event, event.target.value);
    };

    handleRequestSort = (event, property) => {
        //By default asc
        let order = Constants.SORT_ASC;
        if (property >= 0 && property < this.props.propCodes.length) {
            if (this.state.orderBy === property && this.state.order === Constants.SORT_ASC) {
                order = Constants.SORT_DESC;
            }
        } else {
            /*It's desc*/
            order = Constants.SORT_DESC;
        }
        //Assign final data
        this.setState({ order, orderBy: property });
    };

    renderContent = (propCode, content) => {
        //Normal content
        if (!this.props.linksMap.get(propCode)) {
            if (content[propCode] === 'true' || content[propCode] === 'false') {
                //Checkbox
                return <Checkbox checked={content[propCode] === 'true'} value={content[propCode]} disabled={true} />;
            }
            return content[propCode];
        }

        //Link
        const link = this.props.linksMap.get(propCode);
        if (link.linkType === 'fixed') {
            return (
                <Link to={{ pathname: `${link.linkPrefix}${link.linkValue}${content[propCode]}` }}>
                    {content[propCode]}
                </Link>
            );
        } else if (link.linkType === 'absolute') {
            return (
                <a href={`${link.linkValue}${content[propCode]}`} target="_blank">
                    {content[propCode]}
                </a>
            );
        } else {
            /*Dynamic link*/
            return <Link to={{ pathname: `${link.linkPrefix}${content[link.linkValue]}` }}>{content[propCode]}</Link>;
        }
    };

    renderSortByValuesMobile = () => {
        // Create list of values
        let listValues = this.props.headers.map((elem) => `${elem} (Asc)`);
        listValues = listValues.concat(this.props.headers.map((elem) => `${elem} (Desc)`));

        return (
            <Select
                native
                value={this.state.orderBy}
                onChange={this.createSortHandlerMobile}
                className="eamTableDropdown"
            >
                <option value={-1}>Select sort column...</option>
                {listValues.map((elem, index) => (
                    <option key={index} value={index}>
                        {elem}
                    </option>
                ))}
            </Select>
        );
    };

    propagateFilterChange = (e) => {
        this.resetSort();
        this.props.handleFilterChange(e.target.value);
    };

    getSortedData = ({ data, orderBy, order, propCode, keyMap }) => {
        if (orderBy < 0) {
            return data;
        }

        const keyFunction = typeof keyMap[propCode] === 'function' ? keyMap[propCode] : TRANSFORM_KEYS.DEFAULT;

        // Schwartzian transform
        const sorted = data
            .map((datum, index) => [datum, keyFunction(datum[propCode]), index])
            .sort(([, a, aIndex], [, b, bIndex]) => (a < b ? -1 : a > b ? 1 : aIndex - bIndex))
            .map(([datum]) => datum);

        return order === Constants.SORT_DESC ? sorted.reverse() : sorted;
    };

    render() {
        const { data, order, orderBy, windowWidth } = this.state;
        const { headers, maxMobileSize, onRowClick, propCodes, selectedRowIndexes, stylesMap, keyMap } = this.props;
        const isMobile = windowWidth < maxMobileSize;
        const rowsSelectable = selectedRowIndexes && onRowClick;
        const tableData = this.getSortedData({ data, orderBy, order, propCode: propCodes[orderBy], keyMap });

        if (isMobile) {
            return (
                <Table className="responsiveTable" style={{ overflow: 'visible' }}>
                    <TableHead>
                        <TableRow key={'sortby'}>
                            <TableCell>Sort by:</TableCell>
                            <TableCell>{this.renderSortByValuesMobile()}</TableCell>
                        </TableRow>
                    </TableHead>
                    {tableData.map((content, index) => {
                        // every second row is grey
                        let style = index % 2 === 0 ? whiteBackground : greyBackground;

                        if (selectedRowIndexes && selectedRowIndexes.includes(index)) {
                            style = {
                                ...style,
                                backgroundColor: '#2b82ff',
                            };
                        }

                        if (rowsSelectable) {
                            style = {
                                ...style,
                                cursor: 'pointer',
                            };
                        }

                        /**
                         * A prop called stylesMap is used to customize the table
                         * If items with the property "full" have to be marked red,
                         * pass the folowing:
                         * stylesMap={{
                         *      full: {
                         *          backgroundColor: "red"
                         *      }
                         * }}
                         */
                        if (stylesMap) {
                            Object.keys(stylesMap).forEach((key) => {
                                if (content[key]) {
                                    style = {
                                        ...style,
                                        ...stylesMap[key],
                                    };
                                }
                            });
                        }

                        return (
                            <TableBody
                                key={index}
                                style={style}
                                onClick={rowsSelectable ? () => onRowClick(content, index) : () => {}}
                            >
                                {propCodes.map((prop, index) => (
                                    <TableRow key={prop} style={style}>
                                        <TableCell>{headers[index]}</TableCell>
                                        <TableCell>{this.renderContent(prop, content)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        );
                    })}
                </Table>
            );
        }

        return (
            <React.Fragment>
                <Table className="responsiveTable" style={{ overflow: 'visible' }}>
                    <TableHead>
                        <TableRow key={'key'}>
                            {headers.map((header, index) => (
                                <TableCell key={header} sortDirection={orderBy === index ? order : false}>
                                    <Tooltip title="Sort" placement={'bottom-end'} enterDelay={300}>
                                        <TableSortLabel
                                            active={orderBy === index}
                                            direction={order}
                                            onClick={this.createSortHandler(index)}
                                        >
                                            {header}
                                        </TableSortLabel>
                                    </Tooltip>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData.map((content, index) => {
                            let style = {};

                            if (selectedRowIndexes && selectedRowIndexes.includes(index)) {
                                style = {
                                    ...style,
                                    backgroundColor: '#2196f3',
                                };
                            }

                            if (rowsSelectable) {
                                style = {
                                    ...style,
                                    cursor: 'pointer',
                                };
                            }

                            if (stylesMap) {
                                Object.keys(stylesMap).forEach((key) => {
                                    if (content[key]) {
                                        style = {
                                            ...style,
                                            ...stylesMap[key],
                                        };
                                    }
                                });
                            }

                            return (
                                <TableRow
                                    key={index}
                                    style={style}
                                    onClick={rowsSelectable ? () => onRowClick(content, index) : () => {}}
                                >
                                    {propCodes.map((propCode) => (
                                        <TableCell key={propCode}>{this.renderContent(propCode, content)}</TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </React.Fragment>
        );
    }
}

EISTable.propTypes = {
    linksMap: PropTypes.instanceOf(Map),
    data: PropTypes.array.isRequired,
    headers: PropTypes.array.isRequired,
    propCodes: PropTypes.array.isRequired,
    selectedRowIndexes: PropTypes.array,
    onRowClick: PropTypes.func,
    stylesMap: PropTypes.object,
    keyMap: PropTypes.object,
    defaultOrderBy: PropTypes.string,
    defaultOrder: PropTypes.string,
};

EISTable.defaultProps = {
    linksMap: new Map(),
    maxMobileSize: 540,
    keyMap: {},
};

export default React.memo(EISTable);

const GENERATE_DATE_PARSER = (parseString) => (value) => parse(value, parseString, new Date()).getTime();

export const TRANSFORM_KEYS = {
    DATE_DD_MMM_YYYY: GENERATE_DATE_PARSER('dd-MMM-yyyy'),
    DATE_DD_MMM_YYYY_HH_MM: GENERATE_DATE_PARSER('dd-MMM-yyyy HH:mm'),
    DEFAULT: (value) => (isNaN(value) ? value : +value),
    GENERATE_DATE_PARSER,
};
