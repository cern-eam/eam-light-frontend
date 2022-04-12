import React, {Component} from 'react';

export default class MoreDetailsList extends Component{

    detailsPanelStyle = {
        flexWrap: 'wrap',
        display: 'flex',
        padding: 10
    };

    detailStyle = {
        margin: 15
    };

    detailLabelStyle = {
        fontWeight: 430
    };

    generateDetailRows = () => {
        return this.props.details.map(detail => {
            return <div style={this.detailStyle}>
                        <div style={this.detailLabelStyle}>{detail.name}:</div>
                        <div>{detail.value}</div>
                    </div>
                })
    };

    render(){
        return(
            <div style={this.detailsPanelStyle}>
                {this.generateDetailRows()}
            </div>
        )
    }
}