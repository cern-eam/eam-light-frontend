import React from 'react';
import SearchResult from "./SearchResult";
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';

export default class SearchResults extends React.Component {

    render() {
        return (
            <div style={{fontSize: "16px"}}>
            <Table>
                <TableBody>
                    {this.props.data.map(this.mapItemToSearchResult.bind(this))}
                </TableBody>
            </Table>
        </div>
        );
    }

    mapItemToSearchResult(item, number) {
        let isSelected = item.code === this.props.selectedItemCode;

        return (
            <TableRow key={number} selected={isSelected} style={isSelected ? {backgroundColor : "#def4fa"} : {}}>
                <SearchResult data={item} keyword={this.props.keyword} selected={isSelected} />
            </TableRow>
        );
    }
}
 